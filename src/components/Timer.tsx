"use client";
import React, { useEffect } from 'react';
import { useTimerStore } from '@/store/timerStore';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Timer() {
  const { timeLeft, isRunning, phase, currentSession, toggleTimer, skipPhase, tick, updateSettings, workDuration, shortBreakDuration, longBreakDuration } = useTimerStore();
  const { t } = useTranslation();

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
    <div className="shadow-ambient mobile-p-1" style={{
      backgroundColor: 'var(--color-surface-container-lowest)',
      borderRadius: 'var(--radius-xl)',
      padding: '3rem 2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      width: '100%',
      minWidth: 0,
      minHeight: 0,
      position: 'relative'
    }}>

      {/* Decorative prompt on top */}
      <div style={{
        alignSelf: 'center',
        backgroundColor: 'var(--color-background)',
        padding: '0.75rem 1.5rem',
        borderRadius: 'var(--radius-full)',
        marginBottom: '2rem',
        color: 'var(--color-primary)',
        fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
        fontWeight: 600,
        textAlign: 'center'
      }}>
        {t("TIMER_DECORATIVE_PROMPT")}
      </div>

      {/* Visual Clock Outline */}
      <div style={{
        position: 'relative',
        alignSelf: 'center',
        width: '100%',
        maxWidth: '320px',
        aspectRatio: '1 / 1',
        minWidth: 0,
        minHeight: 0,
        margin: '1.5rem 0 3rem 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-full)'
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

        <div style={{
          position: 'absolute', inset: '0px', zIndex: 10,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 1rem'
        }}>
          <span className="text-label-disciplined" style={{ marginBottom: '0.5rem', color: '#6A6C76', fontSize: '0.65rem' }}>{t("TIMER_TIME_REMAINING")}</span>
          <span style={{ fontSize: 'clamp(3.5rem, 15vw, 5.5rem)', fontWeight: 800, letterSpacing: '-0.05em', color: 'var(--color-on-surface)', lineHeight: 1 }}>
            {formatTime(timeLeft)}
          </span>
          <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--color-secondary)', fontWeight: 600, fontSize: '0.875rem', flexWrap: 'wrap' }}>
            🎵 {t("TIMER_MUSIC_LOFI")}
          </div>
        </div>
      </div>

      {/* Controls Container using Glassmorphism pill embedded */}
      <div className="glass" style={{
        alignSelf: 'center',
        display: 'flex', alignItems: 'center', gap: 'clamp(0.25rem, 2vw, 1rem)',
        padding: '0.75rem clamp(0.5rem, 2vw, 1rem)', borderRadius: 'var(--radius-full)',
        maxWidth: '100%',
        minWidth: 0
      }}>
        <button
          onClick={() => {
            let baseTime = workDuration;
            if (phase === 'SHORT_BREAK') baseTime = shortBreakDuration;
            if (phase === 'LONG_BREAK') baseTime = longBreakDuration;
            updateSettings({ timeLeft: baseTime });
          }}
          style={{ width: 'clamp(32px, 10vw, 40px)', height: 'clamp(32px, 10vw, 40px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6A6C76', flexShrink: 0 }}
        >
          <RotateCcw size={20} />
        </button>

        <button
          onClick={toggleTimer}
          style={{
            width: 'clamp(120px, 40vw, 200px)', height: 'clamp(50px, 15vw, 60px)', borderRadius: 'var(--radius-full)',
            backgroundColor: getPhaseColor(), color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
            transition: 'background-color 0.5s ease, transform 0.2s ease',
            flexShrink: 1
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {isRunning ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: '4px' }} />}
          <span style={{ fontWeight: 700, letterSpacing: '0.05em', fontSize: 'clamp(0.8rem, 3vw, 1rem)' }}>{isRunning ? "PAUSE" : "START"}</span>
        </button>

        <button
          onClick={skipPhase}
          style={{ width: 'clamp(32px, 10vw, 40px)', height: 'clamp(32px, 10vw, 40px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6A6C76', flexShrink: 0 }}
        >
          <SkipForward size={20} />
        </button>
      </div>
    </div>
  );
}
