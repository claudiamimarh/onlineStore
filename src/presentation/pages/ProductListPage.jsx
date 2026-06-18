import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductsUseCase } from '../../core/useCases/getProductsUseCase';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';

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

  if (loading) return <div style={styles.center}>Cargando catálogo...</div>;
  if (error) return <div style={styles.center}>{error}</div>;

  return (
    <div>
      <Header />
      <main style={styles.container}>
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        
        <div style={styles.gridContainer}>
          <div style={styles.grid}>
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                style={styles.card}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img 
                  src={product.imgUrl} 
                  alt={`${product.brand} ${product.model}`} 
                  style={styles.image} 
                />
                <h3 style={styles.brand}>{product.brand}</h3>
                <p style={styles.model}>{product.model}</p>
                <p style={styles.price}>
                  {product.price ? `${product.price} €` : 'No disponible'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 && (
          <p style={styles.noResults}>No se encontraron dispositivos que coincidan con la búsqueda.</p>
        )}
      </main>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px 30px',
    fontFamily: 'sans-serif'
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
    fontFamily: 'sans-serif'
  },
  gridContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%'
  },
  grid: {
    display: 'grid',
    width: '100%',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px',
    maxWidth: '1000px', 
    margin: '0 auto'
  },
  card: {
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    padding: '15px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    backgroundColor: '#fff'
  },
  image: {
    maxHeight: '160px',
    objectFit: 'contain',
    marginBottom: '15px',
    maxWidth: '100%'
  },
  brand: {
    fontSize: '16px',
    margin: '5px 0',
    textTransform: 'uppercase',
    color: '#495057'
  },
  model: {
    fontSize: '14px',
    margin: '5px 0',
    color: '#6c757d'
  },
  price: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#212529',
    marginTop: '10px'
  },
  noResults: {
    textAlign: 'center',
    color: '#6c757d',
    marginTop: '40px'
  }
};

export default ProductListPage;