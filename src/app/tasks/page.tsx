"use client";
import React, { useState, useEffect } from 'react';
import { Check, ChevronRight, Plus, Sparkles, Calendar as CalendarIcon, Tag, Trash2, Edit2 } from 'lucide-react';
import AuthOverlay from '@/components/AuthOverlay';
import { useTranslation } from '@/hooks/useTranslation';
import { useTaskStore } from '@/store/taskStore';

export default function TasksPage() {
   const { tasks, fetchTasks, addTask, toggleTask, deleteTask, editTask } = useTaskStore();
   const [newTask, setNewTask] = useState("");
   const [editingTask, setEditingTask] = useState<string | null>(null);
   const [editTitle, setEditTitle] = useState("");
   const [selectedCategory, setSelectedCategory] = useState("focus");
   const [selectedDate, setSelectedDate] = useState("");
   const { t } = useTranslation();

   useEffect(() => {
      fetchTasks();
   }, []);

   const handleAddTask = () => {
      if (!newTask.trim()) return;
      addTask(newTask, selectedCategory, selectedDate || null);
      setNewTask("");
   };

   const startEditing = (task: any) => {
      setEditingTask(task.id);
      setEditTitle(task.title);
   };

   const saveEdit = (id: string, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (!editTitle.trim()) {
         setEditingTask(null);
         return;
      }
      editTask(id, { title: editTitle.trim() });
      setEditingTask(null);
   };

   const getCategoryColor = (category: string) => {
      switch (category) {
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
                     {t('GLOBAL_HEADER_ROUTE')} / {t('TASKS_HEADER_ROUTE')}
                  </div>
                  <h1 style={{ fontSize: '2.5rem', color: 'var(--color-on-surface)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                     {t("TASKS_HEADER_TITLE")}
                  </h1>
               </div>
            </header>

            {/* MAIN GRID */}
            <div className="responsive-grid">

               {/* LEFT COLUMN: Input & Tasks List */}
               <div className="mobile-order-1" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

                  {/* INLINE TASK CREATOR */}
                  <div className="shadow-ambient" style={{
                     backgroundColor: 'var(--color-surface-container-lowest)',
                     borderRadius: 'var(--radius-xl)',
                     padding: '1.25rem',
                     display: 'flex', flexDirection: 'column', gap: '0.75rem'
                  }}>
                     
                     <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                           <input
                              value={newTask}
                              onChange={(e) => setNewTask(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                              placeholder={t("TASKS_ADD_TASK_PLACEHOLDER") || "What's your next priority?"}
                              style={{
                                 width: '100%',
                                 backgroundColor: 'transparent',
                                 border: 'none',
                                 padding: '0.5rem 1rem',
                                 fontSize: '1.125rem',
                                 fontFamily: 'var(--font-body)',
                                 color: 'var(--color-on-surface)',
                                 outline: 'none',
                              }}
                           />
                        </div>
                        <button onClick={handleAddTask} style={{
                           backgroundColor: newTask.trim() ? 'var(--color-primary)' : 'var(--color-surface-container-high)', 
                           color: newTask.trim() ? 'white' : 'var(--color-on-surface-variant)',
                           padding: '1rem', borderRadius: '50%',
                           display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease',
                           boxShadow: newTask.trim() ? '0 10px 20px rgba(100, 83, 162, 0.2)' : 'none',
                           border: 'none', cursor: newTask.trim() ? 'pointer' : 'default',
                        }}
                           onMouseDown={(e) => e.currentTarget.style.transform = newTask.trim() ? 'scale(0.95)' : 'none'}
                           onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                           <Plus size={20} />
                        </button>
                     </div>
                     
                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.5rem' }}>
                        
                        {/* Category Pills */}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                           {['focus', 'wellness', 'admin'].map((cat) => (
                              <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
                                 padding: '0.4rem 1rem',
                                 borderRadius: 'var(--radius-full)',
                                 border: 'none',
                                 fontSize: '0.75rem',
                                 fontWeight: 600,
                                 cursor: 'pointer',
                                 transition: 'all 0.2s ease',
                                 textTransform: 'capitalize',
                                 backgroundColor: selectedCategory === cat ? getCategoryColor(cat) : 'var(--color-surface-container-low)',
                                 color: selectedCategory === cat ? 'white' : 'var(--color-on-surface-variant)',
                                 display: 'flex', alignItems: 'center', gap: '0.35rem'
                              }}>
                                 {selectedCategory === cat && <Check size={12} />}
                                 {cat}
                              </button>
                           ))}
                        </div>

                        {/* Date Picker Pill */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--color-surface-container-low)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)' }}>
                           <CalendarIcon size={14} color="var(--color-on-surface-variant)" />
                           <input 
                              type="date" 
                              value={selectedDate} 
                              onChange={(e) => setSelectedDate(e.target.value)} 
                              style={{ 
                                 background: 'transparent', 
                                 border: 'none', 
                                 color: selectedDate ? 'var(--color-on-surface)' : 'var(--color-on-surface-variant)', 
                                 outline: 'none', 
                                 fontSize: '0.75rem',
                                 fontWeight: 600,
                                 cursor: 'pointer', 
                                 fontFamily: 'var(--font-body)' 
                              }} 
                           />
                        </div>

                     </div>
                  </div>

                  {/* PENDING TASKS LAYOUT */}
                  <div className="shadow-ambient" style={{
                     backgroundColor: 'var(--color-surface-container-lowest)',
                     borderRadius: 'var(--radius-xl)',
                     padding: '2.5rem'
                  }}>
                     <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-on-surface)', marginBottom: '1.5rem' }}>
                        {t("TASKS_PENDING_TITLE")}
                     </h2>

                     {/* No-Line Rule: 12px gap instead of borders automatically */}
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {tasks.filter(t => !t.completed).map((task) => (
                           <div key={task.id}
                              onClick={() => toggleTask(task.id, true)}
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
                                 <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getCategoryColor(task.category) }}></div>
                                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                     {editingTask === task.id ? (
                                        <input 
                                           value={editTitle}
                                           onChange={(e) => setEditTitle(e.target.value)}
                                           onClick={(e) => e.stopPropagation()}
                                           onKeyDown={(e) => {
                                              if (e.key === 'Enter') saveEdit(task.id);
                                              if (e.key === 'Escape') setEditingTask(null);
                                           }}
                                           autoFocus
                                           style={{
                                              fontSize: '1rem', fontWeight: 600, color: 'var(--color-on-surface)',
                                              background: 'var(--color-surface-container)', border: '1px solid var(--color-primary)',
                                              borderRadius: '4px', padding: '0.2rem 0.5rem', outline: 'none'
                                           }}
                                        />
                                     ) : (
                                        <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-on-surface)' }}>{task.title}</span>
                                     )}
                                     {task.scheduledDate && <span style={{ fontSize: '0.75rem', color: '#6A6C76', marginTop: '0.2rem' }}>🗓 {new Date(task.scheduledDate).toLocaleDateString()}</span>}
                                  </div>
                               </div>
                               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  {editingTask === task.id ? (
                                     <button onClick={(e) => saveEdit(task.id, e)} style={{ background: 'var(--color-primary)', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', padding: '0.3rem 0.6rem', fontSize: '0.8rem', fontWeight: 600 }}>
                                        Guardar
                                     </button>
                                  ) : (
                                     <button onClick={(e) => { e.stopPropagation(); startEditing(task); }} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, padding: '4px' }}>
                                        <Edit2 size={18} color="var(--color-primary)" />
                                     </button>
                                  )}
                                  <button onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, padding: '4px' }}>
                                     <Trash2 size={18} color="var(--color-error)" />
                                  </button>
                               </div>
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
                     <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(162,185,151,0.2) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }}></div>
                     <div style={{ position: 'absolute', top: '40px', left: '40px', width: '50px', height: '50px', backgroundColor: '#FDFBF4', borderRadius: '50%', opacity: 0.9 }}></div>

                     <h3 className="text-label-disciplined" style={{ color: '#A0A0A5', letterSpacing: '0.1em', marginTop: 'auto', marginBottom: '0.5rem', zIndex: 10 }}>
                        MOODBOARD
                     </h3>
                     <h2 style={{ fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-0.02em', zIndex: 10 }}>
                        Focus on the ritual, <br />not the result.
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
                        <Sparkles size={18} /> {t("TASKS_DONE_TITLE")}
                     </h2>

                     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {tasks.filter(t => t.completed).map((task) => (
                           <div key={task.id}
                              onClick={() => toggleTask(task.id, false)}
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
                                 <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-on-surface)', textDecoration: 'line-through' }}>{task.title}</span>
                                 </div>
                              </div>
                              <button onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5 }}>
                                 <Trash2 size={18} color="var(--color-error)" />
                              </button>
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
