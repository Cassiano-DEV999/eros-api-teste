import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { getAccessiblePregnantId } from '@/lib/support-access';

export async function GET(request: NextRequest) {
  try {
    const jwtPayload = getUserFromRequest(request);
    
    if (!jwtPayload) {
      return NextResponse.json(
        {
          success: false,
          error: 'Token inválido ou não fornecido',
        },
        { status: 401 }
      );
    }

    const pregnantId = await getAccessiblePregnantId(jwtPayload.userId);
    
    if (!pregnantId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Acesso negado',
        },
        { status: 403 }
      );
    }

    let treatment = await prisma.treatment.findFirst({
      where: {
        userId: pregnantId,
      },
      include: {
        medications: {
          where: { active: true },
          orderBy: { createdAt: 'desc' },
        },
        supplements: {
          where: { active: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!treatment) {
      treatment = await prisma.treatment.create({
        data: {
          userId: pregnantId,
        },
        include: {
          medications: true,
          supplements: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: treatment,
    });
  } catch (error) {
    console.error('Get treatments error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao buscar tratamentos',
      },
      { status: 500 }
    );
  }
}
