import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, User, LogOut, Package } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="glass" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0, padding: '1rem 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '8px' }}>
            <Package size={24} color="white" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '1px' }}>MAXIFIT</span>
        </Link>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/" style={{ fontWeight: 500 }} className="nav-link">Ana Sayfa</Link>
          <Link to="/catalog" style={{ fontWeight: 500 }} className="nav-link">Ürünler</Link>
          
          {user?.role === 'admin' && (
            <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)' }}>
              <Shield size={18} /> Admin
            </Link>
          )}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                {user.role === 'admin' ? 'Yönetici' : 'Bayi'}
              </span>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>
                <LogOut size={16} /> Çıkış
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              <User size={16} /> Giriş Yap
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
