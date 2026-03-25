import React, { createContext, useState, useEffect, useContext } from 'react';

const ProductContext = createContext();

const defaultProducts = [
  {
    id: '1',
    name: 'Maxifit Pas Sökücü Sprey',
    description: 'Etkili formülü ile paslanmış yüzeyleri anında çözer. Günlük bakım ve onarım işlerini hızlandırır.',
    price: 150,
    image: 'https://images.unsplash.com/photo-1621217734125-97818aaab9c3?auto=format&fit=crop&q=80&w=800',
    category: 'Sprey',
  },
  {
    id: '2',
    name: 'Maxifit Motor Temizleme Sıvısı',
    description: 'Motor bloklarındaki inatçı yağ ve kiri saniyeler içinde temizler. Yüksek performanslı teknolojik sıvı.',
    price: 280,
    image: 'https://images.unsplash.com/photo-1595185966453-3bdf73950fb2?auto=format&fit=crop&q=80&w=800',
    category: 'Sıvı',
  },
  {
    id: '3',
    name: 'Maxifit Yağlayıcı Bakım Spreyi',
    description: 'Sürtünmeyi azaltır, mekanik parçaların ömrünü uzatır. Araç bakımında maksimum verimlilik sağlar. Üstün Maxifit kalitesi.',
    price: 130,
    image: 'https://images.unsplash.com/photo-1580274455054-080c94627253?auto=format&fit=crop&q=80&w=800',
    category: 'Sprey',
  }
];

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const storedProducts = localStorage.getItem('maxifit_products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(defaultProducts);
      localStorage.setItem('maxifit_products', JSON.stringify(defaultProducts));
    }
  }, []);

  const addProduct = (product) => {
    const newProducts = [...products, { ...product, id: Date.now().toString() }];
    setProducts(newProducts);
    localStorage.setItem('maxifit_products', JSON.stringify(newProducts));
  };

  const updateProduct = (id, updatedProduct) => {
    const newProducts = products.map(p => p.id === id ? { ...p, ...updatedProduct } : p);
    setProducts(newProducts);
    localStorage.setItem('maxifit_products', JSON.stringify(newProducts));
  };

  const deleteProduct = (id) => {
    const newProducts = products.filter(p => p.id !== id);
    setProducts(newProducts);
    localStorage.setItem('maxifit_products', JSON.stringify(newProducts));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
