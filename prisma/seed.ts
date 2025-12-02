import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Limpar dados existentes
  await prisma.payment.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.medication.deleteMany();
  await prisma.supplement.deleteMany();
  await prisma.treatment.deleteMany();
  await prisma.supportNetwork.deleteMany();
  await prisma.doctorSlot.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.user.deleteMany();

  // Criar usuária gestante de teste
  const hashedPassword = await bcrypt.hash('123456', 10);
  const pregnant = await prisma.user.create({
    data: {
      email: 'gestante@eros.com',
      password: hashedPassword,
      name: 'Ana Paula Silva',
      phone: '(11) 98888-7777',
      userType: 'PREGNANT',
      shareCode: 'ABCD-1234', // Código para compartilhar
    },
  });

  console.log('✅ Pregnant user created:', pregnant.email);
  console.log('🔗 Share code:', pregnant.shareCode);

  // Criar membro da rede de apoio (mãe)
  const supportMother = await prisma.user.create({
    data: {
      email: 'mae@eros.com',
      password: hashedPassword,
      name: 'Maria Silva',
      phone: '(11) 97777-6666',
      userType: 'SUPPORT_NETWORK',
    },
  });

  // Vincular mãe com gestante
  await prisma.supportNetwork.create({
    data: {
      pregnantId: pregnant.id,
      supportId: supportMother.id,
      relationship: 'Mãe',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Support network member created:', supportMother.email);

  // Criar outro membro da rede de apoio (companheiro)
  const supportPartner = await prisma.user.create({
    data: {
      email: 'companheiro@eros.com',
      password: hashedPassword,
      name: 'Carlos Silva',
      phone: '(11) 96666-5555',
      userType: 'SUPPORT_NETWORK',
    },
  });

  // Vincular companheiro com gestante
  await prisma.supportNetwork.create({
    data: {
      pregnantId: pregnant.id,
      supportId: supportPartner.id,
      relationship: 'Companheiro',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Support network member created:', supportPartner.email);

  // Criar médicos
  const doctors = await Promise.all([
    prisma.doctor.create({
      data: {
        name: 'Dr. João Silva',
        email: 'joao.silva@eros.com',
        specialty: 'Cardiologia',
        crm: '12345-SP',
        avatar: 'https://placehold.co/400x400',
        bio: 'Especialista em cardiologia com foco em prevenção e tratamento de doenças cardiovasculares.',
        rating: 4.8,
        reviewCount: 120,
        experience: 15,
        price: 250.0,
      },
    }),
    prisma.doctor.create({
      data: {
        name: 'Dra. Maria Santos',
        email: 'maria.santos@eros.com',
        specialty: 'Dermatologia',
        crm: '67890-SP',
        avatar: 'https://placehold.co/400x400',
        bio: 'Dermatologista especializada em tratamentos estéticos e clínicos.',
        rating: 4.9,
        reviewCount: 98,
        experience: 12,
        price: 280.0,
      },
    }),
    prisma.doctor.create({
      data: {
        name: 'Dr. Carlos Oliveira',
        email: 'carlos.oliveira@eros.com',
        specialty: 'Ortopedia',
        crm: '11111-RJ',
        avatar: 'https://placehold.co/400x400',
        bio: 'Ortopedista com vasta experiência em cirurgias e tratamentos ortopédicos.',
        rating: 4.7,
        reviewCount: 156,
        experience: 20,
        price: 300.0,
      },
    }),
  ]);

  console.log('✅ Doctors created:', doctors.length);

  // Criar slots de horários para os próximos 7 dias
  const today = new Date();
  const slots = [];

  for (let day = 0; day < 7; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() + day);

    const times = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

    for (const doctor of doctors) {
      for (const time of times) {
        slots.push({
          doctorId: doctor.id,
          date,
          time,
          available: true,
        });
      }
    }
  }

  await prisma.doctorSlot.createMany({
    data: slots,
  });

  console.log('✅ Doctor slots created:', slots.length);

  // Criar tratamento de exemplo para a gestante
  const treatment = await prisma.treatment.create({
    data: {
      userId: pregnant.id,
      medications: {
        create: [
          {
            name: 'Losartana 50mg',
            dosage: '1 comprimido',
            frequency: '1x ao dia',
            time: '08:00',
            duration: 'Uso contínuo',
            startDate: new Date('2025-01-01'),
          },
          {
            name: 'Atorvastatina 20mg',
            dosage: '1 comprimido',
            frequency: '1x ao dia',
            time: '22:00',
            duration: 'Uso contínuo',
            startDate: new Date('2025-01-01'),
          },
        ],
      },
      supplements: {
        create: [
          {
            name: 'Vitamina D3',
            dosage: '2000 UI',
            frequency: '1x ao dia',
            time: '09:00',
            duration: '3 meses',
            startDate: new Date('2025-01-15'),
          },
        ],
      },
    },
  });

  console.log('✅ Treatment created with medications and supplements');

  // Criar agendamento de exemplo para a gestante
  const appointment = await prisma.appointment.create({
    data: {
      userId: pregnant.id,
      doctorId: doctors[0].id,
      date: new Date('2025-12-05'),
      time: '10:00',
      status: 'CONFIRMED',
      notes: 'Consulta de rotina pré-natal',
    },
  });

  console.log('✅ Appointment created');

  // Criar pagamento
  await prisma.payment.create({
    data: {
      userId: pregnant.id,
      appointmentId: appointment.id,
      amount: doctors[0].price,
      method: 'CREDIT_CARD',
      status: 'COMPLETED',
    },
  });

  console.log('✅ Payment created');

  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('👤 GESTANTE:');
  console.log('📧 Email: gestante@eros.com');
  console.log('🔑 Senha: 123456');
  console.log('🔗 Código de compartilhamento: ABCD-1234');
  console.log('');
  console.log('👥 REDE DE APOIO:');
  console.log('📧 Mãe: mae@eros.com | Senha: 123456');
  console.log('📧 Companheiro: companheiro@eros.com | Senha: 123456');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
