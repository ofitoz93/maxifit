import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Loader, ArrowLeft, CheckCircle2, ShoppingCart, ShieldCheck, Zap, Plus, Minus, Download, Send } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const { products, loading } = useProduct();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('https://via.placeholder.com/400x500?text=Kutu+Sprey');
  const [images, setImages] = useState([]);

  // Form states
  const [quoteForm, setQuoteForm] = useState({ name: '', phone: '', quantity: 1, message: '' });
  const [submittingQuote, setSubmittingQuote] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);

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

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setSubmittingQuote(true);
    setQuoteSuccess(false);
    
    const { error } = await supabase.from('quote_requests').insert([{
      product_id: product.id,
      name: quoteForm.name,
      phone: quoteForm.phone,
      quantity: quoteForm.quantity,
      message: quoteForm.message
    }]);

    setSubmittingQuote(false);
    
    if (error) {
      console.error(error);
      alert('Teklif istenirken hata oluştu.');
    } else {
      setQuoteForm({ name: '', phone: '', quantity: 1, message: '' });
      setQuoteSuccess(true);
      setTimeout(() => setQuoteSuccess(false), 5000);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0 6rem' }}>
      <Link to="/catalog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '2rem', fontWeight: 500 }}>
        <ArrowLeft size={18} /> Tüm Ürünlere Dön
      </Link>

      <div className="glass-card" style={{ display: 'flex', flexWrap: 'wrap', overflow: 'hidden', padding: 0, border: '1px solid var(--border)' }}>
        {/* Sol Taraf: Görsel Galerisi */}
        <div style={{ flex: '1.5 1 500px', background: '#ffffff', padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid var(--border)', position: 'relative' }}>
          {user?.role === 'dealer' && (
            <span className="badge badge-discount" style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10, fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
              %30 Bayi İndirimi
            </span>
          )}
          
          {/* Main Active Image */}
          <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '3rem', minHeight: '600px' }}>
            <img 
              src={activeImage} 
              alt={product.name} 
              style={{ maxHeight: '750px', maxWidth: '100%', objectFit: 'contain', filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.15))', transition: 'all 0.3s ease' }}
              key={activeImage} // force re-animation
              className="animate-fade-in"
            />
          </div>

          {/* Multiple Image Thumbnails */}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem', width: '100%', justifyContent: 'center', marginTop: 'auto' }}>
              {images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  style={{ 
                    width: '85px', height: '85px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0,
                    border: activeImage === img ? '2px solid var(--primary)' : '1px solid var(--border)',
                    opacity: activeImage === img ? 1 : 0.6,
                    padding: '6px', background: 'white', transition: 'var(--transition)'
                  }}
                >
                  <img src={img} alt={`Thumb ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sağ Taraf: Ürün Detayları */}
        <div style={{ flex: '1 1 450px', padding: '4rem', display: 'flex', flexDirection: 'column', background: '#fafbfc' }}>
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

          {/* Açıklama ve Ambalaj Detayları */}
          <div style={{ marginBottom: '2.5rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
              {product.description}
            </p>
            
            {(product.volume || product.piece_count) && (
              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text)', fontWeight: 600 }}>Ambalaj Çeşitleri</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {product.volume && (
                    <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Ürün Hacmi:</span>
                      <strong style={{ color: 'var(--text)' }}>{product.volume}</strong>
                    </li>
                  )}
                  {product.piece_count && (
                    <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: product.msds_url ? '1px solid var(--border)' : 'none' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Kutu İçi Adet:</span>
                      <strong style={{ color: 'var(--text)' }}>{product.piece_count} Adet / Parça</strong>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {product.msds_url && (
              <a href={product.msds_url} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }}>
                <Download size={18} /> Kullanıcı Güvenlik Bilgi Formu (MSDS) İndir
              </a>
            )}
          </div>

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
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '3rem' }}>
            Toplu siparişler için bayi girişi yapınız.
          </p>

          {/* Teklif İste Formu */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', fontWeight: 600 }}>Teklif İste</h3>
            {quoteSuccess && (
              <div style={{ background: 'var(--success)', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={20} /> Teklif talebiniz başarıyla alındı. En kısa sürede dönüş yapılacaktır.
              </div>
            )}
            <form onSubmit={handleQuoteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="input-group">
                <input type="text" placeholder="Adınız Soyadınız" required className="input-field" value={quoteForm.name} onChange={e => setQuoteForm({...quoteForm, name: e.target.value})} />
              </div>
              <div className="input-group">
                <input type="tel" placeholder="Telefon Numaranız" required className="input-field" value={quoteForm.phone} onChange={e => setQuoteForm({...quoteForm, phone: e.target.value})} />
              </div>
              <div className="input-group">
                <input type="number" placeholder="Talep Edilen Adet" min="1" required className="input-field" value={quoteForm.quantity} onChange={e => setQuoteForm({...quoteForm, quantity: parseInt(e.target.value) || 1})} />
              </div>
              <div className="input-group">
                <textarea placeholder="Mesajınız (Opsiyonel)" rows="3" className="input-field" value={quoteForm.message} onChange={e => setQuoteForm({...quoteForm, message: e.target.value})}></textarea>
              </div>
              <button type="submit" className="btn btn-primary" disabled={submittingQuote} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }}>
                {submittingQuote ? <Loader className="spin" size={18} /> : <Send size={18} />} Şipariş / Teklif İste
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Benzer Ürünler */}
      {products.filter(p => p.id !== product.id && p.category === product.category).length > 0 && (
        <div style={{ marginTop: '5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center', fontWeight: 'bold' }}>Benzer Ürünler</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4).map(similar => {
              let simImg = 'https://via.placeholder.com/280x280?text=Görsel+Yok';
              if (similar.image) {
                try {
                  const imgs = JSON.parse(similar.image);
                  simImg = Array.isArray(imgs) && imgs.length > 0 ? imgs[0] : (typeof imgs === 'string' ? imgs : simImg);
                } catch { simImg = similar.image; }
              }
              const sPrice = user?.role === 'dealer' ? Number(similar.price) * 0.7 : Number(similar.price);
              
              return (
                <Link to={`/product/${similar.id}`} key={similar.id} className="catalog-card" style={{ display: 'block', textDecoration: 'none' }}>
                  <div className="card-image" style={{ height: '280px', background: '#fff', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--border)' }}>
                    <img src={simImg} alt={similar.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                  </div>
                  <div className="card-content" style={{ padding: '1.5rem', background: '#fff' }}>
                    <span className="badge" style={{ marginBottom: '1rem', background: '#f1f5f9', color: 'var(--text-muted)', fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}>{similar.category}</span>
                    <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text)', fontWeight: 'bold' }}>{similar.name}</h3>
                    <div className="card-price" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>₺{sPrice.toFixed(2)}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
