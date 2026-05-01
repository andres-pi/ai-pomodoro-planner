import { create } from 'zustand';

export interface Task {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  scheduledDate: string | null;
  createdAt: string;
}

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (title: string, category: string, scheduledDate?: string | null) => Promise<void>;
  toggleTask: (id: string, completed: boolean) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  editTask: (id: string, updates: Partial<Task>) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      set({ tasks: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addTask: async (title, category, scheduledDate) => {
    // Optimistic UI update
    const tempId = `temp-${Date.now()}`;
    const newTask: Task = {
      id: tempId,
      title,
      category,
      completed: false,
      scheduledDate: scheduledDate ? (scheduledDate.includes('T') ? scheduledDate : `${scheduledDate}T12:00:00Z`) : null,
      createdAt: new Date().toISOString(),
    };
    
    set((state) => ({ tasks: [newTask, ...state.tasks] }));

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, scheduledDate }),
      });
      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.error || 'Failed to create task');
      
      const createdTask = resJson;
      // Reemplazamos el temporal por el real
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === tempId ? createdTask : t)),
      }));
    } catch (error) {
      // Revertir
      set((state) => ({ tasks: state.tasks.filter((t) => t.id !== tempId) }));
      console.error(error);
    }
  },

  toggleTask: async (id, completed) => {
    // Optimistic UI update
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, completed } : t)),
    }));

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });
      if (!res.ok) {
         const resJson = await res.json();
         throw new Error(resJson.error || 'Failed to update task');
      }
    } catch (error) {
      // Revertir
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, completed: !completed } : t)),
      }));
      console.error(error);
    }
  },

  deleteTask: async (id) => {
    // Optimistic UI update
    const previousTasks = get().tasks;
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));

    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) {
         const resJson = await res.json();
         throw new Error(resJson.error || 'Failed to delete task');
      }
    } catch (error) {
      // Revertir
      set({ tasks: previousTasks });
      console.error(error);
    }
  },

  editTask: async (id, updates) => {
    // Optimistic UI update
    const previousTasks = get().tasks;
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
         const resJson = await res.json();
         throw new Error(resJson.error || 'Failed to edit task');
      }
    } catch (error) {
      // Revertir
      set({ tasks: previousTasks });
      console.error(error);
    }
  },
}));
