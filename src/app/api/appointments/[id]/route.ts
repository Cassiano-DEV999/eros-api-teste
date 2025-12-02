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

    const appointment = await prisma.appointment.findFirst({
      where: {
        id,
        userId: jwtPayload.userId,
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialty: true,
            avatar: true,
            bio: true,
            price: true,
          },
        },
        payment: true,
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

    return NextResponse.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao buscar agendamento',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const appointment = await prisma.appointment.findFirst({
      where: {
        id,
        userId: jwtPayload.userId,
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

    await prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    await prisma.doctorSlot.updateMany({
      where: {
        doctorId: appointment.doctorId,
        date: appointment.date,
        time: appointment.time,
      },
      data: { available: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Agendamento cancelado com sucesso',
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao cancelar agendamento',
      },
      { status: 500 }
    );
  }
}
