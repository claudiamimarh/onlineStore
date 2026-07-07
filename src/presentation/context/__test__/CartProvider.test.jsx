import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useContext } from 'react';
import { CartProvider } from '../CartProvider';
import { CartContext } from '../CartContext';

const TestComponent = () => {
  const { cartCount, updateCartCount } = useContext(CartContext);

  return (
    <div>
      <span data-testid="cart-count">{cartCount}</span>
      
      {/* Botón para enviar un número directo */}
      <button data-testid="btn-direct-value" onClick={() => updateCartCount(10)}>
        Set Fijo a 10
      </button>

      {/* Botón para usar una función de actualización */}
      <button data-testid="btn-fn-increment" onClick={() => updateCartCount(prev => prev + 1)}>
        Incrementar +1
      </button>

      {/* Botón para usar una función que reste */}
      <button data-testid="btn-fn-decrement" onClick={() => updateCartCount(prev => prev - 1)}>
        Decrementar -1
      </button>
    </div>
  );
};

describe('<CartProvider /> - Pruebas Integrales de Estado y Persistencia', () => {
  
  beforeEach(() => {
    // Se limpia el localStorage antes de cada test para evitar contaminación de datos
    localStorage.clear();
    vi.clearAllMocks();
  });

  // ==========================================
  // 1. PRUEBAS DE INICIALIZACIÓN (CONSTRUCTOR / COMPORTAMIENTO INICIAL)
  // ==========================================
  describe('Inicialización del Estado', () => {
    test('Debe inicializar con valor 0 cuando localStorage está vacío', () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      const countElement = screen.getByTestId('cart-count');
      expect(countElement.textContent).toBe('0');
    });

    test('Debe leer correctamente el valor previo de localStorage y parsearlo a número', () => {
      // Se simula que el usuario ya tenía 5 productos agregados antes de recargar la página
      localStorage.setItem('itx_cart_count', '5');

      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      const countElement = screen.getByTestId('cart-count');
      expect(countElement.textContent).toBe('5');
    });
  });

  // ==========================================
  // 2. PRUEBAS DE LA FUNCIÓN updateCartCount
  // ==========================================
  describe('Método updateCartCount', () => {
    test('Debe reemplazar el estado directamente cuando se le pasa un valor numérico fijo', () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      fireEvent.click(screen.getByTestId('btn-direct-value'));

      expect(screen.getByTestId('cart-count').textContent).toBe('10');
    });

    test('Debe procesar correctamente funciones de actualización basadas en el estado anterior (prev)', () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      const incrementBtn = screen.getByTestId('btn-fn-increment');
      const decrementBtn = screen.getByTestId('btn-fn-decrement');

      // Comportamiento del incremento sucesivo
      fireEvent.click(incrementBtn); // 0 + 1 = 1
      fireEvent.click(incrementBtn); // 1 + 1 = 2
      expect(screen.getByTestId('cart-count').textContent).toBe('2');

      // Comportamiento del decremento
      fireEvent.click(decrementBtn); // 2 - 1 = 1
      expect(screen.getByTestId('cart-count').textContent).toBe('1');
    });
  });

  describe('Efectos Secundarios y Sincronización', () => {
    test('Debe actualizar el localStorage automáticamente cada vez que cambie cartCount', () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      // Al renderizar por primera vez, el useEffect debe asegurar que se guarda el '0' inicial
      expect(localStorage.getItem('itx_cart_count')).toBe('0');

      // Se modifica el estado a través de una acción del usuario
      fireEvent.click(screen.getByTestId('btn-direct-value')); // Setea a 10

      // El useEffect debió reaccionar al cambio de cartCount y actualizar el almacenamiento
      expect(localStorage.getItem('itx_cart_count')).toBe('10');
    });
  });
});