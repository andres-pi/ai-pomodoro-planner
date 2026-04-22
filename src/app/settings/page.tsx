"use client";
import React from 'react';
import SettingsPanel from '@/components/SettingsPanel';
import { useTranslation } from '@/hooks/useTranslation';

export default function SettingsPage() {
  const { t } = useTranslation();
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <div className="text-label-disciplined" style={{ color: 'var(--color-primary)', opacity: 0.8, marginBottom: '0.5rem' }}>
          {t("GLOBAL_HEADER_ROUTE")} / {t("SETTINGS_HEADER_ROUTE")}
        </div>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--color-on-surface)' }}>{t("SETTINGS_HEADER_TITLE")}</h1>
      </header>

      <SettingsPanel />
    </div>
  );
}
