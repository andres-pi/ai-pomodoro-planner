import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt"
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        
        // Verificación simulada simple contra local DB (En el futuro usar bcrypt, ideal para testing)
        if (user && user.passwordHash === credentials.password) {
          return { id: user.id, email: user.email, name: user.name };
        }
        
        // Si el usuario no existe localmente, lo auto-creamos (mock local register)
        if (!user) {
          const newUser = await prisma.user.create({
            data: {
               email: credentials.email,
               passwordHash: credentials.password,
               name: credentials.email.split('@')[0]
            }
          });
          return { id: newUser.id, email: newUser.email, name: newUser.name };
        }
        
        return null;
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub;
      }
      return session;
    }
  }
};
