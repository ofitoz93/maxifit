import React from 'react';
import { Briefcase } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const Dealership = () => {
  const { content, loading } = useContent();
  if (loading) return null;

  return (
    <div className="animate-fade-in">
      <section 
        className="hero-banner" 
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1920")',
          minHeight: '40vh',
          marginBottom: '4rem'
        }}
      >
        <div className="hero-overlay" style={{ background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)' }}></div>
        <div className="hero-content">
          <div style={{ display: 'inline-flex', background: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '50%', color: 'white', marginBottom: '1.5rem' }}>
            <Briefcase size={32} />
          </div>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 800 }}>Bayimiz Olun</h1>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto' }}>Kazandıran Maxifit ekosistemine katılarak gücümüze güç katın.</p>
        </div>
      </section>

      <div className="container" style={{ paddingBottom: '6rem', maxWidth: '800px' }}>
        <div className="glass-card" style={{ padding: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{content.dealerTitle || 'Neden Maxifit Bayisi Olmalısınız?'}</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {content.dealerDesc}
          </p>

          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Firma Adı</label>
                <input type="text" className="input-field" placeholder="Firma Ünvanı" />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Yetkili Kişi</label>
                <input type="text" className="input-field" placeholder="Ad Soyad" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Telefon</label>
                <input type="tel" className="input-field" placeholder="05XX XXX XX XX" />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>E-Posta</label>
                <input type="email" className="input-field" placeholder="info@firma.com" />
              </div>
            </div>
            <div className="input-group">
              <label>Adres & Bölge</label>
              <textarea className="input-field" rows="3" placeholder="Hangi bölgede faaliyet göstereceksiniz?"></textarea>
            </div>
            <button type="button" className="btn btn-primary" style={{ padding: '1rem', fontSize: '1.1rem', marginTop: '1rem' }}>
              Bayilik Başvurusunu Gönder
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dealership;
