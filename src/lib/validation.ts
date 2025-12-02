import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  phone: z.string().optional(),
  userType: z.enum(['PREGNANT', 'SUPPORT_NETWORK']).optional(),
  shareCode: z.string().optional(),
  relationship: z.string().optional(),
});

export const appointmentSchema = z.object({
  doctorId: z.string(),
  date: z.string(),
  time: z.string(),
  notes: z.string().optional(),
});

export const medicationSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  dosage: z.string().min(1, 'Dosagem é obrigatória'),
  frequency: z.string().min(1, 'Frequência é obrigatória'),
  time: z.string().min(1, 'Horário é obrigatório'),
  duration: z.string().min(1, 'Duração é obrigatória'),
  startDate: z.string(),
});

export const supplementSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  dosage: z.string().min(1, 'Dosagem é obrigatória'),
  frequency: z.string().min(1, 'Frequência é obrigatória'),
  time: z.string().min(1, 'Horário é obrigatório'),
  duration: z.string().min(1, 'Duração é obrigatória'),
  startDate: z.string(),
});

export const paymentSchema = z.object({
  appointmentId: z.string(),
  method: z.enum(['CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'CASH']),
});
