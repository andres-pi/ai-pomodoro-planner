import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

type Phase = 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK';

const playChime = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    const createTone = (frequency: number, delay: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
      
      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + delay + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 1.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 1.5);
    };

    createTone(880, 0);       // A5
    createTone(1108.73, 0.1); // C#6
  } catch (e) {
    console.error("No se pudo reproducir el sonido", e);
  }
};

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

      toggleTimer: () => {
        // Pedir permisos de notificación la primera vez que se da play
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
          Notification.requestPermission();
        }
        set((state) => {
           if (!state.isRunning) toast.success(state.phase === 'WORK' ? '¡A enfocarse!' : 'Tiempo de descanso');
           return { isRunning: !state.isRunning };
        });
      },
      pauseTimer: () => set({ isRunning: false }),
      
      tick: () => {
        const state = get();
        if (state.timeLeft > 0) {
          set({ timeLeft: state.timeLeft - 1 });
        } else {
          state.skipPhase();
          // Lógica de Notificaciones
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === "granted") {
            new Notification("El temporizador terminó", {
              body: `Es hora de ${state.phase === 'WORK' ? 'descansar' : 'volver al trabajo'}.`,
              icon: '/favicon.ico'
            });
          }
          toast.success(`¡Sesión terminada! Es hora de ${state.phase === 'WORK' ? 'descansar' : 'volver al trabajo'}.`, {
             duration: 5000,
          });
          playChime();
        }
      },

      skipPhase: () => set((state) => {
        const isCurrentlyWorking = state.phase === 'WORK';
        
        if (isCurrentlyWorking) {
          const isLongBreak = state.currentSession % state.sessionsToLongBreak === 0;
          return {
            phase: isLongBreak ? 'LONG_BREAK' : 'SHORT_BREAK',
            timeLeft: isLongBreak ? state.longBreakDuration : state.shortBreakDuration,
            isRunning: !isLongBreak, // Auto-avance en descansos cortos, pero pausa en el descanso largo
          };
        } else {
          // Volviendo al trabajo (WORK) después de un descanso
          const nextSession = state.phase === 'LONG_BREAK' ? 1 : state.currentSession + 1;
          return {
            phase: 'WORK',
            timeLeft: state.workDuration,
            currentSession: nextSession,
            isRunning: state.phase !== 'LONG_BREAK', // Pausa antes de afrontar una nueva ronda entera
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
        toast.success('Configuración de Pomodoro actualizada');
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
