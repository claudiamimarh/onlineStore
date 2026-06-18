import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Header = ({ currentProductModel }) => {
  const { cartCount } = useCart();
  const location = useLocation();

  // Evaluamos si estamos en la ruta de detalle
  const isDetailPage = location.pathname.startsWith('/product/');

  return (
    <header style={styles.header}>
      <div style={styles.navContainer}>
        <Link to="/" style={styles.logo}>
          📱 DeviceStore
        </Link>
        
        {/* Breadcrumbs Dinámico */}
        <nav style={styles.breadcrumbs}>
          <Link to="/" style={styles.breadcrumbLink}>Inicio</Link>
          {isDetailPage && (
            <>
              <span style={styles.separator}> › </span>
              <span style={styles.currentPath}>
                {currentProductModel || 'Cargando...'}
              </span>
            </>
          )}
        </nav>
      </div>

      <div style={styles.cartContainer}>
        <span style={styles.cartIcon}>🛒</span>
        <span style={styles.cartBadge}>{cartCount}</span>
      </div>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #e9ecef',
    fontFamily: 'sans-serif'
  },
  navContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
    textDecoration: 'none',
    color: '#212529'
  },
  breadcrumbs: {
    fontSize: '14px',
    color: '#6c757d'
  },
  breadcrumbLink: {
    textDecoration: 'none',
    color: '#0d6efd'
  },
  cartContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    position: 'relative'
  },
  cartIcon: {
    fontSize: '22px'
  },
  cartBadge: {
    backgroundColor: '#dc3545',
    color: 'white',
    borderRadius: '50%',
    padding: '2px 8px',
    fontSize: '12px',
    fontWeight: 'bold'
  }
};

export default Header;