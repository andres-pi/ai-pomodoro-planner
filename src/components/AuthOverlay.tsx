"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { Lock } from "lucide-react";
import Link from "next/link";

export default function AuthOverlay({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-surface-container-low)' }}>
        <p className="text-label-disciplined" style={{ color: 'var(--color-primary)' }}>Cargando Sesión...</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <div style={{
        filter: status === "unauthenticated" ? 'blur(8px)' : 'none',
        transition: 'filter 0.5s ease',
        pointerEvents: status === "unauthenticated" ? 'none' : 'auto',
        height: '100%',
        opacity: status === "unauthenticated" ? 0.6 : 1
      }}>
        {children}
      </div>

      {status === "unauthenticated" && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(244, 243, 248, 0.2)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="shadow-ambient" style={{
            backgroundColor: 'var(--color-surface-container-lowest)',
            padding: '3rem 4rem',
            borderRadius: 'var(--radius-xl)',
            textAlign: 'center',
            maxWidth: '500px',
            border: '1px solid rgba(100, 83, 162, 0.1)'
          }}>
            <div style={{ backgroundColor: 'var(--color-primary-container)', width: '72px', height: '72px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <Lock size={32} color="var(--color-primary)" />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-on-surface)', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
              Clocky Fan
            </h2>
            <p style={{ color: '#6A6C76', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              Esta función es exclusiva para usuarios. Inicia sesión para guardar tus eventos, medir tu disciplina y sincronizar tu racha en la nube.
            </p>
            <Link href="/settings" style={{ textDecoration: 'none' }}>
              <button style={{
                backgroundColor: 'var(--color-on-surface)', color: 'white', padding: '1rem 2rem', borderRadius: 'var(--radius-full)', fontWeight: 600, width: '100%', fontFamily: 'var(--font-body)', fontSize: '1rem',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)', cursor: 'pointer'
              }}>
                Iniciar Sesión
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
