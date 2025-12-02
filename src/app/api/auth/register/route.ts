import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken, generateShareCode } from '@/lib/auth';
import { registerSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = registerSchema.safeParse(body);
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

    const { email, password, name, phone, userType, shareCode, relationship } = validation.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email já cadastrado',
        },
        { status: 400 }
      );
    }

    if (userType === 'SUPPORT_NETWORK') {
      if (!shareCode) {
        return NextResponse.json(
          {
            success: false,
            error: 'Código de vinculação é obrigatório para rede de apoio',
          },
          { status: 400 }
        );
      }

      if (!relationship) {
        return NextResponse.json(
          {
            success: false,
            error: 'Relacionamento é obrigatório para rede de apoio',
          },
          { status: 400 }
        );
      }

      const pregnant = await prisma.user.findUnique({
        where: { shareCode },
      });

      if (!pregnant || pregnant.userType !== 'PREGNANT') {
        return NextResponse.json(
          {
            success: false,
            error: 'Código de vinculação inválido',
          },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await hashPassword(password);

    let generatedShareCode: string | null = null;
    if (userType === 'PREGNANT') {
      let isUnique = false;
      while (!isUnique) {
        generatedShareCode = generateShareCode();
        const existing = await prisma.user.findUnique({
          where: { shareCode: generatedShareCode },
        });
        if (!existing) isUnique = true;
      }
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone: phone || null,
        userType: userType || 'PREGNANT',
        shareCode: generatedShareCode,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        userType: true,
        shareCode: true,
        createdAt: true,
      },
    });

    if (user.userType === 'PREGNANT') {
      await prisma.treatment.create({
        data: {
          userId: user.id,
        },
      });
    }

    if (userType === 'SUPPORT_NETWORK' && shareCode && relationship) {
      const pregnant = await prisma.user.findUnique({
        where: { shareCode },
      });

      if (pregnant) {
        await prisma.supportNetwork.create({
          data: {
            pregnantId: pregnant.id,
            supportId: user.id,
            relationship,
            status: 'ACTIVE',
          },
        });
      }
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          user,
          token,
        },
        message: userType === 'SUPPORT_NETWORK' 
          ? 'Cadastro realizado e vinculado com sucesso!' 
          : 'Cadastro realizado com sucesso!',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao processar registro',
      },
      { status: 500 }
    );
  }
}
