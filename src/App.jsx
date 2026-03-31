import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Corporate from './pages/Corporate';
import Dealership from './pages/Dealership';
import ContractManufacturing from './pages/ContractManufacturing';
import EKatalog from './pages/EKatalog';
import Contact from './pages/Contact';

import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { ContentProvider } from './context/ContentContext';

function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <ProductProvider>
          <Router>
            <div className="page-wrapper">
              <Navbar />
              <main className="container animate-fade-in" style={{ flex: 1, paddingBottom: '3rem' }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/corporate" element={<Corporate />} />
                  <Route path="/dealership" element={<Dealership />} />
                  <Route path="/fason" element={<ContractManufacturing />} />
                  <Route path="/e-katalog" element={<EKatalog />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </ProductProvider>
      </ContentProvider>
    </AuthProvider>
  );
}

export default App;
