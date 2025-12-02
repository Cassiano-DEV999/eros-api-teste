import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const doctors = await prisma.doctor.findMany({
      select: {
        id: true,
        name: true,
        specialty: true,
        crm: true,
        avatar: true,
        rating: true,
        reviewCount: true,
        experience: true,
        price: true,
      },
      orderBy: {
        rating: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao buscar médicos',
      },
      { status: 500 }
    );
  }
}
