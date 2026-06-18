import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProductListPage from '../pages/ProductListPage';
import ProductDetailPage from '../pages/ProductDetailPage';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Vista principal - Listado de productos */}
        <Route path="/" element={<ProductListPage />} />
        
        {/* Detalles del producto */}
        <Route path="/product/:id" element={<ProductDetailPage />} />
        
        {/* Redirección por defecto si la ruta no existe */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;