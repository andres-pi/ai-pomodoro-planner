import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Manrope } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Providers } from "@/components/Providers";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: 'swap',
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "The Atelier | AI Planner",
  description: "A disciplined sweetheart environment to focus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${manrope.variable} ${plusJakarta.variable}`}>
        <Providers>
          <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
            <Sidebar />
            <main style={{ 
              flex: 1, 
              backgroundColor: 'var(--color-surface-container-low)', 
              borderTopLeftRadius: 'var(--radius-xl)', 
              borderBottomLeftRadius: 'var(--radius-xl)',
              margin: '1.5rem 1.5rem 1.5rem 0',
              boxShadow: '-10px 0 40px rgba(49, 50, 56, 0.03)',
              overflowX: 'hidden',
              overflowY: 'auto',
              position: 'relative' // For absolute inner positioning if needed
            }}>
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
