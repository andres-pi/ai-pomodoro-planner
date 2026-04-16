export default function Home() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
      <header style={{ marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem' }}>Planifica tu éxito ✍️</h1>
        <p style={{ fontSize: '1.125rem', color: '#6A6C76', marginTop: '0.5rem' }}>
          Organiza tus sesiones de estudio y alcanza tus metas con elegancia y disciplina.
        </p>
      </header>

      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', 
        gap: '2rem' 
      }}>
        {/* Placeholder para el Componente AI Calendar / Planner */}
        <div 
          className="shadow-ambient" 
          style={{ 
            backgroundColor: 'var(--color-surface-container-lowest)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            minHeight: '400px'
          }}
        >
          <div className="text-label-disciplined" style={{ color: 'var(--color-primary)' }}>
            Focus Schedule
          </div>
          <h2 style={{ marginTop: '0.5rem', marginBottom: '2rem' }}>Octubre 2024</h2>
          {/* Aquí irá el grid del calendario */}
        </div>

        {/* Placeholder para la sección derecha de widgets diarios */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div 
            className="shadow-ambient" 
            style={{ 
              backgroundColor: 'var(--color-surface-container-lowest)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
             <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>Daily Goal</h3>
             <div style={{
                marginTop: '1.5rem', width: '150px', height: '150px', 
                borderRadius: 'var(--radius-full)', 
                border: '12px solid var(--color-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
             }}>
                <h2 style={{ fontSize: '2.5rem' }}>65%</h2>
             </div>
             <p style={{ marginTop: '1rem', fontStyle: 'italic', color: '#6A6C76' }}>
               "La constancia es la llave del atelier mental."
             </p>
          </div>
        </div>
      </section>
    </div>
  );
}
