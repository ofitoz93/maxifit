import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { Loader, Package, ChevronRight } from 'lucide-react';

const CATEGORIES = ["Tüm Ürünler", "Temizleme", "Endüstriyel", "Oto Kozmetik", "Yağlayıcı", "İnşaat", "Katkı", "Sprey Boya"];

const Catalog = () => {
  const { products, loading } = useProduct();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState("Tüm Ürünler");

  const getPrice = (basePrice) => {
    if (user?.role === 'dealer') {
      return (basePrice * 0.7).toFixed(2);
    }
    return Number(basePrice).toFixed(2);
  };

  const filteredProducts = activeCategory === "Tüm Ürünler" 
    ? products 
    : products.filter(p => (p.category || 'Temizleme') === activeCategory);

  return (
    <div className="animate-fade-in">
      <section 
        className="hero-banner" 
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1632733711679-529326f6db12?auto=format&fit=crop&q=80&w=1920")',
          minHeight: '40vh',
          marginBottom: '4rem'
        }}
      >
        <div className="hero-overlay" style={{ background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)' }}></div>
        <div className="hero-content">
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 800 }}>Ürünlerimiz</h1>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto' }}>Aradığınız tüm Maxifit endüstriyel sprey ve otomotiv çözümleri.</p>
        </div>
      </section>

      <div className="container" style={{ paddingBottom: '6rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2.5rem', alignItems: 'start' }}>
          
          <aside className="glass-card" style={{ padding: 0, overflow: 'hidden', position: 'sticky', top: '100px' }}>
            <div style={{ 
              background: 'linear-gradient(to right, #1e3a8a, #1e40af)', 
              padding: '1.25rem 1.5rem', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <Package size={20} />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0, color: 'white' }}>Kategoriler</h2>
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {CATEGORIES.map((cat, idx) => (
                <li key={cat} style={{ borderBottom: idx < CATEGORIES.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <button 
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '1.25rem 1.5rem',
                      background: activeCategory === cat ? 'rgba(0,0,0,0.03)' : 'transparent',
                      color: activeCategory === cat ? 'var(--primary)' : 'var(--text-muted)',
                      fontWeight: activeCategory === cat ? 600 : 400,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'var(--transition)'
                    }}
                  >
                    {cat}
                    {activeCategory === cat && <ChevronRight size={16} />}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <main>
            {user?.role === 'dealer' && (
              <div className="glass-card" style={{ background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)', padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ background: 'var(--success)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>BAYİ</span>
                <span style={{ color: 'var(--text)', fontSize: '0.95rem' }}>Şu anda fiyatları <b style={{ color: 'var(--success)' }}>%30 bayi indirimiyle</b> görüntülüyorsunuz.</span>
              </div>
            )}

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 0', color: 'var(--text-muted)', background: 'var(--bg-card)', borderRadius: '16px' }}>
                <Loader className="spin" size={40} style={{ marginBottom: '1rem', color: 'var(--primary)' }} />
                <p>Ürünler yükleniyor...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="glass-card" style={{ padding: '5rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '1.2rem' }}>Bu kategoride ürün bulunamadı.</p>
              </div>
            ) : (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
                gap: '1.5rem' 
              }}>
                {filteredProducts.map(product => {
                  
                  let productImg = 'https://via.placeholder.com/200x300?text=Maxifit';
                  if (product.image) {
                    try {
                      const parsed = JSON.parse(product.image);
                      if (Array.isArray(parsed) && parsed.length > 0) productImg = parsed[0];
                      else if (typeof parsed === 'string') productImg = parsed;
                    } catch {
                      productImg = product.image;
                    }
                  }

                  return (
                    <Link to={`/product/${product.id}`} key={product.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', textDecoration: 'none' }}>
                      <div style={{ height: '260px', padding: '1.5rem', position: 'relative', background: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
                        {user?.role === 'dealer' && (
                          <span className="badge badge-discount" style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10, fontSize: '0.7rem' }}>%30 Bayi</span>
                        )}
                        <img 
                          src={productImg} 
                          alt={product.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'var(--transition-slow)' }} 
                          className="product-card-image"
                        />
                      </div>
                      
                      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'center', background: 'var(--bg-card)' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text)', fontWeight: 600, lineHeight: 1.3 }}>
                          {product.name}
                        </h3>

                        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          {user?.role === 'dealer' && (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginBottom: '0.1rem' }}>
                              ₺{Number(product.price).toFixed(2)}
                            </span>
                          )}
                          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                            ₺{getPrice(product.price)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </main>
        </div>
      </div>
      
      <style>{`
        @media (max-width: 900px) {
           .container > div { grid-template-columns: 1fr !important; }
           aside { position: static !important; margin-bottom: 2rem; }
        }
      `}</style>
    </div>
  );
};

export default Catalog;
