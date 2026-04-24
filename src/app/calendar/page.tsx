"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import AuthOverlay from '@/components/AuthOverlay';
import { useTranslation } from '@/hooks/useTranslation';
import { useTaskStore } from '@/store/taskStore';
import { useRouter } from 'next/navigation';

export default function CalendarPage() {
   const { t } = useTranslation();
   const { tasks, fetchTasks } = useTaskStore();
   const router = useRouter();

   const [currentDate, setCurrentDate] = useState(new Date());

   useEffect(() => {
      fetchTasks();
   }, [fetchTasks]);

   const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
   const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 is Sunday

   const calendarDays = useMemo(() => {
      const days = [];
      const today = new Date();
      
      const prevMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
      // Prev month filling
      for (let i = 0; i < firstDayOfMonth; i++) {
         const d = prevMonthDays - firstDayOfMonth + i + 1;
         let m = currentDate.getMonth(); // actually this is 0-indexed, so 0 is Jan
         let y = currentDate.getFullYear();
         if (m === 0) { m = 12; y -= 1; }
         days.push({
            day: d,
            currentMonth: false,
            dateStr: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
         });
      }
      
      // Current month
      for (let i = 1; i <= daysInMonth; i++) {
         const isToday = i === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
         days.push({ 
            day: i, 
            currentMonth: true, 
            isToday, 
            dateStr: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
         });
      }

      // Next month filling
      const remainingSlots = 42 - days.length; 
      for (let i = 1; i <= remainingSlots; i++) {
         let m = currentDate.getMonth() + 2;
         let y = currentDate.getFullYear();
         if (m > 12) { m = 1; y += 1; }
         days.push({
            day: i,
            currentMonth: false,
            dateStr: `${y}-${String(m).padStart(2, '0')}-${String(i).padStart(2, '0')}`
         });
      }

      return days;
   }, [currentDate, daysInMonth, firstDayOfMonth]);

   // Group tasks by Date string YYYY-MM-DD
   const eventsByDate = useMemo(() => {
      const map: Record<string, any[]> = {};
      tasks.forEach(task => {
         if (task.scheduledDate) {
            // "2026-04-24T00:00:00.000Z" -> "2026-04-24"
            const rawDate = task.scheduledDate.split('T')[0];
            if (!map[rawDate]) map[rawDate] = [];
            map[rawDate].push(task);
         }
      });
      return map;
   }, [tasks]);

   const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
   const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

   const monthName = currentDate.toLocaleString('es', { month: 'long', year: 'numeric' });
   const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

   // Hoy
   const today = new Date();
   const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
   const todayTasks = eventsByDate[todayStr] || [];
   
   // Formateo de hoy para el titulo
   const todayFormatted = today.toLocaleString('es', { weekday: 'long', day: 'numeric' });
   const todayCap = todayFormatted.charAt(0).toUpperCase() + todayFormatted.slice(1);
   const currentMonthStr = today.toLocaleString('es', { month: 'long' });

   const getCategoryColor = (category: string) => {
      switch (category) {
         case 'focus': return 'var(--color-primary)';
         case 'wellness': return 'var(--color-tertiary)';
         case 'admin': return 'var(--color-secondary)';
         default: return '#c2c2c2';
      }
   };
   const getCategoryBg = (category: string) => {
      switch (category) {
         case 'focus': return 'var(--color-primary-container)';
         case 'wellness': return 'var(--color-tertiary-fixed-dim)';
         case 'admin': return 'var(--color-secondary-container)';
         default: return 'var(--color-surface-container-high)';
      }
   };

   // Productivity stat: completed tasks today vs total tasks today
   const completedToday = todayTasks.filter(t => t.completed).length;
   const totalToday = todayTasks.length;
   const productivityScore = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

   return (
      <AuthOverlay>
         <div className="mobile-p-1" style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 2.5rem' }}>

            {/* HEADER */}
            <header className="mobile-gap-column" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', gap: '1rem' }}>
               <div>
                  <div className="text-label-disciplined" style={{ color: 'var(--color-primary)', opacity: 0.8, marginBottom: '0.5rem' }}>
                     {t('GLOBAL_HEADER_ROUTE')} / {t('CALENDAR_HEADER_ROUTE')}
                  </div>
                  <h1 style={{ fontSize: '2.5rem', color: 'var(--color-on-surface)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                     {t("CALENDAR_HEADER_TITLE")}
                  </h1>
                  <p style={{ color: '#6A6C76', fontSize: '1.125rem', marginTop: '0.75rem', maxWidth: '500px' }}>
                     Organiza tus sesiones de estudio y alcanza tus metas con elegancia y disciplina.
                  </p>
               </div>
               <div className="glass" style={{
                  display: 'flex', padding: '0.35rem', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-surface-container-lowest)',
                  border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
               }}>
                  <button style={{ padding: '0.75rem 2rem', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)', backgroundColor: 'transparent' }}>
                     {t("CALENDAR_TOGGLE_MONTHLY")}
                  </button>
                  <button style={{ padding: '0.75rem 2rem', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.9rem', color: '#8b8b96', transition: 'all 0.2s ease', backgroundColor: 'transparent' }}>
                     {t("CALENDAR_TOGGLE_WEEKLY")}
                  </button>
               </div>
            </header>

            {/* MAIN LAYOUT */}
            <div className="responsive-grid">

               {/* LEFT -> CALENDAR */}
               <div className="shadow-ambient mobile-order-2 mobile-p-1" style={{
                  backgroundColor: 'var(--color-surface-container-lowest)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '2.5rem'
               }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 1.75rem)', fontWeight: 700, color: 'var(--color-on-surface)', letterSpacing: '-0.02em', textTransform: 'capitalize' }}>
                           {capitalizedMonth}
                        </h2>
                        <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--color-on-surface)' }}>
                           <button onClick={prevMonth} style={{ padding: '0.5rem', borderRadius: '50%', backgroundColor: 'transparent', cursor: 'pointer', color: 'inherit', border: 'none' }}><ChevronLeft size={20} /></button>
                           <button onClick={nextMonth} style={{ padding: '0.5rem', borderRadius: '50%', backgroundColor: 'transparent', cursor: 'pointer', color: 'inherit', border: 'none' }}><ChevronRight size={20} /></button>
                        </div>
                     </div>
                     <button 
                        onClick={() => router.push('/tasks')}
                        style={{
                        backgroundColor: 'var(--color-primary)', color: 'white', padding: '1rem 1.5rem',
                        borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.9rem',
                        display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 20px rgba(100, 83, 162, 0.2)',
                        transition: 'transform 0.2s ease', cursor: 'pointer', border: 'none'
                     }}
                        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
                        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                     >
                        <Plus size={18} /> Nueva Tarea
                     </button>
                  </div>

                  {/* GRID OF DAYS */}
                  <div style={{
                     display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                     borderTop: '1px solid var(--color-surface-container-high)', borderLeft: '1px solid var(--color-surface-container-high)',
                     borderTopLeftRadius: '16px', borderTopRightRadius: '16px',
                     overflow: 'hidden', width: '100%'
                  }}>
                     {['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'].map((d) => (
                        <div key={d} className="text-label-disciplined" style={{ padding: '0.75rem 0.25rem', textAlign: 'center', color: '#9a9a9d', borderRight: '1px solid var(--color-surface-container-high)', borderBottom: '1px solid var(--color-surface-container-high)', fontSize: 'clamp(0.5rem, 1.5vw, 0.75rem)', letterSpacing: '0' }}>
                           {d}
                        </div>
                     ))}
                     {calendarDays.map((d, i) => {
                        const acts = eventsByDate[d.dateStr] || [];
                        return (
                           <div key={i} style={{
                              minHeight: 'clamp(80px, 15vw, 130px)', padding: '0.25rem',
                              borderRight: '1px solid var(--color-surface-container-high)', borderBottom: '1px solid var(--color-surface-container-high)',
                              display: 'flex', flexDirection: 'column', minWidth: 0,
                              backgroundColor: d.currentMonth ? 'transparent' : 'var(--color-surface-container-low)'
                           }}>
                              <span style={{
                                 textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '32px', height: '32px', borderRadius: '50%', margin: '0 auto',
                                 fontWeight: 700, fontSize: '0.95rem',
                                 backgroundColor: d.isToday ? 'var(--color-primary)' : 'transparent',
                                 color: d.isToday ? 'white' : (d.currentMonth ? 'var(--color-on-surface)' : 'var(--color-on-surface-variant)'),
                                 opacity: d.currentMonth ? 1 : 0.5
                              }}>
                                 {d.day}
                              </span>

                              <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                 {acts.slice(0, 3).map((act: any, ax: number) => (
                                    <div key={ax} style={{
                                       backgroundColor: act.completed ? 'transparent' : getCategoryBg(act.category),
                                       color: act.completed ? 'var(--color-on-surface-variant)' : getCategoryColor(act.category),
                                       border: act.completed ? '1px dashed var(--color-on-surface-variant)' : '1px solid transparent',
                                       padding: 'clamp(2px, 0.5vw, 0.6rem) clamp(4px, 1vw, 0.75rem)', borderRadius: '16px', fontSize: 'clamp(0.55rem, 1.5vw, 0.75rem)', fontWeight: 700, textAlign: 'center',
                                       whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                       textDecoration: act.completed ? 'line-through' : 'none',
                                       opacity: d.currentMonth ? 1 : 0.6
                                    }}>
                                       {act.title}
                                    </div>
                                 ))}
                                 {acts.length > 3 && (
                                    <div style={{ fontSize: '0.65rem', textAlign: 'center', color: '#8b8b96', fontWeight: 600, marginTop: '2px' }}>
                                       +{acts.length - 3} más
                                    </div>
                                 )}
                              </div>
                           </div>
                        );
                     })}
                  </div>
               </div>

               {/* RIGHT -> AGENDA & PROGRESS */}
               <div className="mobile-order-1" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                  {/* AGENDA CARD */}
                  <div className="shadow-ambient mobile-p-1" style={{
                     backgroundColor: 'var(--color-surface-container-low)',
                     borderRadius: 'var(--radius-xl)', padding: '2.5rem'
                  }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                        <div>
                           <h2 style={{ fontSize: '2.25rem', color: 'var(--color-primary)', letterSpacing: '-0.03em', fontWeight: 600, textTransform: 'capitalize' }}>
                              {todayCap}
                           </h2>
                           <span style={{ color: '#6A6C76', fontSize: '0.9rem', fontWeight: 500, textTransform: 'capitalize' }}>Hoy • {currentMonthStr}</span>
                        </div>
                        <div style={{ backgroundColor: 'var(--color-surface-container-high)', padding: '1rem', borderRadius: '50%', display: 'flex' }}>
                           <CalendarIcon size={24} color="var(--color-primary)" />
                        </div>
                     </div>

                     {/* AGENDA TIMELINE LIST */}
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {todayTasks.length === 0 ? (
                           <div style={{ textAlign: 'center', color: '#8b8b96', padding: '2rem 0', fontWeight: 500 }}>
                              No hay tareas programadas para hoy. ¡Disfruta tu día libre!
                           </div>
                        ) : (
                           todayTasks.map((task: any, index: number) => (
                              <div key={task.id} style={{ display: 'flex', gap: '1.25rem', opacity: task.completed ? 0.5 : 1, transition: 'all 0.3s ease' }}>
                                 {task.completed ? (
                                    <CheckCircle2 size={18} color={getCategoryColor(task.category)} style={{ marginTop: '4px', flexShrink: 0 }} />
                                 ) : (
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: getCategoryColor(task.category), marginTop: '8px', flexShrink: 0, boxShadow: `0 0 10px ${getCategoryBg(task.category)}` }}></div>
                                 )}
                                 <div style={{ width: '100%' }}>
                                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-on-surface)', marginTop: '0.15rem', textDecoration: task.completed ? 'line-through' : 'none' }}>
                                       {task.title}
                                    </h4>
                                    <span style={{ backgroundColor: getCategoryBg(task.category), color: getCategoryColor(task.category), fontSize: '0.65rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '12px', display: 'inline-block', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                       {task.category}
                                    </span>
                                 </div>
                              </div>
                           ))
                        )}
                     </div>
                  </div>

                  {/* PRODUCTIVITY CARD */}
                  <div className="shadow-ambient" style={{
                     backgroundColor: 'var(--color-primary-container)',
                     borderRadius: 'var(--radius-xl)', padding: '2.5rem', position: 'relative', overflow: 'hidden'
                  }}>
                     <span className="text-label-disciplined" style={{ color: 'var(--color-primary)', fontSize: '0.75rem', zIndex: 2, position: 'relative' }}>PRODUCTIVIDAD DIARIA</span>
                     <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap', zIndex: 2, position: 'relative' }}>
                        <h2 style={{ fontSize: 'clamp(2.5rem, 12vw, 3.5rem)', fontWeight: 800, color: 'var(--color-on-surface)', lineHeight: 1, letterSpacing: '-0.04em' }}>{productivityScore}%</h2>
                        <span style={{ color: productivityScore === 100 ? 'var(--color-secondary)' : 'var(--color-primary)', fontWeight: 700, fontSize: '0.9rem' }}>
                           {completedToday} de {totalToday} completadas
                        </span>
                     </div>
                     <div style={{ background: 'rgba(0,0,0,0.1)', height: '10px', borderRadius: '10px', marginTop: '1.25rem', overflow: 'hidden', zIndex: 2, position: 'relative' }}>
                        <div style={{ background: 'var(--color-primary)', width: `${productivityScore}%`, height: '100%', borderRadius: '10px', transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}></div>
                     </div>
                     
                     {/* Decorative background glow */}
                     {productivityScore === 100 && (
                        <div style={{ position: 'absolute', right: '-20%', top: '-50%', width: '150px', height: '150px', background: 'var(--color-secondary)', opacity: 0.15, filter: 'blur(40px)', borderRadius: '50%', zIndex: 1 }}></div>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </AuthOverlay>
   );
}
