import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { paymentSchema } from '@/lib/validation';
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

    // Obter ID da gestante acessível (próprio ID ou gestante vinculada)
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

    const payments = await prisma.payment.findMany({
      where: {
        userId: pregnantId,
      },
      include: {
        appointment: {
          include: {
            doctor: {
              select: {
                name: true,
                specialty: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error('Get payments error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao buscar pagamentos',
      },
      { status: 500 }
    );
  }
}

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
    
    const validation = paymentSchema.safeParse(body);
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

    const { appointmentId, method } = validation.data;

    const appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        userId: pregnantId,
      },
      include: {
        doctor: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        {
          success: false,
          error: 'Agendamento não encontrado',
        },
        { status: 404 }
      );
    }

    const existingPayment = await prisma.payment.findUnique({
      where: { appointmentId },
    });

    if (existingPayment) {
      return NextResponse.json(
        {
          success: false,
          error: 'Pagamento já existe para este agendamento',
        },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.create({
      data: {
        userId: pregnantId,
        appointmentId,
        amount: appointment.doctor.price,
        method,
        status: 'PENDING',
      },
      include: {
        appointment: {
          include: {
            doctor: {
              select: {
                name: true,
                specialty: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: payment,
        message: 'Pagamento criado com sucesso',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create payment error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao criar pagamento',
      },
      { status: 500 }
    );
  }
}
