import React from 'react';

const Footer = () => {
  return (
    <footer style={{ marginTop: 'auto', padding: '2rem 0', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)' }}>
      <div className="container" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>&copy; {new Date().getFullYear()} Maxifit. Yeni nesil bakım ürünleri. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
};

export default Footer;
