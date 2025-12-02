import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const doctor = await prisma.doctor.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        specialty: true,
        crm: true,
        avatar: true,
        bio: true,
        rating: true,
        reviewCount: true,
        experience: true,
        price: true,
        createdAt: true,
      },
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

    return NextResponse.json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.error('Get doctor error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao buscar médico',
      },
      { status: 500 }
    );
  }
}
