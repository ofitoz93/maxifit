import React from 'react';
import { useContent } from '../context/ContentContext';

const Corporate = () => {
  const { content, loading } = useContent();

  if (loading) return null; // Can render a loader here if needed

  return (
    <div className="animate-fade-in">
      <section 
        className="hero-banner" 
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1563720225642-1e96ee5c6020?auto=format&fit=crop&q=80&w=1920")',
          minHeight: '40vh',
          marginBottom: '4rem'
        }}
      >
        <div className="hero-overlay" style={{ background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)' }}></div>
        <div className="hero-content">
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 800 }}>{content.corpTitle || 'Kurumsal'}</h1>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto' }}>Geleceğin otomotiv teknolojilerini üretiyoruz.</p>
        </div>
      </section>

      <div className="container" style={{ paddingBottom: '6rem' }}>
        <div className="glass-card" style={{ padding: '3rem', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>{content.corpTitle || 'Hakkımızda'}</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
            {content.corpDesc}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>Kalite Politikamız</h2>
            <ul style={{ color: 'var(--text-muted)', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Sürekli gelişim ve yenilikçi üretim süreçleri.</li>
              <li style={{ marginBottom: '0.5rem' }}>Çevre dostu ve insan sağlığına duyarlı ürün formülleri.</li>
              <li style={{ marginBottom: '0.5rem' }}>Uluslararası standartlarda dayanıklılık ve etkinlik garantisi.</li>
              <li>Müşteri odaklı tam destek ve %100 memnuniyet.</li>
            </ul>
          </div>
          
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>Sertifikalarımız</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '2rem' }}>
              Tüm Maxifit ürünleri TSE, ISO 9001 ve Avrupa Birliği güvenlik normlarına uygun olarak
              belgelendirilmiş tesislerde üretilmektedir.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ background: '#f8fafc', border: '1px solid var(--border)', padding: '1rem', borderRadius: '8px', textAlign: 'center', flex: 1, fontWeight: 600 }}>ISO 9001</div>
              <div style={{ background: '#f8fafc', border: '1px solid var(--border)', padding: '1rem', borderRadius: '8px', textAlign: 'center', flex: 1, fontWeight: 600 }}>CE Belgesi</div>
              <div style={{ background: '#f8fafc', border: '1px solid var(--border)', padding: '1rem', borderRadius: '8px', textAlign: 'center', flex: 1, fontWeight: 600 }}>TSE Onayı</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Corporate;
