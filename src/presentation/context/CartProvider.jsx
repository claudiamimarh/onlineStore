import React, { useState, useEffect } from 'react';
import { CartContext } from './CartContext';

export const CartProvider = ({ children }) => {
  // Se inicializa el estado leyendo de localStorage para persistir el dato al recargar
  const [cartCount, setCartCount] = useState(() => {
    const savedCount = localStorage.getItem('itx_cart_count');
    return savedCount ? parseInt(savedCount, 10) : 0;
  });

  // Cada vez que cambie el contador, se guarda en localStorage
  useEffect(() => {
    localStorage.setItem('itx_cart_count', cartCount.toString());
  }, [cartCount]);

  const updateCartCount = (countOrFn) => {
    setCartCount(prev => {
        const nextCount = typeof countOrFn === 'function' ? countOrFn(prev) : countOrFn;
        return nextCount;
    });
  };

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
};