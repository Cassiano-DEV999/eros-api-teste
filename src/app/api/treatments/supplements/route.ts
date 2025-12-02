import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { supplementSchema } from '@/lib/validation';
import { getAccessiblePregnantId } from '@/lib/support-access';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    
    const validation = supplementSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dados inválidos',
          details: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { name, dosage, frequency, time, duration, startDate } = validation.data;

    let treatment = await prisma.treatment.findFirst({
      where: {
        userId: pregnantId,
      },
    });

    if (!treatment) {
      treatment = await prisma.treatment.create({
        data: {
          userId: pregnantId,
        },
      });
    }

    const supplement = await prisma.supplement.create({
      data: {
        treatmentId: treatment.id,
        name,
        dosage,
        frequency,
        time,
        duration,
        startDate: new Date(startDate),
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: supplement,
        message: 'Suplemento adicionado com sucesso',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Add supplement error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao adicionar suplemento',
      },
      { status: 500 }
    );
  }
}
