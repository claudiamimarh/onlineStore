import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/UseCart';
import './Header.css';

const Header = ({ currentProductModel }) => {
  const { cartCount } = useCart();
  const location = useLocation();

  // Evaluamos si estamos en la ruta de detalle
  const isDetailPage = location.pathname.startsWith('/product/');

  return (
    <header className="header">
      <div className="header__nav-container">
        <Link to="/" className="header__logo">
          📱 DeviceStore
        </Link>
        
        {/* Breadcrumbs Dinámico */}
        <nav className="header__breadcrumbs">
          <Link to="/" className="header__breadcrumb-link">Inicio</Link>
          {isDetailPage && (
            <>
              <span className="header__separator"> › </span>
              <span className="header__current-path">
                {currentProductModel || 'Cargando...'}
              </span>
            </>
          )}
        </nav>
      </div>

      <div className="header__cart-container">
        <span className="header__cart-icon">🛒</span>
        <span className="header__cart-badge">{cartCount}</span>
      </div>
    </header>
  );
};

export default Header;