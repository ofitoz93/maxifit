import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { Loader, ArrowLeft, CheckCircle2, ShoppingCart, ShieldCheck, Zap, Plus, Minus } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const { products, loading } = useProduct();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('https://via.placeholder.com/400x500?text=Kutu+Sprey');
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find(p => p.id === id || p.id === parseInt(id));
      setProduct(found);
      
      if (found && found.image) {
        try {
          const parsedImgs = JSON.parse(found.image);
          if (Array.isArray(parsedImgs) && parsedImgs.length > 0) {
            setImages(parsedImgs);
            setActiveImage(parsedImgs[0]);
          } else if (typeof parsedImgs === 'string') {
            setImages([parsedImgs]);
            setActiveImage(parsedImgs);
          }
        } catch (error) {
           setImages([found.image]);
           setActiveImage(found.image);
        }
      }
    }
  }, [id, products]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--text-muted)' }}>
        <Loader className="spin" size={48} style={{ marginBottom: '1rem', color: 'var(--primary)' }} />
        <p style={{ fontSize: '1.2rem' }}>Ürün bilgileri yükleniyor...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Ürün Bulunamadı</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Aradığınız ürün yayından kaldırılmış olabilir.</p>
        <Link to="/catalog" className="btn btn-primary">Kataloğa Dön</Link>
      </div>
    );
  }

  const basePrice = Number(product.price);
  const finalPrice = user?.role === 'dealer' ? basePrice * 0.7 : basePrice;

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0 6rem' }}>
      <Link to="/catalog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '2rem', fontWeight: 500 }}>
        <ArrowLeft size={18} /> Tüm Ürünlere Dön
      </Link>

      <div className="glass-card" style={{ display: 'flex', flexWrap: 'wrap', overflow: 'hidden', padding: 0 }}>
        {/* Sol Taraf: Görsel Galerisi */}
        <div style={{ flex: '1 1 500px', background: '#ffffff', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid var(--border)', position: 'relative' }}>
          {user?.role === 'dealer' && (
            <span className="badge badge-discount" style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10, fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
              %30 Bayi İndirimi
            </span>
          )}
          
          {/* Main Active Image */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', minHeight: '500px' }}>
            <img 
              src={activeImage} 
              alt={product.name} 
              style={{ maxHeight: '500px', maxWidth: '100%', objectFit: 'contain', filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.15))', transition: 'all 0.3sease' }}
              key={activeImage} // force re-animation
              className="animate-fade-in"
            />
          </div>

          {/* Multiple Image Thumbnails */}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem', width: '100%', justifyContent: 'center' }}>
              {images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  style={{ 
                    width: '70px', height: '70px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0,
                    border: activeImage === img ? '2px solid var(--primary)' : '1px solid var(--border)',
                    opacity: activeImage === img ? 1 : 0.6,
                    padding: '4px', background: 'white', transition: 'var(--transition)'
                  }}
                >
                  <img src={img} alt={`Thumb ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sağ Taraf: Ürün Detayları */}
        <div style={{ flex: '1 1 400px', padding: '3rem', display: 'flex', flexDirection: 'column' }}>
          <span className="badge" style={{ alignSelf: 'flex-start', marginBottom: '1.5rem', background: '#f1f5f9', color: 'var(--text-muted)' }}>
            {product.category || 'Oto Sprey'}
          </span>
          
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1.2 }}>
            {product.name}
          </h1>

          <div style={{ marginBottom: '2rem' }}>
            {user?.role === 'dealer' && (
              <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginBottom: '0.25rem' }}>
                Liste Fiyatı: ₺{basePrice.toFixed(2)}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
              <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
                ₺{finalPrice.toFixed(2)}
              </span>
              <span style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>/ KDV Dahil</span>
            </div>
          </div>

          {/* CMS Destekli Açıklama Alanı (Hardcoded Değil) */}
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2.5rem' }}>
            {product.description}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem', padding: '1.5rem', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ color: 'var(--success)' }}><CheckCircle2 size={24} /></div>
              <div>
                <strong style={{ display: 'block', color: 'var(--text)' }}>Stokta Var</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Aynı gün kargoya teslim</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ color: 'var(--primary)' }}><Zap size={24} /></div>
              <div>
                <strong style={{ display: 'block', color: 'var(--text)' }}>Endüstriyel Güç</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Profesyonel kullanım standartlarında</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ color: 'var(--secondary)' }}><ShieldCheck size={24} /></div>
              <div>
                <strong style={{ display: 'block', color: 'var(--text)' }}>%100 Orijinal</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Maxifit güvencesiyle adınıza faturalı</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            {/* Adet Seçici */}
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', width: '140px' }}>
              <button onClick={decreaseQuantity} style={{ padding: '1rem', color: 'var(--text)', background: 'rgba(0,0,0,0.02)' }} title="Azalt">
                <Minus size={18} />
              </button>
              <div style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>
                {quantity}
              </div>
              <button onClick={() => setQuantity(quantity + 1)} style={{ padding: '1rem', color: 'var(--text)', background: 'rgba(0,0,0,0.02)' }} title="Artır">
                <Plus size={18} />
              </button>
            </div>
            
            <button className="btn btn-primary" style={{ flex: 1, padding: '1rem', fontSize: '1.1rem' }} onClick={() => alert(`${product.name} (${quantity} adet) sepete eklendi!`)}>
              <ShoppingCart size={20} /> Sepete Ekle
            </button>
          </div>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Toplu siparişler için bayi girişi yapınız.
          </p>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
