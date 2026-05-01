"use client";
import React from 'react';
import Timer from '@/components/Timer';
import { useTimerStore } from '@/store/timerStore';
import { useTranslation } from '@/hooks/useTranslation';

export default function Home() {
  const { currentSession, sessionsToLongBreak, phase } = useTimerStore();
  const progressPercent = phase === 'LONG_BREAK' 
    ? 100 
    : Math.min(100, Math.round(((currentSession - 1) / sessionsToLongBreak) * 100));
  const { t } = useTranslation();

  return (
    <div className="mobile-p-1" style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 2.5rem' }}>

      {/* Header Area */}
      <header className="mobile-gap-column" style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div className="text-label-disciplined" style={{ color: 'var(--color-primary)', opacity: 0.8, marginBottom: '0.5rem' }}>
            {t("GLOBAL_HEADER_ROUTE")} / {t("HOME_HEADER_ROUTE")}
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 8vw, 2.75rem)', color: 'var(--color-on-surface)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            {/* Deep Work <span style={{ opacity: 0.5 }}>-</span> {t("HOME_HEADER_TITLE")} */}
            {t("HOME_HEADER_TITLE")}
          </h1>
        </div>
        <div className="glass" style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-full)'
        }}>
          <span style={{ fontSize: '1.25rem' }}>🔥</span>
          <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>12 {t("HOME_STREAK_TEXT")}</span>
        </div>
      </header>

      {/* Main Grid */}
      <section className="responsive-grid">

        {/* Left Column (Study Materials, tips, progress) */}
        <div className="mobile-order-2" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="shadow-ambient" style={{ backgroundColor: 'var(--color-surface-container-lowest)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ background: 'var(--color-surface-container-low)', padding: '0.5rem', borderRadius: '8px', fontSize: '1.2rem' }}>📚</span>
              <span style={{ fontWeight: 700 }}>{t("HOME_STUDY_MATERIALS_TITLE")}</span>
            </h3>
            <p style={{ color: '#6A6C76', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {t("HOME_STUDY_MATERIALS_DESC")}
            </p>
          </div>

          <div className="shadow-ambient" style={{ backgroundColor: 'var(--color-secondary-container)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem', color: 'var(--color-on-secondary-container)', fontWeight: 700 }}>{t("HOME_MINDFULNESS_TIP_TITLE")}</h3>
            <p style={{ color: 'var(--color-secondary)', fontSize: '0.95rem', fontStyle: 'italic', lineHeight: 1.6 }}>
              {t("HOME_MINDFULNESS_TIP_DESC")}
            </p>
          </div>

          <div className="shadow-ambient" style={{ backgroundColor: 'var(--color-surface-container-lowest)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 700 }}>{t("HOME_TODAY_PROGRESS_TITLE")}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{ color: '#6A6C76', fontSize: '0.875rem' }}>{t("HOME_TODAY_PROGRESS_SESSION")} {phase === 'LONG_BREAK' ? sessionsToLongBreak : currentSession} {t("HOME_TODAY_PROGRESS_OF")} {sessionsToLongBreak}</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{progressPercent}%</span>
            </div>
            <div style={{ background: 'var(--color-surface-container-low)', height: '12px', borderRadius: '12px', marginTop: '1rem', overflow: 'hidden' }}>
              <div style={{ background: 'var(--color-secondary)', width: `${progressPercent}%`, height: '100%', borderRadius: '12px', transition: 'width 0.5s ease' }}></div>
            </div>
          </div>
        </div>

        {/* Right Column (The Timer) */}
        <div className="mobile-order-1">
          <Timer />
        </div>

      </section>
    </div>
  );
}
