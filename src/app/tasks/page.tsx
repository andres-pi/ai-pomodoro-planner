"use client";
import React, { useState } from 'react';
import { Check, ChevronRight, Plus, Sparkles } from 'lucide-react';
import AuthOverlay from '@/components/AuthOverlay';

// Interfaces para mantener el código limpio
interface Task {
  id: string;
  title: string;
  category: 'focus' | 'wellness' | 'admin';
  completed: boolean;
}

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Repaso de Estética Floral', category: 'focus', completed: false },
  { id: '2', title: 'Completar asignación de algoritmos', category: 'focus', completed: false },
  { id: '3', title: 'Lectura: "The Creative Act"', category: 'wellness', completed: true },
  { id: '4', title: 'Revisión de correos atrasados', category: 'admin', completed: false },
  { id: '5', title: 'Yoga & Meditación (20m)', category: 'wellness', completed: false },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [newTask, setNewTask] = useState("");

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
       case 'focus': return 'var(--color-primary)';
       case 'wellness': return 'var(--color-secondary)';
       case 'admin': return 'var(--color-tertiary)';
       default: return 'var(--color-primary)';
    }
  };

  return (
    <AuthOverlay>
      <div className="mobile-p-1" style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 2.5rem' }}>
        
        {/* HEADER */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
         <div>
            <div className="text-label-disciplined" style={{ color: 'var(--color-primary)', opacity: 0.8, marginBottom: '0.5rem' }}>
              WORKSPACE / TASKS
            </div>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--color-on-surface)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
               Priorities & To-Dos 📝
            </h1>
         </div>
      </header>

      {/* MAIN GRID */}
      <div className="responsive-grid">
         
         {/* LEFT COLUMN: Input & Tasks List */}
         <div className="mobile-order-1" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
             
             {/* SOFT INSET INPUT AREA */}
             <div className="shadow-ambient" style={{ 
                backgroundColor: 'var(--color-surface-container-lowest)', 
                borderRadius: 'var(--radius-xl)', 
                padding: '1.5rem',
                display: 'flex', gap: '1rem', alignItems: 'center'
             }}>
                 <div style={{ flex: 1, position: 'relative' }}>
                    <input 
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      placeholder="Agrega una nueva prioridad para hoy..."
                      style={{
                        width: '100%',
                        backgroundColor: 'var(--color-surface-container-high)',
                        border: 'none',
                        borderBottom: '2px solid transparent',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.25rem 1.5rem',
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
                 <button style={{
                   backgroundColor: 'var(--color-primary)', color: 'white', padding: '1.25rem', borderRadius: 'var(--radius-full)',
                   display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s ease',
                   boxShadow: '0 10px 20px rgba(100, 83, 162, 0.2)'
                 }}
                 onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                 onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                 >
                    <Plus size={24} />
                 </button>
             </div>

             {/* PENDING TASKS LAYOUT */}
             <div className="shadow-ambient" style={{ 
                backgroundColor: 'var(--color-surface-container-lowest)', 
                borderRadius: 'var(--radius-xl)', 
                padding: '2.5rem' 
             }}>
                 <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-on-surface)', marginBottom: '1.5rem' }}>
                    Pending Priorities
                 </h2>

                 {/* No-Line Rule: 12px gap instead of borders automatically */}
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {tasks.filter(t => !t.completed).map((task) => (
                       <div key={task.id} 
                         onClick={() => toggleTask(task.id)}
                         style={{
                           display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                           padding: '1.25rem 1.5rem',
                           backgroundColor: 'var(--color-surface-container-low)',
                           borderRadius: 'var(--radius-md)',
                           cursor: 'pointer',
                           transition: 'all 0.2s ease'
                         }}
                         onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                         onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                       >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                             {/* Colored indicator dot */}
                             <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getCategoryColor(task.category) }}></div>
                             <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-on-surface)' }}>{task.title}</span>
                          </div>
                          <ChevronRight size={20} color="#c2c2c2" />
                       </div>
                    ))}
                 </div>
             </div>

         </div>

         {/* RIGHT COLUMN: Completed & Motivation */}
         <div className="mobile-order-2" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* INSPIRATION CARD */}
            <div className="shadow-ambient" style={{ 
                 position: 'relative',
                 background: 'linear-gradient(135deg, #2A2F35 0%, #171A1E 100%)',
                 borderRadius: 'var(--radius-xl)', padding: '2.5rem',
                 color: 'white', overflow: 'hidden', minHeight: '280px',
                 display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
             }}>
                {/* Decorational Elements for the image substitute */}
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(162,185,151,0.2) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%'}}></div>
                <div style={{ position: 'absolute', top: '40px', left: '40px', width: '50px', height: '50px', backgroundColor: '#FDFBF4', borderRadius: '50%', opacity: 0.9 }}></div>
                
                <h3 className="text-label-disciplined" style={{ color: '#A0A0A5', letterSpacing: '0.1em', marginTop: 'auto', marginBottom: '0.5rem', zIndex: 10 }}>
                   MOODBOARD
                </h3>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-0.02em', zIndex: 10 }}>
                   Focus on the ritual, <br/>not the result.
                </h2>
                
                {/* Floating Glass Button like in mockup */}
                <div className="glass" style={{
                   position: 'absolute', top: '30px', right: '30px', width: '48px', height: '48px',
                   borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                   border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.1)'
                }}>
                   <Plus size={20} color="white" />
                </div>
            </div>

            {/* COMPLETED TASKS */}
            <div className="shadow-ambient" style={{ 
                backgroundColor: 'var(--color-surface-container-lowest)', 
                borderRadius: 'var(--radius-xl)', 
                padding: '2.5rem',
                flex: 1
             }}>
                 <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#8b8b96', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Sparkles size={18} /> Done
                 </h2>

                 <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {tasks.filter(t => t.completed).map((task) => (
                       <div key={task.id} 
                         onClick={() => toggleTask(task.id)}
                         style={{
                           display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                           padding: '1.25rem 1.5rem',
                           backgroundColor: 'transparent',
                           border: '2px dashed var(--color-surface-container-high)',
                           borderRadius: 'var(--radius-md)',
                           cursor: 'pointer',
                           opacity: 0.7
                         }}
                       >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                             <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getCategoryColor(task.category) }}></div>
                             <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-on-surface)', textDecoration: 'line-through' }}>{task.title}</span>
                          </div>
                          <Check size={20} color="var(--color-secondary)" />
                       </div>
                    ))}
                 </div>
             </div>

         </div>

      </div>
      </div>
    </AuthOverlay>
  );
}
