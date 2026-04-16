import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Phase = 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK';

interface TimerState {
  // Settings
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsToLongBreak: number;
  
  // Current Status
  phase: Phase;
  timeLeft: number; // in seconds
  isRunning: boolean;
  currentSession: number;
  
  // Actions
  toggleTimer: () => void;
  pauseTimer: () => void;
  tick: () => void;
  skipPhase: () => void;
  updateSettings: (settings: Partial<TimerState>) => void;
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      workDuration: 25 * 60,
      shortBreakDuration: 5 * 60,
      longBreakDuration: 15 * 60,
      sessionsToLongBreak: 4,

      phase: 'WORK',
      timeLeft: 25 * 60,
      isRunning: false,
      currentSession: 1,

      toggleTimer: () => set((state) => ({ isRunning: !state.isRunning })),
      pauseTimer: () => set({ isRunning: false }),
      
      tick: () => {
        const state = get();
        if (state.timeLeft > 0) {
          set({ timeLeft: state.timeLeft - 1 });
        } else {
          state.skipPhase();
          // Lógica de Notificaciones de navegador (OPCIONAL)
          if (typeof window !== 'undefined' && Notification.permission === "granted") {
            new Notification("El temporizador terminó", {
              body: `Es hora de ${state.phase === 'WORK' ? 'descansar' : 'volver al trabajo'}.`,
              icon: '/favicon.ico'
            });
          }
        }
      },

      skipPhase: () => set((state) => {
        const isCurrentlyWorking = state.phase === 'WORK';
        
        if (isCurrentlyWorking) {
          const isLongBreak = state.currentSession % state.sessionsToLongBreak === 0;
          return {
            phase: isLongBreak ? 'LONG_BREAK' : 'SHORT_BREAK',
            timeLeft: isLongBreak ? state.longBreakDuration : state.shortBreakDuration,
            isRunning: false, // Auto pausa al cambiar de fase
          };
        } else {
          // Volviendo al trabajo (WORK) después de un descanso
          const nextSession = state.phase === 'LONG_BREAK' ? 1 : state.currentSession + 1;
          return {
            phase: 'WORK',
            timeLeft: state.workDuration,
            currentSession: nextSession,
            isRunning: false,
          };
        }
      }),
      
      updateSettings: (newSettings) => set((state) => {
        const nextState = { ...state, ...newSettings };
        if (!state.isRunning) {
          if (state.phase === 'WORK' && newSettings.workDuration !== undefined) {
            nextState.timeLeft = newSettings.workDuration;
          } else if (state.phase === 'SHORT_BREAK' && newSettings.shortBreakDuration !== undefined) {
            nextState.timeLeft = newSettings.shortBreakDuration;
          } else if (state.phase === 'LONG_BREAK' && newSettings.longBreakDuration !== undefined) {
            nextState.timeLeft = newSettings.longBreakDuration;
          }
        }
        return nextState;
      }),
    }),
    {
      name: 'pomodoro-storage',
      // No persistir si el timer esta corriendo
      partialize: (state) => ({ ...state, isRunning: false }),
    }
  )
);
