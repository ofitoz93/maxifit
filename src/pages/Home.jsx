import React from 'react';
import { Link } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import { useContent } from '../context/ContentContext';
import { ArrowRight, Wrench, ShieldCheck, Zap, Droplet, Award } from 'lucide-react';

const Home = () => {
  const { products, loading: productsLoading } = useProduct();
  const { content, loading: contentLoading } = useContent();
  const featured = products.slice(0, 3); // ilk 3 ürünü al

  if (contentLoading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Yükleniyor...</div>;
  }

  // Handle line breaks in title if exist
  const titleLines = (content.homeHeroTitle || 'Aracınız İçin\nProfesyonel Spreyler').split('\n');

  return (
    <div className="animate-fade-in">
      <section 
        className="hero-banner" 
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=1920")',
          minHeight: '85vh',
          marginBottom: '5rem'
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
            <img src="/logo.png" alt="Maxifit" style={{ height: '140px', objectFit: 'contain', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.3))' }} />
          </div>
          <h1 style={{ fontSize: '4.5rem', marginBottom: '1.5rem', fontWeight: '800', lineHeight: '1.1' }}>
            {titleLines[0]} <br />
            {titleLines[1] && <span className="text-gradient">{titleLines[1]}</span>}
          </h1>
          <p style={{ fontSize: '1.25rem', maxWidth: '650px', margin: '0 auto 3rem auto', lineHeight: '1.6' }}>
            {content.homeHeroSub}
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/catalog" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
              Tüm Ürünleri İncele <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
              Bayi Portalı
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="container" style={{ marginBottom: '8rem' }}>
        <div className="grid-catalog">
          <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', background: 'rgba(239, 68, 68, 0.1)', padding: '1.25rem', borderRadius: '50%', marginBottom: '1.5rem', color: 'var(--primary)' }}>
              <Zap size={36} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Anında Etki</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Saniyeler içinde nüfuz eden güçlü formülü ile pas ve inatçı kirleri anında çözer. Zaman kazandırır.</p>
          </div>
          <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', background: 'rgba(30, 58, 138, 0.1)', padding: '1.25rem', borderRadius: '50%', marginBottom: '1.5rem', color: 'var(--secondary)' }}>
              <ShieldCheck size={36} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Uzun Süreli Koruma</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Uygulanan yüzeyde görünmez bir koruyucu film tabakası oluşturarak korozyonu ve aşınmayı geciktirir.</p>
          </div>
          <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', background: 'rgba(16, 185, 129, 0.1)', padding: '1.25rem', borderRadius: '50%', marginBottom: '1.5rem', color: 'var(--success)' }}>
              <Droplet size={36} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Hassas Formül</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Plastik ve kauçuk aksamlara zarar vermeyen özel içeriği ile motor içi dahil tüm bölgelerde güvenle kullanılabilir.</p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
          <div>
            <span style={{ color: 'var(--primary)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.85rem' }}>ÖZEL SEÇİM</span>
            <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>Öne Çıkan Spreyler</h2>
          </div>
          <Link to="/catalog" className="btn btn-outline-dark" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}>
            Tümünü Gör <ArrowRight size={18} />
          </Link>
        </div>
        
        {productsLoading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
             Yükleniyor...
          </div>
        ) : (
          <div className="grid-catalog">
            {featured.length > 0 ? featured.map(product => {
              // Parse image JSON if it exists
              let productImg = 'https://via.placeholder.com/300x400?text=Kutu+Sprey';
              if (product.image) {
                try {
                  const parsed = JSON.parse(product.image);
                  if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]) productImg = parsed[0];
                  else if (typeof parsed === 'string' && parsed) productImg = parsed;
                } catch {
                  if (product.image) productImg = product.image;
                }
              }

              return (
                <div key={product.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ height: '300px', padding: '1.5rem', background: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
                    <img src={productImg} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.12))', transition: 'var(--transition-slow)' }} className="product-card-image" />
                  </div>
                  <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <span className="badge">{product.category || 'Oto Sprey'}</span>
                      <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary)' }}>₺{Number(product.price).toFixed(2)}</span>
                    </div>
                    <h3 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>{product.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem', flex: 1, lineHeight: '1.6' }}>
                      {(product.description || '').substring(0, 90)}...
                    </p>
                    <Link to={`/product/${product.id}`} className="btn btn-primary" style={{ width: '100%' }}>
                      Ürün Detaylarını İncele
                    </Link>
                  </div>
                </div>
              );
            }) : (
              <div style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                Henüz ürün bulunmuyor. Yönetici panelinden ürün ekleyin.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
