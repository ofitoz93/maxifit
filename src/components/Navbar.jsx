import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, User, LogOut, ShoppingCart, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path ? { color: 'var(--primary)', fontWeight: 600 } : { color: 'var(--text)' };
  };

  const navLinks = [
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Kurumsal', path: '/corporate' },
    { name: 'Ürünler', path: '/catalog' },
    { name: 'Bayilik', path: '/dealership' },
    { name: 'Fason Üretim', path: '/fason' },
    { name: 'e-Katalog', path: '/e-katalog' },
    { name: 'İletişim', path: '/contact' }
  ];

  return (
    <header className="glass" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0, padding: '0.5rem 0', background: 'rgba(255, 255, 255, 0.95)', borderBottom: '1px solid var(--border)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="Maxifit Logo" style={{ height: '80px', objectFit: 'contain', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }} />
        </Link>
        
        {/* Masaüstü Menü */}
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', '@media(maxWidth: 1024px)': { display: 'none' } }} className="desktop-nav">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} style={{ fontWeight: 500, fontSize: '0.95rem', ...isActive(link.path) }} className="nav-link">
              {link.name}
            </Link>
          ))}
          
          {user?.role === 'admin' && (
            <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--warning)', fontWeight: 600, fontSize: '0.95rem' }}>
              <Shield size={16} /> Admin
            </Link>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginLeft: '0.5rem', paddingLeft: '1.5rem', borderLeft: '1px solid var(--border)' }}>
            <Link to="/catalog" style={{ position: 'relative', color: 'var(--text)' }}>
              <ShoppingCart size={22} />
              <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--primary)', color: 'white', fontSize: '0.65rem', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>0</span>
            </Link>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className="badge" style={{ fontSize: '0.7rem' }}>
                  {user.role === 'admin' ? 'Yönetici' : 'Bayi'}
                </span>
                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                  <LogOut size={14} /> Çıkış
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
                <User size={16} /> Bayi Girişi
              </Link>
            )}
          </div>
        </nav>
      </div>
      
      {/* Mobile nav CSS */}
      <style>{`
        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
