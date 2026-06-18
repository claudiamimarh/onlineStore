import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductListPage from '../ProductListPage';
import { getProductsUseCase } from '../../../core/useCases/getProductsUseCase';
import { CartProvider } from '../../context/CartProvider';

jest.mock('../../../core/useCases/getProductsUseCase');

const mockProducts = [
  { id: '1', brand: 'Samsung', model: 'Galaxy S23', price: '900', imgUrl: null },
  { id: '2', brand: 'Apple', model: 'iPhone 14', price: '1000', imgUrl: null },
  { id: '3', brand: 'Xiaomi', model: 'Redmi Note', price: '300', imgUrl: null }
];

const renderWithRouter = (ui) => {
  return render(
    <CartProvider>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </CartProvider>
  );
};

describe('<ProductListPage /> - Filtrado en tiempo real', () => {
  beforeEach(async () => {
    getProductsUseCase.mockResolvedValue(mockProducts);
  });

  test('Debe renderizar la lista completa de dispositivos moviles inicialmente', async () => {
    await act(async () => {
      renderWithRouter(<ProductListPage />);
    });

    expect(screen.getByText('Samsung')).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Xiaomi')).toBeInTheDocument();
  });

  test('Debe filtrar los productos de la grilla cuando el usuario escribe una marca o modelo', async () => {
    await act(async () => {
      renderWithRouter(<ProductListPage />);
    });

    const searchInput = screen.getByPlaceholderText('Buscar por marca o modelo...');
    
    fireEvent.change(searchInput, { target: { value: 'iphone' } });

    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('iPhone 14')).toBeInTheDocument();

    expect(screen.queryByText('Samsung')).not.toBeInTheDocument();
    expect(screen.queryByText('Xiaomi')).not.toBeInTheDocument();
  });
});