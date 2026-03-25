import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProduct } from '../context/ProductContext';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProduct();
  
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', image: '', category: 'Sprey' });
  const [isAdding, setIsAdding] = useState(false);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setFormData(product);
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ name: '', description: '', price: '', image: '', category: 'Sprey' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: parseFloat(formData.price) || 0
    };

    if (editingId) {
      updateProduct(editingId, productData);
    } else {
      addProduct(productData);
    }
    cancelEdit();
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({ name: '', description: '', price: '', image: '', category: 'Sprey' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem' }}>Yönetim Paneli</h1>
          <p style={{ color: 'var(--text-muted)' }}>Ürün kataloğunu yönetin</p>
        </div>
        {!isAdding && !editingId && (
          <button onClick={handleAddNew} className="btn btn-primary">
            <Plus size={18} /> Yeni Ürün Ekle
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem', marginBottom: '3rem', border: '1px solid var(--primary)' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div className="input-group" style={{ flex: '1 1 300px' }}>
                <label>Ürün Adı</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" required />
              </div>
              <div className="input-group" style={{ flex: '1 1 150px' }}>
                <label>Kategori</label>
                <select name="category" value={formData.category} onChange={handleChange} className="input-field" required>
                  <option value="Sprey">Sprey</option>
                  <option value="Sıvı">Sıvı</option>
                  <option value="Aksesuar">Aksesuar</option>
                  <option value="Alet">Alet</option>
                </select>
              </div>
              <div className="input-group" style={{ flex: '1 1 150px' }}>
                <label>Fiyat (₺)</label>
                <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="input-field" required />
              </div>
            </div>
            
            <div className="input-group">
              <label>Görsel URL (Örn: https://.../image.jpg)</label>
              <input type="url" name="image" value={formData.image} onChange={handleChange} className="input-field" required placeholder="https://unsplash.com/..." />
            </div>

            <div className="input-group">
              <label>Ürün Açıklaması</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="input-field" rows="4" required></textarea>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary">
                <Save size={18} /> Kaydet
              </button>
              <button type="button" onClick={cancelEdit} className="btn btn-outline">
                <X size={18} /> İptal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card table-wrapper">
        <table className="catalog-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Görsel</th>
              <th>Ürün Adı</th>
              <th>Kategori</th>
              <th>Fiyat</th>
              <th style={{ textAlign: 'right' }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>
                  <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover' }} />
                </td>
                <td style={{ fontWeight: 500 }}>{product.name}</td>
                <td>{product.category}</td>
                <td>₺{Number(product.price).toFixed(2)}</td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button onClick={() => handleEditClick(product)} className="btn btn-outline" style={{ padding: '0.4rem' }} title="Düzenle">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => { if(window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) deleteProduct(product.id) }} className="btn btn-danger" style={{ padding: '0.4rem' }} title="Sil">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Henüz ürün eklenmemiş.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
