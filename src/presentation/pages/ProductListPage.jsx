import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductsUseCase } from '../../core/useCases/getProductsUseCase';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import './ProductListPage.css';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProductsUseCase();
        setProducts(data);
      } catch (err) {
        setError('No se pudieron cargar los dispositivos móviles.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtrado en tiempo real por Marca y Modelo (Case Insensitive)
  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    const brandMatch = product.brand?.toLowerCase().includes(searchLower);
    const modelMatch = product.model?.toLowerCase().includes(searchLower);
    return brandMatch || modelMatch;
  });

  if (loading) return <div className="product-list__center">Cargando catálogo...</div>;
  if (error) return <div className="product-list__center">{error}</div>;

  return (
    <div>
      <Header />
      <main className="product-list">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        
        <div className="product-list__grid-container">
          <div className="product-list__grid">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="product-list__card"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img 
                  src={product.imgUrl} 
                  alt={`${product.brand} ${product.model}`} 
                  className="product-list__image" 
                />
                <h3 className="product-list__brand">{product.brand}</h3>
                <p className="product-list__model">{product.model}</p>
                <p className="product-list__price">
                  {product.price ? `${product.price} €` : 'No disponible'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 && (
          <p className="product-list__no-results">No se encontraron dispositivos que coincidan con la búsqueda.</p>
        )}
      </main>
    </div>
  );
};

export default ProductListPage;