import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const Contact = () => {
  const { content, loading } = useContent();
  if (loading) return null;

  return (
    <div className="animate-fade-in">
      <section 
        className="hero-banner" 
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=1920")',
          minHeight: '40vh',
          marginBottom: '4rem'
        }}
      >
        <div className="hero-overlay" style={{ background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)' }}></div>
        <div className="hero-content">
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 800 }}>İletişim</h1>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto' }}>Soru ve görüşleriniz için buradayız.</p>
        </div>
      </section>

      <div className="container" style={{ paddingBottom: '6rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>
          
          {/* İletişim Formu */}
          <div className="glass-card" style={{ padding: '3rem' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Bize Yazın</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Adınız Soyadınız</label>
                <input type="text" className="input-field" placeholder="Ad Soyad" />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>E-Posta Adresiniz</label>
                <input type="email" className="input-field" placeholder="ornek@firma.com" />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Mesajınız</label>
                <textarea className="input-field" rows="5" placeholder="Mesajınızı buraya yazınız..."></textarea>
              </div>
              <button type="button" className="btn btn-primary" style={{ padding: '1rem', marginTop: '1rem' }}>Mesaj Gönder</button>
            </form>
          </div>

          {/* İletişim Bilgileri */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--primary)' }}>
                <MapPin size={32} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>Adres</h3>
                <p style={{ color: 'var(--text-muted)' }}>{content.contactAddress || 'Otomotiv Sanayi, İstanbul'}</p>
              </div>
            </div>
            
            <div className="glass-card" style={{ padding: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(30, 58, 138, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--secondary)' }}>
                <Phone size={32} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>Telefon</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{content.contactPhone || '+90 (850) 123 45 67'}</p>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--success)' }}>
                <Mail size={32} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>E-Posta</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{content.contactEmail || 'info@maxifit.com.tr'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
