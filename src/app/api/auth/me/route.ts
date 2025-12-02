import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

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

    const user = await prisma.user.findUnique({
      where: { id: jwtPayload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        userType: true,
        shareCode: true,
        createdAt: true,
        updatedAt: true,
        supportNetwork: {
          select: {
            id: true,
            relationship: true,
            status: true,
            createdAt: true,
            support: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        supportingPregnant: {
          select: {
            id: true,
            relationship: true,
            status: true,
            createdAt: true,
            pregnant: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Usuário não encontrado',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao buscar usuário',
      },
      { status: 500 }
    );
  }
}
