import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const payment = await prisma.payment.findFirst({
      where: {
        id,
        userId: jwtPayload.userId,
      },
      include: {
        appointment: {
          include: {
            doctor: {
              select: {
                name: true,
                specialty: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        {
          success: false,
          error: 'Pagamento não encontrado',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error('Get payment error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao buscar pagamento',
      },
      { status: 500 }
    );
  }
}
