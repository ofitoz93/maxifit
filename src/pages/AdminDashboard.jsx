import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProduct } from '../context/ProductContext';
import { useContent } from '../context/ContentContext';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2, Save, X, UploadCloud, Loader, Image as ImageIcon, FileText } from 'lucide-react';

const CATEGORIES = ["Tüm Ürünler", "Temizleme", "Endüstriyel", "Oto Kozmetik", "Yağlayıcı", "İnşaat", "Katkı", "Sprey Boya"];

const AdminDashboard = () => {
  const { user } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct, loading: productsLoading } = useProduct();
  const { content, updateContent, loading: contentLoading } = useContent();
  
  const [activeTab, setActiveTab] = useState('products');
  
  // Product state
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: 'Temizleme', volume: '', piece_count: '', msds_url: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [selectedMsdsFile, setSelectedMsdsFile] = useState(null);

  // CMS state
  const [cmsData, setCmsData] = useState({});
  const [cmsSaving, setCmsSaving] = useState(false);

  useEffect(() => {
    if (content) {
      setCmsData(content);
    }
  }, [content]);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  // --- CMS HANDLERS ---
  const handleCmsChange = (e) => {
    const { name, value } = e.target;
    setCmsData(prev => ({ ...prev, [name]: value }));
  };

  const handleCmsSubmit = async (e) => {
    e.preventDefault();
    setCmsSaving(true);
    await updateContent(cmsData);
    setCmsSaving(false);
    alert('Site içerikleri başarıyla güncellendi!');
  };


  // --- PRODUCT HANDLERS ---
  const handleEditClick = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || 'Temizleme',
      volume: product.volume || '',
      piece_count: product.piece_count || '',
      msds_url: product.msds_url || ''
    });
    
    // Parse existing images
    let images = [];
    if (product.image) {
      try {
        images = JSON.parse(product.image);
        if (!Array.isArray(images)) images = [product.image];
      } catch (err) {
        images = [product.image]; // It's a plain string URL from before
      }
    }
    setExistingImages(images);
    setIsAdding(false);
    setSelectedFiles([]);
    setSelectedMsdsFile(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ name: '', description: '', price: '', category: 'Temizleme', volume: '', piece_count: '', msds_url: '' });
    setSelectedFiles([]);
    setExistingImages([]);
    setSelectedMsdsFile(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // Convert FileList to Array
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleMsdsChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedMsdsFile(e.target.files[0]);
    }
  };

  const removeExistingImage = (idx) => {
    setExistingImages(prev => prev.filter((_, i) => i !== idx));
  };
  const removeSelectedFile = (idx) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const uploadImages = async (files) => {
    setUploading(true);
    const urls = [];
    
    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop().toLowerCase();
        
        // Ensure proper MIME type mapping regardless of OS/Browser file.type detection
        let mimeType = 'image/jpeg';
        if (fileExt === 'png') mimeType = 'image/png';
        else if (fileExt === 'webp') mimeType = 'image/webp';
        else if (fileExt === 'gif') mimeType = 'image/gif';
        else if (fileExt === 'svg') mimeType = 'image/svg+xml';

        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, {
            contentType: mimeType,
            cacheControl: '3600'
          });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        urls.push(data.publicUrl);
      }
      return urls;
    } catch (error) {
      console.error('Error uploading images: ', error);
      alert('Görseller yüklenirken hata oluştu!');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let finalImageUrls = [...existingImages];

    if (selectedFiles.length > 0) {
      const uploadedUrls = await uploadImages(selectedFiles);
      if (uploadedUrls) {
        finalImageUrls = [...finalImageUrls, ...uploadedUrls];
      } else {
        return; // Upload failed
      }
    }

    let finalMsdsUrl = formData.msds_url;
    if (selectedMsdsFile) {
      setUploading(true);
      try {
        const fileExt = selectedMsdsFile.name.split('.').pop();
        const fileName = `msds_${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, selectedMsdsFile, {
            contentType: selectedMsdsFile.type || 'application/pdf',
            cacheControl: '3600'
          });
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
        finalMsdsUrl = data.publicUrl;
      } catch (error) {
        console.error('Error uploading MSDS: ', error);
        alert('MSDS yüklenirken hata oluştu!');
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    const productData = {
      ...formData,
      image: JSON.stringify(finalImageUrls), // Store multi images as JSON string
      price: parseFloat(formData.price) || 0,
      piece_count: formData.piece_count ? parseInt(formData.piece_count) : null,
      msds_url: finalMsdsUrl
    };

    if (editingId) {
      await updateProduct(editingId, productData);
    } else {
      await addProduct(productData);
    }
    cancelEdit();
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({ name: '', description: '', price: '', category: 'Temizleme', volume: '', piece_count: '', msds_url: '' });
    setSelectedFiles([]);
    setExistingImages([]);
    setSelectedMsdsFile(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      
      {/* Header & Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem' }}>Site Yönetimi</h1>
          <p style={{ color: 'var(--text-muted)' }}>Mevcut ürünleri, çoklu görselleri ve site metinlerini yönetin</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', background: '#f1f5f9', padding: '0.5rem', borderRadius: '12px' }}>
          <button 
            onClick={() => setActiveTab('products')} 
            className={`btn ${activeTab === 'products' ? 'btn-primary' : ''}`}
            style={{ padding: '0.6rem 1.25rem', color: activeTab === 'products' ? '#fff' : 'var(--text-muted)' }}
          >
            <ImageIcon size={18} /> Ürün Yönetimi
          </button>
          <button 
            onClick={() => setActiveTab('content')} 
            className={`btn ${activeTab === 'content' ? 'btn-primary' : ''}`}
            style={{ padding: '0.6rem 1.25rem', color: activeTab === 'content' ? '#fff' : 'var(--text-muted)' }}
          >
            <FileText size={18} /> Site İçerikleri (CMS)
          </button>
        </div>
      </div>

      {/* PRODUCS TAB */}
      {activeTab === 'products' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
            {!isAdding && !editingId && (
              <button onClick={handleAddNew} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} /> Yeni Ürün
              </button>
            )}
          </div>

          {(isAdding || editingId) && (
            <div className="glass-card animate-fade-in" style={{ padding: '2rem', marginBottom: '3rem', border: '1px solid var(--primary)' }}>
              <h2 style={{ marginBottom: '1.5rem', fontWeight: '600' }}>{editingId ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h2>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                  <div className="input-group">
                    <label>Ürün Adı</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" required />
                  </div>
                  <div className="input-group">
                    <label>Kategori</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="input-field" required>
                      {CATEGORIES.filter(c => c !== 'Tüm Ürünler').map(cat => (
                        <option value={cat} key={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Fiyat (₺)</label>
                    <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="input-field" required />
                  </div>
                  <div className="input-group">
                    <label>Ürün Hacmi</label>
                    <input type="text" name="volume" value={formData.volume} onChange={handleChange} className="input-field" placeholder="Örn: 500ml, 5L" />
                  </div>
                  <div className="input-group">
                    <label>Kutu İçi Adet</label>
                    <input type="number" name="piece_count" value={formData.piece_count} onChange={handleChange} className="input-field" placeholder="Örn: 12" />
                  </div>
                  <div className="input-group">
                    <label>Güvenlik Bilgi Formu (MSDS Yükle)</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <label className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0, flex: 1, padding: '0.6rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        <UploadCloud size={16} /> 
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {selectedMsdsFile ? selectedMsdsFile.name : (formData.msds_url ? 'Yeni Form Seç' : 'Dosya Seç (.pdf, .doc)')}
                        </span>
                        <input type="file" accept=".pdf,.doc,.docx" onChange={handleMsdsChange} style={{ display: 'none' }} />
                      </label>
                      {(formData.msds_url || selectedMsdsFile) && (
                        <button type="button" onClick={() => { setSelectedMsdsFile(null); setFormData(prev => ({...prev, msds_url: ''})); }} className="btn btn-danger" style={{ padding: '0.6rem' }} title="Dosyayı Temizle">
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    {formData.msds_url && !selectedMsdsFile && <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--success)' }}>Mevcut yüklü bir form var.</div>}
                  </div>
                </div>
                
                <div className="input-group" style={{ marginTop: '1.5rem' }}>
                  <label>Ürün Görselleri (Çoklu Seçim Yapabilirsiniz)</label>
                  
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {/* Existing Images */}
                    {existingImages.map((imgUrl, idx) => (
                       <div key={idx} style={{ position: 'relative', width: '90px', height: '90px', border: idx === 0 ? '2px solid var(--primary)' : '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                          <img src={imgUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          {idx === 0 && <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'var(--primary)', color: 'white', fontSize: '0.6rem', textAlign: 'center', padding: '2px 0', fontWeight: 'bold' }}>KAPAK GÖRSELİ</span>}
                          {idx > 0 && <button type="button" onClick={() => { const arr = [...existingImages]; const item = arr.splice(idx, 1)[0]; arr.unshift(item); setExistingImages(arr); }} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', color: 'white', fontSize: '0.6rem', textAlign: 'center', padding: '4px 0', border: 'none', cursor: 'pointer', outline: 'none' }}>KAPAK YAP</button>}
                          <button type="button" onClick={() => removeExistingImage(idx)} style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(239, 68, 68, 0.9)', color: 'white', padding: '3px', border: 'none', cursor: 'pointer', borderRadius: '0 0 0 8px' }}>
                            <X size={14} />
                          </button>
                       </div>
                    ))}
                    {/* New Files Preview */}
                    {selectedFiles.map((file, idx) => (
                       <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', border: '1px dashed var(--primary)', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontSize: '0.7rem', padding: '0.5rem', textAlign: 'center', wordBreak: 'break-all' }}>
                          {file.name}
                          <button type="button" onClick={() => removeSelectedFile(idx)} style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(239, 68, 68, 0.9)', color: 'white', padding: '2px' }}>
                            <X size={14} />
                          </button>
                       </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <label className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0 }}>
                      <UploadCloud size={18} />
                      Yeni Fotoğraflar Seç (JPG/PNG)
                      <input type="file" multiple accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG,.webp" onChange={handleFileChange} style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>

                <div className="input-group" style={{ marginTop: '1.5rem' }}>
                  <label>Ürün Açıklaması</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} className="input-field" rows="4" required></textarea>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <button type="submit" className="btn btn-primary" disabled={uploading} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {uploading ? <Loader className="spin" size={18} /> : <Save size={18} />} 
                    {uploading ? 'Yükleniyor...' : 'Kaydet'}
                  </button>
                  <button type="button" onClick={cancelEdit} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <X size={18} /> İptal
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="glass-card table-wrapper" style={{ overflowX: 'auto' }}>
            {productsLoading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Loader className="spin" size={24} style={{ margin: 'auto' }} />
                <p style={{ marginTop: '1rem' }}>Ürünler yükleniyor...</p>
              </div>
            ) : (
              <table className="catalog-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(0, 0, 0, 0.03)', textAlign: 'left' }}>
                    <th style={{ padding: '1rem', width: '80px' }}>Görsel</th>
                    <th style={{ padding: '1rem' }}>Ürün Adı</th>
                    <th style={{ padding: '1rem' }}>Kategori</th>
                    <th style={{ padding: '1rem' }}>Fiyat</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => {
                    // Extract first image
                    let firstImg = 'https://via.placeholder.com/50';
                    if (product.image) {
                      try {
                        const imgs = JSON.parse(product.image);
                        if (Array.isArray(imgs) && imgs.length > 0) firstImg = imgs[0];
                        else if (typeof imgs === 'string') firstImg = imgs;
                      } catch {
                        firstImg = product.image;
                      }
                    }
                    return (
                      <tr key={product.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '1rem' }}>
                          <img src={firstImg} alt={product.name} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border)' }} />
                          {product.image && product.image.includes('[') && (
                            <span style={{ fontSize: '0.65rem', display: 'block', textAlign: 'center', marginTop: '2px', color: 'var(--text-muted)' }}>Çoklu</span>
                          )}
                        </td>
                        <td style={{ padding: '1rem', fontWeight: 600 }}>{product.name}</td>
                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{product.category}</td>
                        <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--primary)' }}>₺{Number(product.price).toFixed(2)}</td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <button onClick={() => handleEditClick(product)} className="btn btn-outline" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} title="Ürünü Düzenle">
                              <Edit2 size={14} /> Düzenle
                            </button>
                            <button onClick={() => { if(window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) deleteProduct(product.id) }} className="btn btn-danger" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} title="Ürünü Sil">
                              <Trash2 size={14} /> Sil
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            {!productsLoading && products.length === 0 && (
              <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Henüz ürün eklenmemiş. Lütfen yeni bir ürün ekleyin.
              </div>
            )}
          </div>
        </>
      )}

      {/* CMS TAB */}
      {activeTab === 'content' && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '0.5rem', fontWeight: '600' }}>Site Metinlerini Düzenle</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Bu alandan tüm sayfalardaki Hakkımızda, Başlıklar ve Açıklama yazılarını değiştirebilirsiniz.</p>
          
          {contentLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}><Loader className="spin" size={24} /></div>
          ) : (
            <form onSubmit={handleCmsSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '2rem' }}>
                
                {/* Ana Sayfa İçerikleri */}
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Ana Sayfa</h3>
                  <div className="input-group">
                    <label>Ana Reklam Başlığı</label>
                    <textarea name="homeHeroTitle" value={cmsData.homeHeroTitle || ''} onChange={handleCmsChange} className="input-field" rows="2" />
                  </div>
                  <div className="input-group">
                    <label>Ana Reklam Alt Metni</label>
                    <textarea name="homeHeroSub" value={cmsData.homeHeroSub || ''} onChange={handleCmsChange} className="input-field" rows="4" />
                  </div>
                </div>

                {/* Kurumsal İçerikleri */}
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Kurumsal (Hakkımızda)</h3>
                  <div className="input-group">
                    <label>Hakkımızda Başlığı</label>
                    <input type="text" name="corpTitle" value={cmsData.corpTitle || ''} onChange={handleCmsChange} className="input-field" />
                  </div>
                  <div className="input-group">
                    <label>Hakkımızda Uzun Metin</label>
                    <textarea name="corpDesc" value={cmsData.corpDesc || ''} onChange={handleCmsChange} className="input-field" rows="5" />
                  </div>
                </div>

                {/* Bayilik & Fason */}
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Bayilik Sayfası</h3>
                  <div className="input-group">
                    <label>Bayilik Başlığı</label>
                    <input type="text" name="dealerTitle" value={cmsData.dealerTitle || ''} onChange={handleCmsChange} className="input-field" />
                  </div>
                  <div className="input-group">
                    <label>Bayilik Açıklaması</label>
                    <textarea name="dealerDesc" value={cmsData.dealerDesc || ''} onChange={handleCmsChange} className="input-field" rows="4" />
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Fason Üretim</h3>
                  <div className="input-group">
                    <label>Fason Başlığı</label>
                    <input type="text" name="fasonTitle" value={cmsData.fasonTitle || ''} onChange={handleCmsChange} className="input-field" />
                  </div>
                  <div className="input-group">
                    <label>Fason Açıklaması</label>
                    <textarea name="fasonDesc" value={cmsData.fasonDesc || ''} onChange={handleCmsChange} className="input-field" rows="4" />
                  </div>
                </div>

                {/* İletişim Bilgileri */}
                <div style={{ gridColumn: '1 / -1', background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                  <div style={{ gridColumn: '1 / -1' }}><h3 style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>Alt Bilgi (Footer) ve İletişim</h3></div>
                  <div className="input-group">
                    <label>Telefon Numarası</label>
                    <input type="text" name="contactPhone" value={cmsData.contactPhone || ''} onChange={handleCmsChange} className="input-field" />
                  </div>
                  <div className="input-group">
                    <label>E-Posta</label>
                    <input type="text" name="contactEmail" value={cmsData.contactEmail || ''} onChange={handleCmsChange} className="input-field" />
                  </div>
                  <div className="input-group">
                    <label>Adres (İletişim Formu İçin)</label>
                    <textarea name="contactAddress" value={cmsData.contactAddress || ''} onChange={handleCmsChange} className="input-field" rows="2" />
                  </div>
                  <div className="input-group">
                    <label>Footer Marka Sloganı</label>
                    <input type="text" name="footerText" value={cmsData.footerText || ''} onChange={handleCmsChange} className="input-field" />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary" disabled={cmsSaving} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '1rem 3rem', fontSize: '1.1rem' }}>
                  {cmsSaving ? <Loader className="spin" size={20} /> : <Save size={20} />} 
                  {cmsSaving ? 'Kaydediliyor...' : 'Tüm Değişiklikleri Kaydet'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Mobil düzeltmeler */}
      <style>{`
        @media (max-width: 768px) {
           form > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
