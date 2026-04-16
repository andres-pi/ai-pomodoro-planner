import React from 'react';
import SettingsPanel from '@/components/SettingsPanel';

export default function SettingsPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' }}>
      <header style={{ marginBottom: '3rem' }}>
         <div className="text-label-disciplined" style={{ color: 'var(--color-primary)', opacity: 0.8, marginBottom: '0.5rem' }}>
           WORKSPACE / PREFERENCES
         </div>
         <h1 style={{ fontSize: '2.5rem', color: 'var(--color-on-surface)' }}>Settings</h1>
      </header>
      
      <SettingsPanel />
    </div>
  );
}
