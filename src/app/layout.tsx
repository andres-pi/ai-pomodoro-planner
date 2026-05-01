import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Manrope } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Providers } from "@/components/Providers";
import ThemeProvider from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";

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
  title: "Clocky | AI Planner",
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
        <ThemeProvider>
          <Providers>
            <div className="app-layout">
              <Sidebar />
              <main className="main-content">
                {children}
              </main>
            </div>
            <Toaster 
              position="bottom-right"
              toastOptions={{
                success: { icon: null },
                error: { icon: null },
                style: {
                  background: 'var(--color-surface-container-lowest)',
                  color: 'var(--color-on-surface)',
                  border: '1px solid var(--color-surface-container-high)',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  boxShadow: '0 20px 40px rgba(49, 50, 56, 0.05)',
                },
              }}
            />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
