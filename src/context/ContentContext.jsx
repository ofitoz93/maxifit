import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const ContentContext = createContext();

// Varsayılan site metinleri (Veritabanında yoksa veya silinirse hata vermemesi için)
const defaultContent = {
  homeHeroTitle: 'Araç Bakımında\nProfesyonel Spreyler',
  homeHeroSub: 'Motor içinden fren balatasına kadar otomobilinizin ihtiyaç duyduğu endüstriyel çözümler ve en yeni sprey teknolojileri ile tanışın.',
  corpTitle: 'Hakkımızda',
  corpDesc: 'Maxifit, otomotiv bakım sektöründe uzun yıllara dayanan tecrübesiyle müşterilerine yüksek teknoloji ürünleri sunan öncü bir markadır. Özellikle sanayi tipi sprey ve sıvı kimyasallar alanındaki Ar-Ge çalışmalarımızla sektörün ihtiyaçlarını, profesyonellerin beklentilerini karşılıyoruz. Amacımız sadece satmak değil, işinizi kolaylaştıran kesin çözümler üretmektir.',
  dealerTitle: 'Neden Maxifit Bayisi Olmalısınız?',
  dealerDesc: 'Maxifit markalı oto kozmetik ve endüstriyel bakım ürünlerini müşterilerinize sunarak yüksek kar marjı ve %100 müşteri memnuniyeti sağlarsınız. Üst düzey sipariş platformumuz ile tüm stoklarınıza bayi fiyatlarıyla hızla ulaşabilirsiniz.',
  fasonTitle: 'Tesisimiz ve Kapasitemiz',
  fasonDesc: 'Kendi spreylerinizi, araç bakım ürünlerinizi veya sanayi kimyasallarınızı kendi markanızla (Private Label) üretmek ister misiniz? Modern dolum tesislerimizde aylık 500.000 adet sprey aerozül dolum kapasitesi ile markanıza özel formüllerde ve tasarımlarda fason üretim yapmaktayız.',
  footerText: 'Maxifit Automotive - Premium Sprey Çözümleri',
  contactAddress: 'Otomotiv Organize Sanayi Bölgesi No: 45A, İstanbul / Türkiye',
  contactPhone: '+90 (850) 123 45 67',
  contactEmail: 'info@maxifit.com.tr'
};

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('site_content').select('*');
      
      if (error) {
        if(error.code !== '42P01') { // 42P01: Table doesn't exist yet
           console.error('Error fetching content:', error);
        }
        return; 
      }
      
      if (data && data.length > 0) {
        const dbContent = {};
        data.forEach(item => {
          dbContent[item.id] = item.content.value;
        });
        
        // Merge db contents with defaults so missing keys fall back
        setContent(prev => ({...prev, ...dbContent}));
      }
    } catch (err) {
      console.error('Content fetch block error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (updatedData) => {
    try {
      // Prepare bulk upsert
      const upsertData = Object.keys(updatedData).map(key => ({
        id: key,
        content: { value: updatedData[key] },
        updated_at: new Date()
      }));

      // In Supabase, upserting an array might be easiest but requires exact schema matching.
      // We process them in a simple loop or a single rpc / upsert call.
      const { error } = await supabase.from('site_content').upsert(upsertData);
      
      if (error) throw error;
      
      setContent(prev => ({...prev, ...updatedData}));
      return true;
    } catch (error) {
      console.error('Update content error:', error);
      alert('İçerik güncellenirken bir hata oluştu. Veritabanı kurulumunuzu (site_content tablosu) kontrol edin.');
      return false;
    }
  };

  return (
    <ContentContext.Provider value={{ content, loading, updateContent }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => useContext(ContentContext);
