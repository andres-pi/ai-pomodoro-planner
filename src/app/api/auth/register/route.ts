import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName } = await req.json();

    if (!email || !password || !firstName) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "El usuario ya existe" }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: password, // Note: En producción implementar bcrypt
        name: `${firstName} ${lastName || ''}`.trim(),
      }
    });

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    return NextResponse.json({ error: "Error interno al crear usuario" }, { status: 500 });
  }
}
