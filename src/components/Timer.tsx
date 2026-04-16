"use client";
import React, { useEffect } from 'react';
import { useTimerStore } from '@/store/timerStore';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';

export default function Timer() {
  const { timeLeft, isRunning, phase, currentSession, toggleTimer, skipPhase, tick, updateSettings, workDuration } = useTimerStore();

  // Solicitar permisos de notificación la primera vez
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Tick del Reloj
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, tick]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getPhaseColor = () => {
    if (phase === 'WORK') return 'var(--color-primary)';
    if (phase === 'SHORT_BREAK') return 'var(--color-tertiary)'; // Lime highlight for short break
    return 'var(--color-secondary)'; // Moss for long break
  };

  const calculateProgress = () => {
      // Simplificado: porcentaje según el tiempo base.
      let baseTime = workDuration;
      if (phase === 'SHORT_BREAK') baseTime = useTimerStore.getState().shortBreakDuration;
      if (phase === 'LONG_BREAK') baseTime = useTimerStore.getState().longBreakDuration;
      
      const elap = baseTime - timeLeft;
      return (elap / baseTime) * 100;
  };

  const getPhaseName = () => {
    if (phase === 'WORK') return 'Focus Session';
    if (phase === 'SHORT_BREAK') return 'Short Break';
    return 'Rest Phase';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', position: 'relative' }}>
      
      <div className="text-label-disciplined" style={{ color: getPhaseColor(), marginBottom: '0.5rem', transition: 'color 0.5s ease' }}>
        {getPhaseName()}
      </div>
      
      <h3 style={{ fontSize: '1rem', color: 'var(--color-on-surface)', opacity: 0.7, marginBottom: '3rem', fontWeight: 500 }}>
        Session {currentSession}
      </h3>
      
      {/* Visual Clock Outline (The soft ring) */}
      <div style={{ 
        position: 'relative',
        width: '320px', height: '320px', 
        borderRadius: 'var(--radius-full)', 
        backgroundColor: 'var(--color-surface-container-lowest)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 20px 40px rgba(49, 50, 56, 0.05)'
      }}>
        {/* Progress borders could be done with SVG or conic-gradients, here is a clean solid state for now */}
        <div style={{
           position: 'absolute', inset: '10px', borderRadius: '50%',
           border: `6px solid ${getPhaseColor()}`,
           opacity: 0.2, transition: 'all 0.5s ease'
        }}></div>

        <div style={{
           position: 'absolute', inset: '10px', borderRadius: '50%',
           border: `6px solid ${getPhaseColor()}`,
           borderRightColor: 'transparent',
           borderBottomColor: 'transparent',
           transform: `rotate(${(calculateProgress() / 100) * 360}deg)`,
           transition: 'all 1s linear'
        }}></div>

        <div style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span className="text-label-disciplined" style={{ marginBottom: '0.5rem', color: '#6A6C76', fontSize: '0.65rem' }}>TIME REMAINING</span>
            <span style={{ fontSize: '5rem', fontWeight: 700, letterSpacing: '-0.05em', color: 'var(--color-on-surface)', lineHeight: 1 }}>
                {formatTime(timeLeft)}
            </span>
        </div>
      </div>

      {/* Controls Container using Glassmorphism pill */}
      <div className="glass" style={{ 
          display: 'flex', alignItems: 'center', gap: '1rem', 
          marginTop: '-30px', zIndex: 20, 
          padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-full)' 
      }}>
        <button 
          onClick={() => updateSettings({ timeLeft: useTimerStore.getState().workDuration })}
          style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6A6C76' }}
        >
          <RotateCcw size={20} />
        </button>
        
        <button 
          onClick={toggleTimer}
          style={{ 
            width: '180px', height: '56px', borderRadius: 'var(--radius-full)', 
            backgroundColor: getPhaseColor(), color: 'white', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
            transition: 'background-color 0.5s ease'
          }}
        >
          {isRunning ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: '4px' }} />}
          <span style={{ fontWeight: 700, letterSpacing: '0.05em' }}>{isRunning ? "PAUSE" : "START"}</span>
        </button>

        <button 
          onClick={skipPhase}
          style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6A6C76' }}
        >
          <SkipForward size={20} />
        </button>
      </div>
    </div>
  );
}
