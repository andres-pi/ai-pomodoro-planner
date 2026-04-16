"use client";
import React, { useState } from 'react';
import { useTimerStore } from '@/store/timerStore';

export default function SettingsPanel() {
  const { workDuration, shortBreakDuration, longBreakDuration, sessionsToLongBreak, updateSettings } = useTimerStore();

  // Helper local states just for the input fields
  const [work, setWork] = useState(workDuration / 60);
  const [short, setShort] = useState(shortBreakDuration / 60);
  const [long, setLong] = useState(longBreakDuration / 60);
  const [sessions, setSessions] = useState(sessionsToLongBreak);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings({
      workDuration: work * 60,
      shortBreakDuration: short * 60,
      longBreakDuration: long * 60,
      sessionsToLongBreak: sessions,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const InputField = ({ label, value, onChange, min = 1, max = 60 }: any) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
      <label className="text-label-disciplined" style={{ color: '#6A6C76', fontSize: '0.65rem' }}>{label}</label>
      <input 
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          backgroundColor: 'var(--color-surface-container-high)',
          border: 'none',
          borderBottom: '2px solid transparent',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          fontSize: '1rem',
          fontFamily: 'var(--font-body)',
          color: 'var(--color-on-surface)',
          outline: 'none',
          transition: 'all 0.3s ease',
          boxShadow: 'inset 0 2px 4px rgba(49, 50, 56, 0.02)'
        }}
        onFocus={(e) => e.target.style.borderBottom = '2px solid var(--color-primary)'}
        onBlur={(e) => e.target.style.borderBottom = '2px solid transparent'}
      />
    </div>
  );

  return (
    <div 
      className="shadow-ambient" 
      style={{ 
        backgroundColor: 'var(--color-surface-container-lowest)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}
    >
      <div>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', letterSpacing: '-0.02em', fontWeight: 700 }}>
          Manual Configuration
        </h3>
        <p style={{ color: '#6A6C76', fontSize: '0.875rem', marginTop: '0.5rem' }}>
          Configura tus propios límites para los períodos de concentración. Debes "Aplicar Cambios" para sobreescribir el temporizador actual.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <InputField label="FOCUS TIME (MIN)" value={work} onChange={setWork} max={120} />
        <InputField label="SHORT BREAK (MIN)" value={short} onChange={setShort} max={30} />
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <InputField label="LONG BREAK (MIN)" value={long} onChange={setLong} max={60} />
        <InputField label="SESSIONS PER ROUND" value={sessions} onChange={setSessions} max={10} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button
            onClick={handleSave}
            style={{
              padding: '1rem 2.5rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: '0.875rem',
              letterSpacing: '0.05em',
              transition: 'all 0.2s ease',
              opacity: saved ? 0.8 : 1,
              boxShadow: '0 10px 20px rgba(100, 83, 162, 0.2)'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {saved ? "✓ APPLIED" : "APPLY CHANGES"}
          </button>
      </div>

    </div>
  );
}
