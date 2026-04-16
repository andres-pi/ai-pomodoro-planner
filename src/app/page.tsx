"use client";
import React from 'react';
import Timer from '@/components/Timer';
import { useTimerStore } from '@/store/timerStore';

export default function Home() {
  const { currentSession, sessionsToLongBreak } = useTimerStore();
  const progressPercent = Math.min(100, Math.round(((currentSession - 1) / sessionsToLongBreak) * 100));

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 2.5rem' }}>
      
      {/* Header Area */}
      <header style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
           <div className="text-label-disciplined" style={{ color: 'var(--color-primary)', opacity: 0.8, marginBottom: '0.5rem' }}>
             WORKSPACE / TIMER
           </div>
           <h1 style={{ fontSize: '2.5rem', color: 'var(--color-on-surface)', letterSpacing: '-0.03em' }}>
             Deep Work <span style={{opacity:0.5}}>-</span> Focus Phase
           </h1>
        </div>
        <div className="glass" style={{
           display: 'flex', alignItems: 'center', gap: '0.75rem',
           padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-full)'
        }}>
           <span style={{ fontSize: '1.25rem' }}>🔥</span>
           <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>12 Day Streak</span>
        </div>
      </header>

      {/* Main Grid */}
      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1.3fr', 
        gap: '2.5rem' 
      }}>
        
        {/* Left Column (Study Materials, tips, progress) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="shadow-ambient" style={{ backgroundColor: 'var(--color-surface-container-lowest)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
               <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                 <span style={{ background:'var(--color-surface-container-low)', padding:'0.5rem', borderRadius:'8px', fontSize: '1.2rem' }}>📚</span> 
                 <span style={{ fontWeight: 700 }}>Study Materials</span>
               </h3>
               <p style={{ color: '#6A6C76', fontSize: '0.95rem', lineHeight: 1.6 }}>
                 Focusing on the next tasks. Try to maintain absolute zero interruptions for this block.
               </p>
            </div>

            <div className="shadow-ambient" style={{ backgroundColor: 'var(--color-secondary-container)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
               <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem', color: 'var(--color-on-secondary-container)', fontWeight: 700 }}>Mindfulness Tip</h3>
               <p style={{ color: 'var(--color-secondary)', fontSize: '0.95rem', fontStyle: 'italic', lineHeight: 1.6 }}>
                 "True discipline is really just self-care. Stay present with the difficulty of the equation."
               </p>
            </div>

            <div className="shadow-ambient" style={{ backgroundColor: 'var(--color-surface-container-lowest)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
               <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 700 }}>Today's Progress</h3>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                 <span style={{ color: '#6A6C76', fontSize: '0.875rem' }}>Session {currentSession > sessionsToLongBreak ? sessionsToLongBreak : currentSession} of {sessionsToLongBreak}</span>
                 <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{progressPercent}%</span>
               </div>
               <div style={{ background: 'var(--color-surface-container-low)', height: '12px', borderRadius: '12px', marginTop: '1rem', overflow:'hidden' }}>
                 <div style={{ background: 'var(--color-secondary)', width: `${progressPercent}%`, height: '100%', borderRadius: '12px', transition: 'width 0.5s ease' }}></div>
               </div>
            </div>
        </div>

        {/* Right Column (The Timer) */}
        <div>
          <Timer />
        </div>

      </section>
    </div>
  );
}
