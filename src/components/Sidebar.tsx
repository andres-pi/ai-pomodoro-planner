"use client";
import React from 'react';
import { Home, Calendar as CalendarIcon, CheckSquare, Settings, Timer } from 'lucide-react';

const NavItem = ({ icon: Icon, label, active = false }: any) => {
  return (
    <button style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1.25rem',
      padding: '1.125rem 2rem',
      width: '100%',
      borderRadius: 'var(--radius-full)',
      backgroundColor: active ? 'var(--color-surface-container-lowest)' : 'transparent',
      color: active ? 'var(--color-primary)' : '#8b8b96', // soft muted tone
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: active ? '0 10px 30px rgba(49, 50, 56, 0.04)' : 'none',
      marginBottom: '0.25rem',
    }}>
      <Icon size={20} strokeWidth={active ? 2.5 : 2} />
      <span className="text-label-disciplined">{label}</span>
    </button>
  );
};

export default function Sidebar() {
  return (
    <aside style={{
      width: '300px',
      height: '100vh',
      position: 'sticky',
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      padding: '3rem 0 3rem 1.5rem', 
      backgroundColor: 'transparent',
    }}>
      {/* Branding */}
      <div style={{ padding: '0 1.5rem', marginBottom: '4rem' }}>
        <h2 style={{ color: 'var(--color-primary)', fontSize: '1.5rem', letterSpacing: '-0.03em', fontWeight: 700 }}>
          The Atelier
        </h2>
        <div style={{ marginTop: '2.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary)', fontWeight: 600 }}>Bonjour, Chérie</h3>
            <p className="text-label-disciplined" style={{ fontSize: '0.65rem', color: '#9a9a9d', marginTop: '0.5rem' }}>
              STAY DISCIPLINED TODAY.
            </p>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingRight: '1.5rem' }}>
        <NavItem icon={Home} label="HOME" />
        <NavItem icon={CalendarIcon} label="CALENDAR" active />
        <NavItem icon={CheckSquare} label="TASKS" />
        <NavItem icon={Settings} label="SETTINGS" />
      </nav>

      {/* Focus CTA */}
      <div style={{ padding: '0 1.5rem 0 0' }}>
        <button style={{
          width: '100%',
          padding: '1.25rem',
          borderRadius: 'var(--radius-full)',
          background: 'linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-dim) 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.75rem',
          boxShadow: '0 15px 35px rgba(100, 83, 162, 0.25)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(100, 83, 162, 0.35)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 15px 35px rgba(100, 83, 162, 0.25)';
        }}
        >
          <Timer size={20} />
          <span style={{ fontWeight: 700, letterSpacing: '0.02em' }}>START POMODORO</span>
        </button>
      </div>
    </aside>
  );
}
