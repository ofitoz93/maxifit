import React from 'react';
import { Factory } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const ContractManufacturing = () => {
  const { content, loading } = useContent();
  if (loading) return null;

  return (
    <div className="animate-fade-in">
      <section 
        className="hero-banner" 
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1920")',
          minHeight: '40vh',
          marginBottom: '4rem'
        }}
      >
        <div className="hero-overlay" style={{ background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)' }}></div>
        <div className="hero-content">
          <div style={{ display: 'inline-flex', background: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '50%', color: 'white', marginBottom: '1.5rem' }}>
            <Factory size={32} />
          </div>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 800 }}>Fason Üretim</h1>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto' }}>Kendi markanızla, yüksek kaliteli Maxifit tesis güvencesi.</p>
        </div>
      </section>

      <div className="container" style={{ paddingBottom: '6rem', maxWidth: '800px' }}>
        <div className="glass-card" style={{ padding: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>{content.fasonTitle || 'Tesisimiz ve Kapasitemiz'}</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
            {content.fasonDesc}
          </p>

          <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--primary)' }}>Süreç Nasıl İşliyor?</h3>
          <ol style={{ color: 'var(--text-muted)', paddingLeft: '1.5rem', lineHeight: 2, marginBottom: '2.5rem' }}>
            <li>İhtiyacınız olan ürün grubunun seçimi (Örn: Pas sökücü, Fren Balata Temizleyici).</li>
            <li>Özel formülasyon (Ar-Ge) veya mevcut patentli formülümüzün kullanımı.</li>
            <li>Ambalaj ve Kutu (Teneke/Alüminyum) tasarımınızın uygulanması.</li>
            <li>Seri üretime geçiş, kalite kontrol ve teslimat.</li>
          </ol>

          <div style={{ background: '#f8fafc', padding: '2.5rem', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>Fason Üretim Teklifi Alın</h4>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Minimum sipariş adetleri (MOQ) ve formülasyon detayları için hemen bizimle iletişime geçin.</p>
            <button className="btn btn-outline-dark" style={{ padding: '0.8rem 2rem' }}>İletişim Kur</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractManufacturing;
