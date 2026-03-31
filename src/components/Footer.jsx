import React from 'react';
import { useContent } from '../context/ContentContext';
import { Package } from 'lucide-react';

const Footer = () => {
  const { content } = useContent();

  return (
    <footer style={{ background: '#0f172a', padding: '4rem 2rem 2rem', color: 'rgba(255,255,255,0.7)', marginTop: 'auto' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <img src="/logo.png" alt="Maxifit" style={{ height: '50px', background: 'white', padding: '5px', borderRadius: '8px' }} />
          </div>
          <p style={{ lineHeight: '1.6', marginBottom: '1.5rem', color: 'rgba(255,255,255,0.5)' }}>
            {content?.footerText || 'Maxifit Automotive - Premium Sprey Çözümleri'}
          </p>
        </div>
        
        <div>
          <h4 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '1.5rem' }}>Hızlı Bağlantılar</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li><a href="/catalog" style={{ color: 'inherit' }}>Katalog & Ürünler</a></li>
            <li><a href="/dealership" style={{ color: 'inherit' }}>Bayilik Başvurusu</a></li>
            <li><a href="/fason" style={{ color: 'inherit' }}>Fason Üretim</a></li>
            <li><a href="/e-katalog" style={{ color: 'inherit' }}>E-Katalog</a></li>
          </ul>
        </div>
        
        <div>
          <h4 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '1.5rem' }}>İletişim</h4>
          <address style={{ fontStyle: 'normal', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p>{content?.contactAddress || 'Otomotiv Sanayi Bölgesi, İstanbul'}</p>
            <p>Tel: {content?.contactPhone || '+90 (850) 123 45 67'}</p>
            <p>E-Posta: {content?.contactEmail || 'info@maxifit.com.tr'}</p>
          </address>
        </div>
      </div>
      
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
        © {new Date().getFullYear()} Maxifit Automotive. Tüm hakları saklıdır.
      </div>
    </footer>
  );
};

export default Footer;
