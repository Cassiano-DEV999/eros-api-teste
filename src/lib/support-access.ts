import { prisma } from '@/lib/prisma';

export async function getAccessiblePregnantId(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      userType: true,
      supportingPregnant: {
        select: {
          pregnantId: true,
          status: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  if (user.userType === 'PREGNANT') {
    return user.id;
  }

  if (user.userType === 'SUPPORT_NETWORK' && user.supportingPregnant) {
    if (user.supportingPregnant.status === 'ACTIVE') {
      return user.supportingPregnant.pregnantId;
    }
  }

  return null;
}

export async function canAccessAppointment(
  userId: string,
  appointmentId: string
): Promise<boolean> {
  const pregnantId = await getAccessiblePregnantId(userId);
  
  if (!pregnantId) {
    return false;
  }

  const appointment = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
      userId: pregnantId,
    },
  });

  return !!appointment;
}

export async function canAccessTreatment(
  userId: string,
  treatmentId: string
): Promise<boolean> {
  const pregnantId = await getAccessiblePregnantId(userId);
  
  if (!pregnantId) {
    return false;
  }

  const treatment = await prisma.treatment.findFirst({
    where: {
      id: treatmentId,
      userId: pregnantId,
    },
  });

  return !!treatment;
}
