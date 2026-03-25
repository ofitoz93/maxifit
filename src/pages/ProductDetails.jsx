import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, CheckCircle2, ShoppingCart } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProduct();
  const { user } = useAuth();
  
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="container animate-fade-in" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <h2>Ürün bulunamadı.</h2>
        <Link to="/catalog" className="btn btn-primary" style={{ marginTop: '1rem' }}>Kataloğa Dön</Link>
      </div>
    );
  }

  const getPrice = (basePrice) => {
    if (user?.role === 'dealer') {
      return (basePrice * 0.7).toFixed(2);
    }
    return basePrice.toFixed(2);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <button onClick={() => navigate(-1)} className="btn" style={{ padding: '0', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
        <ArrowLeft size={16} /> Geri Dön
      </button>

      <div className="glass-card" style={{ display: 'flex', flexWrap: 'wrap', overflow: 'hidden' }}>
        <div style={{ flex: '1 1 400px', minHeight: '400px', padding: '2rem', background: 'rgba(0,0,0,0.2)' }}>
          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px' }} />
        </div>
        <div style={{ flex: '1 1 400px', padding: '3rem' }}>
          <span style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--primary)', fontWeight: 600 }}>{product.category}</span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', marginTop: '0.5rem' }}>{product.name}</h1>
          
          <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column' }}>
            {user?.role === 'dealer' && (
              <span style={{ fontSize: '1rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginBottom: '0.25rem' }}>
                Standart Fiyat: ₺{product.price.toFixed(2)}
              </span>
            )}
            <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)' }}>
              ₺{getPrice(product.price)}
            </span>
            {user?.role === 'dealer' && (
              <span style={{ fontSize: '0.875rem', color: 'var(--success)', marginTop: '0.5rem' }}>Size Özel %30 Bayi İndirimi Uygulandı!</span>
            )}
          </div>

          <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '2rem' }}>
            {product.description}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CheckCircle2 size={20} color="var(--success)" /> 
              <span>Stokta Var - Aynı Gün Kargo</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CheckCircle2 size={20} color="var(--success)" /> 
              <span>Maxifit Onaylı Orijinal Ürün</span>
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.125rem', display: 'flex', justifyContent: 'center' }}>
            <ShoppingCart size={20} /> Sepete Ekle
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
