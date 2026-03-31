import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const addProduct = async (product) => {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select();
      
    if (error) {
      console.error('Error adding product:', error);
      alert('Ürün eklenirken hata oluştu.');
    } else if (data) {
      setProducts([data[0], ...products]);
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    const { data, error } = await supabase
      .from('products')
      .update(updatedProduct)
      .eq('id', id)
      .select();
      
    if (error) {
      console.error('Error updating product:', error);
      alert('Ürün güncellenirken hata oluştu.');
    } else if (data) {
      setProducts(products.map(p => p.id === id ? data[0] : p));
    }
  };

  const deleteProduct = async (id) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting product:', error);
      alert('Ürün silinirken hata oluştu.');
    } else {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, loading, fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
