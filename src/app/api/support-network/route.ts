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
      select: { userType: true },
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

    if (user.userType === 'PREGNANT') {
      const supportNetwork = await prisma.supportNetwork.findMany({
        where: { pregnantId: jwtPayload.userId },
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
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({
        success: true,
        data: {
          type: 'pregnant',
          supportNetwork,
        },
      });
    } else {
      const supportLink = await prisma.supportNetwork.findUnique({
        where: { supportId: jwtPayload.userId },
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
              shareCode: true,
              createdAt: true,
            },
          },
        },
      });

      if (!supportLink) {
        return NextResponse.json(
          {
            success: false,
            error: 'Vínculo com gestante não encontrado',
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          type: 'support',
          link: supportLink,
        },
      });
    }
  } catch (error) {
    console.error('Support network error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao buscar rede de apoio',
      },
      { status: 500 }
    );
  }
}
