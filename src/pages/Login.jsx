import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserCircle, AlertCircle } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Kullanıcı adı ve şifre zorunludur.');
      return;
    }
    
    // Login check
    const success = login(username, password);
    if (success) {
      navigate(username === 'admin' ? '/admin' : '/catalog');
    } else {
      setError('Hatalı kullanıcı adı veya şifre.');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', width: '100vw', margin: '-40px 0 0 -50vw', position: 'relative', left: '50%', right: '50%' }}>
      {/* Sol Taraf - Görsel */}
      <div style={{ 
        flex: 1, 
        backgroundImage: 'url("https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1920")', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        position: 'relative',
        display: 'none',
        '@media (minWidth: 768px)': { display: 'block' }
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to right, rgba(15,23,42,0.8), rgba(15,23,42,0.2))' }}></div>
        <div style={{ position: 'absolute', bottom: '10%', left: '10%', color: 'white', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', color: 'white' }}>Maxifit Bayi Ağı.</h2>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)' }}>Bayilerimize özel %30 indirimli fiyatlara ulaşmak için giriş yapın.</p>
        </div>
      </div>

      {/* Sağ Taraf - Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)', padding: '2rem' }}>
         <div style={{ width: '100%', maxWidth: '450px' }}>
           <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
             <img src="/logo.png" alt="Maxifit Logo" style={{ height: '70px', marginBottom: '1.5rem', objectFit: 'contain' }} />
             <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Sisteme Giriş</h1>
             <p style={{ color: 'var(--text-muted)' }}>Bayi veya Yönetici hesabınızla giriş yapınız.</p>
           </div>
           
           {error && (
             <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
               <AlertCircle size={20} /> {error}
             </div>
           )}

           <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
             <div className="input-group" style={{ marginBottom: 0 }}>
               <label>Kullanıcı Adı</label>
               <input 
                 type="text" 
                 value={username} 
                 onChange={(e) => setUsername(e.target.value)} 
                 className="input-field" 
                 placeholder="admin veya bayi123" 
               />
             </div>
             <div className="input-group" style={{ marginBottom: 0 }}>
               <label>Şifre</label>
               <input 
                 type="password" 
                 value={password} 
                 onChange={(e) => setPassword(e.target.value)} 
                 className="input-field" 
                 placeholder="••••••••" 
               />
             </div>
             
             <button type="submit" className="btn btn-primary" style={{ padding: '1rem', marginTop: '1rem', fontSize: '1.1rem' }}>
               <LogIn size={18} /> Giriş Yap
             </button>
           </form>

           <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: '#f8fafc', border: '1px dashed var(--border)', borderRadius: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
             <strong style={{ color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
               <UserCircle size={16} /> Demo Hesaplar:
             </strong>
             <ul style={{ listStyle: 'none', padding: 0 }}>
               <li style={{ padding: '0.25rem 0' }}>Yönetici: <code>admin</code> / <code>admin</code></li>
               <li style={{ padding: '0.25rem 0' }}>Sıradan Bayi: <code>bayi</code> / <code>bayi</code></li>
             </ul>
           </div>
         </div>
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .animate-fade-in > div:first-child { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Login;
