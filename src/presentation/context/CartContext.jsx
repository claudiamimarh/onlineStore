import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

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

  const updateCartCount = (count) => {
    setCartCount(count);
  };

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado para consumir el contexto fácilmente
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser utilizado dentro de un CartProvider');
  }
  return context;
};