import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      message: 'Logout realizado com sucesso',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao processar logout',
      },
      { status: 500 }
    );
  }
}
