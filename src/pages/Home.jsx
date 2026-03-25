import React from 'react';
import { Link } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import { ArrowRight, Wrench, ShieldCheck, Zap } from 'lucide-react';

const Home = () => {
  const { products } = useProduct();
  const featured = products.slice(0, 3);

  return (
    <div className="animate-fade-in">
      <section style={{ textAlign: 'center', padding: '4rem 0 6rem 0' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: '800' }}>
          Yeni Nesil <span className="text-gradient">Bakım Ürünleri</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
          Otomotiv ve hırdavat sektörleri için geliştirdiğimiz ürünlerle bakım ve onarım süreçlerinizi hızlandırın, maksimum verimlilik sağlayın.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/catalog" className="btn btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1.125rem' }}>
            Ürünleri İncele <ArrowRight size={20} />
          </Link>
          <Link to="/login" className="btn btn-outline" style={{ padding: '0.875rem 2rem', fontSize: '1.125rem' }}>
            Bayi Girişi
          </Link>
        </div>
      </section>

      <section className="grid-catalog" style={{ marginBottom: '6rem' }}>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', background: 'rgba(255, 75, 43, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem', color: 'var(--primary)' }}>
            <Zap size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Yüksek Performans</h3>
          <p style={{ color: 'var(--text-muted)' }}>Zamandan ve insan gücünden tasarruf sağlayan üstün formüller.</p>
        </div>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', background: 'rgba(255, 75, 43, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem', color: 'var(--primary)' }}>
            <Wrench size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Kolay Uygulama</h3>
          <p style={{ color: 'var(--text-muted)' }}>Günlük bakım ve onarım işlerinizi zahmetsizce halletmeniz için tasarlandı.</p>
        </div>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', background: 'rgba(255, 75, 43, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem', color: 'var(--primary)' }}>
            <ShieldCheck size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Maksimum Kalite</h3>
          <p style={{ color: 'var(--text-muted)' }}>Beklentilerin ötesinde, en sağlıklı ve güvenilir çözümler.</p>
        </div>
      </section>

      <section style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem' }}>Öne Çıkan Ürünler</h2>
          <Link to="/catalog" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Tümünü Gör <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="grid-catalog">
          {featured.map(product => (
            <div key={product.id} className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '200px', overflow: 'hidden' }}>
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 600 }}>{product.category}</span>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{product.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', flex: 1 }}>
                  {product.description.substring(0, 80)}...
                </p>
                <Link to={`/product/${product.id}`} className="btn btn-outline" style={{ width: '100%' }}>
                  İncele
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
