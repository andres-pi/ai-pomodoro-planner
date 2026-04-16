"use client";
import React from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';

const CALENDAR_DAYS = [
  { day: 29, currentMonth: false }, { day: 30, currentMonth: false }, { day: 1, currentMonth: true }, { day: 2, currentMonth: true }, { day: 3, currentMonth: true }, { day: 4, currentMonth: true }, { day: 5, currentMonth: true },
  { day: 6, currentMonth: true }, { day: 7, currentMonth: true, isToday: true }, { day: 8, currentMonth: true }, { day: 9, currentMonth: true }, { day: 10, currentMonth: true }, { day: 11, currentMonth: true }, { day: 12, currentMonth: true },
  { day: 13, currentMonth: true }, { day: 14, currentMonth: true }, { day: 15, currentMonth: true }, { day: 16, currentMonth: true }, { day: 17, currentMonth: true }, { day: 18, currentMonth: true }, { day: 19, currentMonth: true },
  { day: 20, currentMonth: true }, { day: 21, currentMonth: true }, { day: 22, currentMonth: true }, { day: 23, currentMonth: true }, { day: 24, currentMonth: true }, { day: 25, currentMonth: true }, { day: 26, currentMonth: true },
];

const EVENTS: Record<string, any[]> = {
  "2": [{ title: "Diseño UX/UI", type: "primary" }],
  "4": [{ title: "Study Group", type: "tertiary" }],
  "7": [{ title: "Yoga & Pilates", type: "tertiary" }],
  "10": [{ title: "Freelance Project", type: "primary" }],
  "16": [{ title: "Mentor Session", type: "tertiary" }],
};

export default function CalendarPage() {
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 2.5rem' }}>
      
      {/* HEADER */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
         <div>
            <h1 style={{ fontSize: '2.75rem', color: 'var(--color-on-surface)', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
               Planifica tu éxito ✍️
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
                Monthly
             </button>
             <button style={{ padding: '0.75rem 2rem', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.9rem', color: '#8b8b96', transition: 'all 0.2s ease', backgroundColor: 'transparent' }}>
                Weekly
             </button>
         </div>
      </header>

      {/* MAIN LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2.5rem' }}>
         
         {/* LEFT -> CALENDAR */}
         <div className="shadow-ambient" style={{ 
            backgroundColor: 'var(--color-surface-container-lowest)', 
            borderRadius: 'var(--radius-xl)', 
            padding: '2.5rem' 
         }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                   <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-on-surface)', letterSpacing: '-0.02em' }}>Octubre 2024</h2>
                   <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--color-on-surface)' }}>
                      <button style={{ padding: '0.5rem', borderRadius: '50%', backgroundColor: 'transparent' }}><ChevronLeft size={20} /></button>
                      <button style={{ padding: '0.5rem', borderRadius: '50%', backgroundColor: 'transparent' }}><ChevronRight size={20} /></button>
                   </div>
               </div>
               <button style={{
                  backgroundColor: 'var(--color-primary)', color: 'white', padding: '1rem 1.5rem', 
                  borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.9rem',
                  display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 20px rgba(100, 83, 162, 0.2)',
                  transition: 'transform 0.2s ease'
               }}
               onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
               onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
               >
                   <Plus size={18} /> Nuevo Evento
               </button>
            </div>

            {/* GRID OF DAYS */}
            <div style={{
               display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', 
               borderTop: '1px solid var(--color-surface-container-high)', borderLeft: '1px solid var(--color-surface-container-high)',
               borderTopLeftRadius: '16px', borderTopRightRadius: '16px',
               overflow: 'hidden'
            }}>
                {['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'].map((d) => (
                    <div key={d} className="text-label-disciplined" style={{ padding: '1.5rem 1rem', textAlign: 'center', color: '#9a9a9d', borderRight: '1px solid var(--color-surface-container-high)', borderBottom: '1px solid var(--color-surface-container-high)' }}>
                        {d}
                    </div>
                ))}
                {CALENDAR_DAYS.map((d, i) => {
                   const acts = d.currentMonth && EVENTS[`${d.day}`];
                   return (
                      <div key={i} style={{ 
                         minHeight: '130px', padding: '1rem', 
                         borderRight: '1px solid var(--color-surface-container-high)', borderBottom: '1px solid var(--color-surface-container-high)',
                         display: 'flex', flexDirection: 'column'
                      }}>
                         <span style={{ 
                            textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '32px', height: '32px', borderRadius: '50%', margin: '0 auto',
                            fontWeight: 700, fontSize: '0.95rem',
                            backgroundColor: d.isToday ? 'var(--color-primary)' : 'transparent',
                            color: d.isToday ? 'white' : (d.currentMonth ? 'var(--color-on-surface)' : '#c2c2c2')
                         }}>
                            {d.day}
                         </span>
                         
                         <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                             {acts && acts.map((act, ax) => (
                                <div key={ax} style={{
                                    backgroundColor: act.type === 'primary' ? 'var(--color-primary-container)' : 'var(--color-tertiary-fixed-dim)',
                                    color: act.type === 'primary' ? 'var(--color-primary)' : 'var(--color-tertiary)',
                                    padding: '0.6rem 0.75rem', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 700, textAlign: 'center',
                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                }}>
                                   {act.title}
                                </div>
                             ))}
                         </div>
                      </div>
                   );
                })}
            </div>
         </div>

         {/* RIGHT -> AGENDA & PROGRESS */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             
             {/* AGENDA CARD */}
             <div className="shadow-ambient" style={{ 
                 backgroundColor: 'var(--color-surface-container-low)',
                 borderRadius: 'var(--radius-xl)', padding: '2.5rem'
             }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                    <div>
                        <h2 style={{ fontSize: '2.25rem', color: 'var(--color-primary)', letterSpacing: '-0.03em', fontWeight: 600 }}>Lunes 7</h2>
                        <span style={{ color: '#6A6C76', fontSize: '0.9rem', fontWeight: 500 }}>Hoy • Octubre</span>
                    </div>
                    <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '50%', display: 'flex', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                        <CalendarIcon size={24} color="var(--color-primary)" />
                    </div>
                 </div>

                 {/* AGENDA TIMELINE LIST */}
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    <div style={{ display: 'flex', gap: '1.25rem' }}>
                       <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-tertiary)', marginTop: '8px' }}></div>
                       <div>
                          <span className="text-label-disciplined" style={{ color: '#8b8b96', fontSize: '0.7rem' }}>08:00 AM</span>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-on-surface)', marginTop: '0.25rem' }}>Yoga & Pilates Matutino</h4>
                          <span style={{ color: '#8b8b96', fontSize: '0.85rem' }}>Gimnasio Studio Soul</span>
                       </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1.25rem', borderLeft: '2px solid rgba(49, 50, 56, 0.05)', marginLeft: '4px', paddingLeft: 'calc(1.25rem - 6px)', position: 'relative' }}>
                       <div style={{ position: 'absolute', left: '-6px', top: '8px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></div>
                       <div>
                          <span className="text-label-disciplined" style={{ color: '#8b8b96', fontSize: '0.7rem' }}>10:30 AM</span>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-on-surface)', marginTop: '0.25rem' }}>Deep Focus: Research UI</h4>
                          <span style={{ backgroundColor: 'var(--color-primary-container)', color: 'var(--color-primary)', fontSize: '0.65rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '12px', display: 'inline-block', marginTop: '0.5rem', letterSpacing: '0.05em' }}>TRABAJO</span>
                       </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1.25rem' }}>
                       <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-secondary)', marginTop: '8px' }}></div>
                       <div>
                          <span className="text-label-disciplined" style={{ color: '#8b8b96', fontSize: '0.7rem' }}>04:00 PM</span>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-on-surface)', marginTop: '0.25rem' }}>Revisión Portfolio Group</h4>
                          <span style={{ color: '#8b8b96', fontSize: '0.85rem', display: 'inline-block', marginTop: '0.25rem' }}>En Google Meet</span>
                       </div>
                    </div>

                 </div>
             </div>

             {/* PRODUCTIVITY CARD */}
             <div className="shadow-ambient" style={{ 
                 backgroundColor: 'var(--color-primary-container)', 
                 borderRadius: 'var(--radius-xl)', padding: '2.5rem'
             }}>
                 <span className="text-label-disciplined" style={{ color: 'var(--color-primary)', fontSize: '0.75rem' }}>PRODUCTIVIDAD</span>
                 <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '1rem' }}>
                    <h2 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--color-on-surface)', lineHeight: 1, letterSpacing: '-0.04em' }}>84%</h2>
                    <span style={{ color: 'var(--color-secondary)', fontWeight: 700, fontSize: '0.9rem' }}>+12% vs ayer</span>
                 </div>
                 <div style={{ background: '#d1c7e8', height: '10px', borderRadius: '10px', marginTop: '1.25rem', overflow:'hidden' }}>
                    <div style={{ background: 'var(--color-primary)', width: '84%', height: '100%', borderRadius: '10px' }}></div>
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
}
