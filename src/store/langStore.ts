import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'es' | 'en';

interface LangState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLangStore = create<LangState>()(
  persist(
    (set) => ({
      language: 'es', // Español por defecto per design
      setLanguage: (lang) => set({ language: lang }),
      toggleLanguage: () => set((state) => ({ language: state.language === 'es' ? 'en' : 'es' })),
    }),
    {
      name: 'clocky-language-storage',
    }
  )
);
