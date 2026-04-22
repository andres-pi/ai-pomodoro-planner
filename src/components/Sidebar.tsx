"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Home, Calendar as CalendarIcon, CheckSquare, Settings, Timer } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const NavItem = ({ icon: Icon, label, href }: any) => {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div
        className="nav-item-mobile"
        style={{
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
      </div>
    </Link>
  );
};

export default function Sidebar() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const userName = session?.user?.name ? session.user.name.split(' ')[0] : null;
  const welcomeText = userName ? t("SIDEBAR_WELCOME_USER", { name: userName }) : t("SIDEBAR_WELCOME_GUEST");

  return (
    <aside className="sidebar-container" style={{
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
      <div className="branding-container desktop-only" style={{ padding: '0 1.5rem', marginBottom: '4rem', flexDirection: 'column' }}>
        <h2 style={{ color: 'var(--color-primary)', fontSize: '1.5rem', letterSpacing: '-0.03em', fontWeight: 700 }}>
          Clocky
        </h2>
        <div style={{ marginTop: '2.5rem' }}>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary)', fontWeight: 600 }}>{welcomeText}</h3>
          <p className="text-label-disciplined" style={{ fontSize: '0.65rem', color: '#9a9a9d', marginTop: '0.5rem' }}>
            {t("SIDEBAR_SUBTITLE")}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mobile-nav-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingRight: '1.5rem', width: '100%' }}>
        <NavItem icon={Home} label={t("SIDEBAR_HOME")} href="/" />
        <NavItem icon={CalendarIcon} label={t("SIDEBAR_CALENDAR")} href="/calendar" />
        <NavItem icon={CheckSquare} label={t("SIDEBAR_TASKS")} href="/tasks" />
        <NavItem icon={Settings} label={t("SIDEBAR_SETTINGS")} href="/settings" />
      </nav>

      {/* Focus CTA */}
      <div className="desktop-only" style={{ padding: '0 1.5rem 0 0' }}>
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
          <span style={{ fontWeight: 700, letterSpacing: '0.02em' }}>{t("SIDEBAR_CTA")}</span>
        </button>
      </div>
    </aside>
  );
}
