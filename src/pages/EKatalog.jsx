import React from 'react';
import { DownloadCloud, FileText } from 'lucide-react';

const EKatalog = () => {
  return (
    <div className="animate-fade-in">
      <section 
        className="hero-banner" 
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1507208613628-131777b7ab9c?auto=format&fit=crop&q=80&w=1920")',
          minHeight: '40vh',
          marginBottom: '4rem'
        }}
      >
        <div className="hero-overlay" style={{ background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)' }}></div>
        <div className="hero-content">
          <div style={{ display: 'inline-flex', background: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '50%', color: 'white', marginBottom: '1.5rem' }}>
            <FileText size={32} />
          </div>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 800 }}>E-Katalog</h1>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto' }}>Tüm ürün portföyümüz için teknik spesifikasyon dökümanı.</p>
        </div>
      </section>

      <div className="container" style={{ paddingBottom: '6rem', maxWidth: '800px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
          Tüm Maxifit ürün yelpazesini, teknik özelliklerini ve kullanım alanlarını detaylı PDF kataloğumuzdan inceleyebilirsiniz.
        </p>

        <div className="glass-card" style={{ padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
           <div style={{ padding: '2rem', background: '#f8fafc', border: '1px dashed var(--border)', borderRadius: '12px', marginBottom: '2.5rem', width: '100%', maxWidth: '350px' }}>
             <FileText size={70} color="var(--primary)" style={{ margin: '0 auto', opacity: 0.9 }} />
             <p style={{ marginTop: '1.5rem', fontWeight: 600, fontSize: '1.1rem' }}>Maxifit Ürün Katalog 2026.pdf</p>
             <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Boyut: 12.4 MB</span>
           </div>
           
           <button className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
             <DownloadCloud size={20} /> Kataloğu İndir (PDF)
           </button>
        </div>
      </div>
    </div>
  );
};

export default EKatalog;
