"use client";
import React, { useEffect } from 'react';
import { useTimerStore } from '@/store/timerStore';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';

export default function Timer() {
  const { timeLeft, isRunning, phase, currentSession, toggleTimer, skipPhase, tick, updateSettings, workDuration, shortBreakDuration, longBreakDuration } = useTimerStore();

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

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
    if (phase === 'SHORT_BREAK') return 'var(--color-tertiary)'; 
    return 'var(--color-secondary)'; 
  };

  const calculateProgress = () => {
      let baseTime = workDuration;
      if (phase === 'SHORT_BREAK') baseTime = shortBreakDuration;
      if (phase === 'LONG_BREAK') baseTime = longBreakDuration;
      
      const elap = baseTime - timeLeft;
      return (elap / baseTime) * 100;
  };

  return (
    <div className="shadow-ambient" style={{ 
        backgroundColor: 'var(--color-surface-container-lowest)', 
        borderRadius: 'var(--radius-xl)', 
        padding: '3rem 2rem',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        position: 'relative' 
    }}>
      
      {/* Decorative prompt on top */}
      <div style={{
          backgroundColor: 'var(--color-background)',
          padding: '0.75rem 1.5rem',
          borderRadius: 'var(--radius-full)',
          marginBottom: '2rem',
          color: 'var(--color-primary)',
          fontSize: '0.875rem',
          fontWeight: 600
      }}>
          No rompas la racha ahora, ¡tú puedes! ✨
      </div>
      
      {/* Visual Clock Outline */}
      <div style={{ 
        position: 'relative',
        width: '320px', height: '320px', 
        borderRadius: 'var(--radius-full)', 
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '1.5rem 0 3rem 0'
      }}>
        
        <div style={{
           position: 'absolute', inset: '0px', borderRadius: '50%',
           border: `8px solid var(--color-surface-container-low)`,
           transition: 'all 0.5s ease'
        }}></div>

        <div style={{
           position: 'absolute', inset: '0px', borderRadius: '50%',
           borderStyle: 'solid',
           borderWidth: '8px',
           borderTopColor: getPhaseColor(),
           borderRightColor: 'transparent',
           borderBottomColor: 'transparent',
           borderLeftColor: calculateProgress() > 50 ? getPhaseColor() : 'transparent',
           transform: `rotate(${(calculateProgress() / 100) * 360}deg)`,
           transition: 'all 1s linear'
        }}></div>

        <div style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span className="text-label-disciplined" style={{ marginBottom: '0.5rem', color: '#6A6C76', fontSize: '0.65rem' }}>TIME REMAINING</span>
            <span style={{ fontSize: '5.5rem', fontWeight: 800, letterSpacing: '-0.05em', color: 'var(--color-on-surface)', lineHeight: 1 }}>
                {formatTime(timeLeft)}
            </span>
            <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-secondary)', fontWeight: 600, fontSize: '0.875rem' }}>
                🎵 Lo-fi Focus Beats
            </div>
        </div>
      </div>

      {/* Controls Container using Glassmorphism pill embedded */}
      <div className="glass" style={{ 
          display: 'flex', alignItems: 'center', gap: '1.5rem', 
          padding: '1rem 2rem', borderRadius: 'var(--radius-full)' 
      }}>
        <button 
          onClick={() => {
              let baseTime = workDuration;
              if (phase === 'SHORT_BREAK') baseTime = shortBreakDuration;
              if (phase === 'LONG_BREAK') baseTime = longBreakDuration;
              updateSettings({ timeLeft: baseTime });
          }}
          style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6A6C76' }}
        >
          <RotateCcw size={20} />
        </button>
        
        <button 
          onClick={toggleTimer}
          style={{ 
            width: '200px', height: '60px', borderRadius: 'var(--radius-full)', 
            backgroundColor: getPhaseColor(), color: 'white', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
            transition: 'background-color 0.5s ease, transform 0.2s ease'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {isRunning ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: '4px' }} />}
          <span style={{ fontWeight: 700, letterSpacing: '0.05em', fontSize: '1rem' }}>{isRunning ? "PAUSE SESSION" : "START SESSION"}</span>
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
