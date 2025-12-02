import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // Verificar se já tem dados
    const existingUsers = await prisma.user.count();
    if (existingUsers > 0) {
      return NextResponse.json({
        success: false,
        message: 'Database already has data. Use force=true to reseed.',
      });
    }

    // Hash da senha padrão
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Criar usuários
    const pregnant = await prisma.user.create({
      data: {
        email: 'gestante@eros.com',
        password: hashedPassword,
        name: 'Maria Silva',
        userType: 'PREGNANT',
        shareCode: 'ABCD-1234',
        pregnantWeeks: 20,
      },
    });

    const mother = await prisma.user.create({
      data: {
        email: 'mae@eros.com',
        password: hashedPassword,
        name: 'Ana Santos',
        userType: 'MOTHER',
      },
    });

    const partner = await prisma.user.create({
      data: {
        email: 'companheiro@eros.com',
        password: hashedPassword,
        name: 'João Silva',
        userType: 'PARTNER',
      },
    });

    // Criar médicos
    const doctors = await Promise.all([
      prisma.doctor.create({
        data: {
          name: 'Dra. Patricia Costa',
          specialty: 'Obstetrícia',
          crm: '12345-SP',
          phone: '(11) 99999-1111',
          email: 'patricia.costa@clinic.com',
          bio: 'Especialista em gestação de alto risco',
          avatar: 'https://i.pravatar.cc/150?img=47',
          availableSlots: ['09:00', '10:00', '14:00', '15:00', '16:00'],
        },
      }),
      prisma.doctor.create({
        data: {
          name: 'Dr. Roberto Mendes',
          specialty: 'Ginecologia',
          crm: '23456-SP',
          phone: '(11) 99999-2222',
          email: 'roberto.mendes@clinic.com',
          bio: 'Especialista em saúde da mulher',
          avatar: 'https://i.pravatar.cc/150?img=33',
          availableSlots: ['08:00', '09:00', '13:00', '14:00', '17:00'],
        },
      }),
      prisma.doctor.create({
        data: {
          name: 'Dra. Juliana Ferreira',
          specialty: 'Ultrassonografia',
          crm: '34567-SP',
          phone: '(11) 99999-3333',
          email: 'juliana.ferreira@clinic.com',
          bio: 'Especialista em ultrassonografia obstétrica',
          avatar: 'https://i.pravatar.cc/150?img=45',
          availableSlots: ['10:00', '11:00', '15:00', '16:00'],
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        users: { pregnant, mother, partner },
        doctors,
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Use POST to seed the database',
  });
}
