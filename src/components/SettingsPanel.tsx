"use client";
import React, { useState } from 'react';
import { useTimerStore } from '@/store/timerStore';
import { signIn, signOut, useSession } from "next-auth/react";
import { User, LogOut, Eye, EyeOff, Moon, Sun } from "lucide-react";
import { useTranslation } from '@/hooks/useTranslation';
import { useLangStore } from '@/store/langStore';
import { useThemeStore } from '@/store/themeStore';

const InputField = ({ label, value, onChange, min = 1, max = 60 }: any) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
    <label className="text-label-disciplined" style={{ color: '#6A6C76', fontSize: '0.65rem' }}>{label}</label>
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
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

export default function SettingsPanel() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLangStore();
  const { theme, setTheme } = useThemeStore();
  const { workDuration, shortBreakDuration, longBreakDuration, sessionsToLongBreak, updateSettings } = useTimerStore();

  // Helper local states just for the timer inputs
  const [work, setWork] = useState(workDuration / 60);
  const [short, setShort] = useState(shortBreakDuration / 60);
  const [long, setLong] = useState(longBreakDuration / 60);
  const [sessions, setSessions] = useState(sessionsToLongBreak);
  const [saved, setSaved] = useState(false);

  // Auth States
  const { data: session, status } = useSession();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'login') {
      await signIn('credentials', { email, password, redirect: false });
    } else {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName })
      });
      if (res.ok) {
        await signIn('credentials', { email, password, redirect: false });
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Error al registrarse");
      }
    }
  };

  const handleSave = () => {
    updateSettings({
      workDuration: (Number(work) || 1) * 60,
      shortBreakDuration: (Number(short) || 1) * 60,
      longBreakDuration: (Number(long) || 1) * 60,
      sessionsToLongBreak: Number(sessions) || 1,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

      {/* LANGUAGE TOGGLE */}
      <div className="shadow-ambient mobile-gap-column" style={{ backgroundColor: 'var(--color-surface-container-lowest)', borderRadius: 'var(--radius-xl)', padding: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', letterSpacing: '-0.02em', fontWeight: 700 }}>
            {t("SETTINGS_LANG_TITLE")}
          </h3>
          <p style={{ color: '#6A6C76', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            {t("SETTINGS_LANG_DESC")}
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--color-surface-container-low)', borderRadius: '20px', padding: '0.25rem' }}>
          <button 
             type="button"
             onClick={() => setLanguage('es')}
             style={{ padding: '0.5rem 1rem', borderRadius: '16px', border: 'none', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s ease', backgroundColor: language === 'es' ? 'white' : 'transparent', color: language === 'es' ? 'var(--color-primary)' : '#6A6C76', boxShadow: language === 'es' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>
             Español
          </button>
          <button 
             type="button"
             onClick={() => setLanguage('en')}
             style={{ padding: '0.5rem 1rem', borderRadius: '16px', border: 'none', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s ease', backgroundColor: language === 'en' ? 'white' : 'transparent', color: language === 'en' ? 'var(--color-primary)' : '#6A6C76', boxShadow: language === 'en' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>
             English
          </button>
        </div>
      </div>

      {/* THEME TOGGLE */}
      <div className="shadow-ambient mobile-gap-column" style={{ backgroundColor: 'var(--color-surface-container-lowest)', borderRadius: 'var(--radius-xl)', padding: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', letterSpacing: '-0.02em', fontWeight: 700 }}>
            {t("SETTINGS_THEME_TITLE")}
          </h3>
          <p style={{ color: '#6A6C76', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            {t("SETTINGS_THEME_DESC")}
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--color-surface-container-low)', borderRadius: '20px', padding: '0.25rem' }}>
          <button 
             type="button"
             onClick={() => setTheme('light')}
             style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '16px', border: 'none', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s ease', backgroundColor: theme === 'light' ? 'var(--color-surface-container-lowest)' : 'transparent', color: theme === 'light' ? 'var(--color-primary)' : '#6A6C76', boxShadow: theme === 'light' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>
             <Sun size={16} /> {t("THEME_LIGHT")}
          </button>
          <button 
             type="button"
             onClick={() => setTheme('dark')}
             style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '16px', border: 'none', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s ease', backgroundColor: theme === 'dark' ? 'var(--color-surface-container-lowest)' : 'transparent', color: theme === 'dark' ? 'var(--color-primary)' : '#6A6C76', boxShadow: theme === 'dark' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>
             <Moon size={16} /> {t("THEME_DARK")}
          </button>
        </div>
      </div>

      {/* ORIGINAL SETTINGS */}
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
            {t("SETTINGS_MANUAL_TITLE")}
          </h3>
          <p style={{ color: '#6A6C76', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            {t("SETTINGS_MANUAL_DESC")}
          </p>
        </div>

        <div className="mobile-gap-column" style={{ display: 'flex', gap: '1rem' }}>
          <InputField label={t("SETTINGS_FOCUS_LBL")} value={work} onChange={setWork} max={120} />
          <InputField label={t("SETTINGS_SHORT_LBL")} value={short} onChange={setShort} max={30} />
        </div>

        <div className="mobile-gap-column" style={{ display: 'flex', gap: '1rem' }}>
          <InputField label={t("SETTINGS_LONG_LBL")} value={long} onChange={setLong} max={60} />
          <InputField label={t("SETTINGS_SESSIONS_LBL")} value={sessions} onChange={setSessions} max={10} />
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
            {saved ? t("SETTINGS_APPLIED_BTN") : t("SETTINGS_APPLY_BTN")}
          </button>
        </div>

      </div>

      {/* ACCOUNT & SYNC SECTION (MOVED TO BOTTOM) */}
      <div className="shadow-ambient" style={{
        backgroundColor: 'var(--color-surface-container-lowest)', borderRadius: 'var(--radius-xl)', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem'
      }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', letterSpacing: '-0.02em', fontWeight: 700 }}>
            {t("SETTINGS_ACCOUNT_TITLE")}
          </h3>
          <p style={{ color: '#6A6C76', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            {t("SETTINGS_ACCOUNT_DESC")}
          </p>
        </div>

        {status === "authenticated" ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-surface-container-low)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User color="var(--color-primary)" />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, color: 'var(--color-on-surface)' }}>{session?.user?.name || 'Clocky Member'}</h4>
                <span style={{ fontSize: '0.8rem', color: '#6A6C76' }}>{session?.user?.email}</span>
              </div>
            </div>
            <button onClick={() => signOut()} style={{ color: 'var(--color-tertiary)', backgroundColor: 'transparent', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <LogOut size={16} /> {t("SETTINGS_LOGOUT")}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
            <div style={{ display: 'flex', borderBottom: '2px solid var(--color-surface-container-high)', gap: '2rem', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
              <button onClick={() => setAuthMode('login')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', color: authMode === 'login' ? 'var(--color-primary)' : '#6A6C76', transition: 'color 0.2s ease' }}>
                {t("SETTINGS_LOGIN_BTN")}
              </button>
              <button onClick={() => setAuthMode('register')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', color: authMode === 'register' ? 'var(--color-primary)' : '#6A6C76', transition: 'color 0.2s ease' }}>
                {t("SETTINGS_REGISTER_BTN")}
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {authMode === 'register' && (
                <div className="mobile-gap-column" style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label className="text-label-disciplined" style={{ color: '#6A6C76', fontSize: '0.65rem' }}>{t("SETTINGS_FIRST_NAME_LBL")}</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="Jane" style={{ backgroundColor: 'var(--color-surface-container-high)', border: 'none', borderBottom: '2px solid transparent', borderRadius: 'var(--radius-md)', padding: '1rem', fontSize: '1rem', fontFamily: 'var(--font-body)', outline: 'none', transition: 'all 0.3s' }} onFocus={(e) => e.target.style.borderBottom = '2px solid var(--color-primary)'} onBlur={(e) => e.target.style.borderBottom = '2px solid transparent'} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label className="text-label-disciplined" style={{ color: '#6A6C76', fontSize: '0.65rem' }}>{t("SETTINGS_LAST_NAME_LBL")}</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Doe" style={{ backgroundColor: 'var(--color-surface-container-high)', border: 'none', borderBottom: '2px solid transparent', borderRadius: 'var(--radius-md)', padding: '1rem', fontSize: '1rem', fontFamily: 'var(--font-body)', outline: 'none', transition: 'all 0.3s' }} onFocus={(e) => e.target.style.borderBottom = '2px solid var(--color-primary)'} onBlur={(e) => e.target.style.borderBottom = '2px solid transparent'} />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label className="text-label-disciplined" style={{ color: '#6A6C76', fontSize: '0.65rem' }}>{t("SETTINGS_EMAIL_LBL")}</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="user@clocky.com" style={{ width: '100%', backgroundColor: 'var(--color-surface-container-high)', border: 'none', borderBottom: '2px solid transparent', borderRadius: 'var(--radius-md)', padding: '1rem', fontSize: '1rem', fontFamily: 'var(--font-body)', outline: 'none', transition: 'all 0.3s' }} onFocus={(e) => e.target.style.borderBottom = '2px solid var(--color-primary)'} onBlur={(e) => e.target.style.borderBottom = '2px solid transparent'} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', position: 'relative' }}>
                <label className="text-label-disciplined" style={{ color: '#6A6C76', fontSize: '0.65rem' }}>{t("SETTINGS_PASS_LBL")}</label>
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" style={{ width: '100%', backgroundColor: 'var(--color-surface-container-high)', border: 'none', borderBottom: '2px solid transparent', borderRadius: 'var(--radius-md)', padding: '1rem', paddingRight: '3rem', fontSize: '1rem', fontFamily: 'var(--font-body)', outline: 'none', transition: 'all 0.3s' }} onFocus={(e) => e.target.style.borderBottom = '2px solid var(--color-primary)'} onBlur={(e) => e.target.style.borderBottom = '2px solid transparent'} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '1rem', top: '2.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#6A6C76' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button type="submit" disabled={status === "loading"} style={{ backgroundColor: 'var(--color-on-surface)', color: 'white', padding: '1rem 2rem', borderRadius: 'var(--radius-full)', fontWeight: 600, height: '54px', cursor: 'pointer', marginTop: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                {status === "loading" ? t("SETTINGS_LOADING") : (authMode === 'login' ? t("SETTINGS_SUBMIT_LOGIN") : t("SETTINGS_SUBMIT_REGISTER"))}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-surface-container-high)' }}></div>
                <span style={{ margin: '0 1rem', color: '#6A6C76', fontSize: '0.8rem', fontWeight: 600 }}>o</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-surface-container-high)' }}></div>
              </div>

              <button type="button" onClick={() => signIn('google')} style={{ backgroundColor: 'white', color: 'var(--color-on-surface)', padding: '1rem', borderRadius: 'var(--radius-full)', fontWeight: 600, height: '54px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', border: '1px solid var(--color-surface-container-high)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                {t("SETTINGS_GOOGLE_BTN")}
              </button>

            </form>
          </div>
        )}
      </div>
    </div>
  );
}
