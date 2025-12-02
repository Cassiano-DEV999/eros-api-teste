import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { appointmentSchema } from '@/lib/validation';
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

    const appointments = await prisma.appointment.findMany({
      where: {
        userId: pregnantId,
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialty: true,
            avatar: true,
            price: true,
          },
        },
        payment: {
          select: {
            id: true,
            status: true,
            method: true,
            amount: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao buscar agendamentos',
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
    
    const validation = appointmentSchema.safeParse(body);
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

    const { doctorId, date, time, notes } = validation.data;

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      return NextResponse.json(
        {
          success: false,
          error: 'Médico não encontrado',
        },
        { status: 404 }
      );
    }

    const appointmentDate = new Date(date);
    const slot = await prisma.doctorSlot.findFirst({
      where: {
        doctorId,
        date: appointmentDate,
        time,
        available: true,
      },
    });

    if (!slot) {
      return NextResponse.json(
        {
          success: false,
          error: 'Horário não disponível',
        },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId: pregnantId,
        doctorId,
        date: appointmentDate,
        time,
        notes,
        status: 'PENDING',
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialty: true,
            avatar: true,
            price: true,
          },
        },
      },
    });

    await prisma.doctorSlot.update({
      where: { id: slot.id },
      data: { available: false },
    });

    return NextResponse.json(
      {
        success: true,
        data: appointment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create appointment error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao criar agendamento',
      },
      { status: 500 }
    );
  }
}
