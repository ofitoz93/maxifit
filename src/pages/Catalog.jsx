import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { Grid, List } from 'lucide-react';

const Catalog = () => {
  const { products } = useProduct();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState('grid');

  const getPrice = (basePrice) => {
    if (user?.role === 'dealer') {
      return (basePrice * 0.7).toFixed(2);
    }
    return basePrice.toFixed(2);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Ürün Kataloğu</h1>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem', borderRadius: '8px' }}>
          <button 
            onClick={() => setViewMode('grid')}
            style={{ padding: '0.5rem', borderRadius: '6px', background: viewMode === 'grid' ? 'var(--primary)' : 'transparent', color: viewMode === 'grid' ? 'white' : 'var(--text-muted)' }}
          >
            <Grid size={20} />
          </button>
          <button 
            onClick={() => setViewMode('table')}
            style={{ padding: '0.5rem', borderRadius: '6px', background: viewMode === 'table' ? 'var(--primary)' : 'transparent', color: viewMode === 'table' ? 'white' : 'var(--text-muted)' }}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {user?.role === 'dealer' && (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', color: 'var(--success)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontWeight: 600 }}>Bayi Girişi Aktif:</span> Tüm ürünleri %30 indirimli fiyatlarla görüntülüyorsunuz.
        </div>
      )}

      {viewMode === 'grid' ? (
        <div className="grid-catalog">
          {products.map(product => (
            <div key={product.id} className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                  {product.category}
                </div>
              </div>
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{product.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem', flex: 1 }}>
                  {product.description.substring(0, 100)}...
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {user?.role === 'dealer' && (
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                        ₺{product.price.toFixed(2)}
                      </span>
                    )}
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                      ₺{getPrice(product.price)}
                    </span>
                  </div>
                  <Link to={`/product/${product.id}`} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
                    İncele
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card table-wrapper">
          <table className="catalog-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Görsel</th>
                <th>Ürün Adı</th>
                <th>Kategori</th>
                <th>Fiyat</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    <img src={product.image} alt={product.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                  </td>
                  <td style={{ fontWeight: 500 }}>{product.name}</td>
                  <td>{product.category}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {user?.role === 'dealer' && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                          ₺{product.price.toFixed(2)}
                        </span>
                      )}
                      <span style={{ fontWeight: 600, color: 'var(--primary)' }}>₺{getPrice(product.price)}</span>
                    </div>
                  </td>
                  <td>
                    <Link to={`/product/${product.id}`} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>
                      İncele
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Sistemde henüz ürün bulunmamaktadır.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Catalog;
