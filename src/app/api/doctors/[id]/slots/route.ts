import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');

    if (!dateParam) {
      return NextResponse.json(
        {
          success: false,
          error: 'Data é obrigatória',
        },
        { status: 400 }
      );
    }

    const date = new Date(dateParam);
    date.setHours(0, 0, 0, 0);

    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    const slots = await prisma.doctorSlot.findMany({
      where: {
        doctorId: id,
        date: {
          gte: date,
          lt: nextDay,
        },
        available: true,
      },
      select: {
        time: true,
      },
      orderBy: {
        time: 'asc',
      },
    });

    const availableSlots = slots.map((slot) => slot.time);

    return NextResponse.json({
      success: true,
      data: {
        doctorId: id,
        date: dateParam,
        availableSlots,
      },
    });
  } catch (error) {
    console.error('Get doctor slots error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao buscar horários',
      },
      { status: 500 }
    );
  }
}
