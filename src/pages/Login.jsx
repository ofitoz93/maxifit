import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User } from 'lucide-react';

const Login = () => {
  const [role, setRole] = useState('dealer');
  const { user, login } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/catalog'} />;
  }

  const handleLogin = (e) => {
    e.preventDefault();
    login(role);
    navigate(role === 'admin' ? '/admin' : '/catalog');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', background: 'rgba(255, 75, 43, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem', color: 'var(--primary)' }}>
            <Lock size={32} />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Sisteme Giriş</h2>
          <p style={{ color: 'var(--text-muted)' }}>Şifresiz simülasyon girişi</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Giriş Türü</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="button"
                className={`btn ${role === 'dealer' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1, padding: '0.75rem' }}
                onClick={() => setRole('dealer')}
              >
                Bayi
              </button>
              <button
                type="button"
                className={`btn ${role === 'admin' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1, padding: '0.75rem' }}
                onClick={() => setRole('admin')}
              >
                Admin (Yönetici)
              </button>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', fontSize: '0.875rem', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            <strong>Bilgi:</strong> Bu ekran sadece projenin akışını simüle etmek amaçlıdır. {role === 'dealer' ? "Bayi olarak girdiğinizde fiyatlar %30 indirimli yansır." : "Admin olarak girdiğinizde ürün yönetimi sayfasına erişebilirsiniz."}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
            <User size={18} /> Oturum Aç
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
