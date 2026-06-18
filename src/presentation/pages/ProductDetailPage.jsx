import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductDetailUseCase } from '../../core/useCases/getProductDetailUseCase';
import { useCart } from '../context/UseCart';
import { addProductToCartUseCase } from '../../core/useCases/addProductToCartUseCase';
import Header from '../components/Header';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { updateCartCount } = useCart(); 
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const [selectedStorage, setSelectedStorage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', isError: false });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await getProductDetailUseCase(id);
        setProduct(data);

        if (data.options?.storages?.length > 0) {
          setSelectedStorage(data.options.storages[0].code);
        }
        if (data.options?.colors?.length > 0) {
          setSelectedColor(data.options.colors[0].code);
        }
      } catch (err) {
        setError('No se pudo cargar la información detallada del dispositivo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      const result = await addProductToCartUseCase(product.id, selectedColor, selectedStorage);

      updateCartCount(prevCount => prevCount + (result.count || 1));
      
      setModalConfig({
        title: '¡Operación Exitosa!',
        message: `El dispositivo ${product.brand} ${product.model} fue añadido correctamente a tu cesta de compras.`,
        isError: false
      });
      setShowModal(true);

    } catch (err) {
      console.error(err);
      setModalConfig({
        title: 'Hubo un problema',
        message: 'No pudimos procesar la solicitud para añadir este producto. Por favor, inténtalo de nuevo.',
        isError: true
      });
      setShowModal(true);
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) return <div style={styles.center}>Cargando especificaciones...</div>;
  if (error) return <div style={styles.center}>{error}</div>;
  if (!product) return null;

  return (
    <div>
      <Header currentProductModel={product ? `${product.brand} ${product.model}` : ''} />
      <main style={styles.container}>
        <Link to="/" style={styles.backLink}>← Volver a la lista de productos</Link>

        <div style={styles.twoColumns}>
          <div style={styles.columnImage}>
            <img src={product.imgUrl} alt={`${product.brand} ${product.model}`} style={styles.image} />
          </div>

          <div style={styles.columnInfo}>
            <section style={styles.descriptionSection}>
              <h2 style={styles.title}>{product.brand} {product.model}</h2>
              <p style={styles.price}>Precio: {product.price ? `${product.price} €` : 'No disponible'}</p>
              
              <h4 style={styles.sectionTitle}>Especificaciones Técnicas:</h4>
              <ul style={styles.list}>
                <li><strong>CPU:</strong> {product.cpu || 'N/D'}</li>
                <li><strong>RAM:</strong> {product.ram || 'N/D'}</li>
                <li><strong>Sistema Operativo:</strong> {product.os || 'N/D'}</li>
                <li><strong>Resolución de pantalla:</strong> {product.displayResolution || 'N/D'}</li>
                <li><strong>Batería:</strong> {product.battery || 'N/D'}</li>
                <li><strong>Cámaras:</strong> {product.primaryCamera || 'N/D'} / {product.secondaryCamera || 'N/D'}</li>
                <li><strong>Dimensiones:</strong> {product.dimentions || 'N/D'}</li>
                <li><strong>Peso:</strong> {product.weight ? `${product.weight} g` : 'N/D'}</li>
              </ul>
            </section>

            <hr style={styles.divider} />

            <section style={styles.actionsSection}>
              <h4 style={styles.sectionTitle}>Personaliza tu dispositivo:</h4>
              
              <div style={styles.selectorGroup}>
                <label style={styles.label}>Almacenamiento:</label>
                <select value={selectedStorage} onChange={(e) => setSelectedStorage(e.target.value)} style={styles.select}>
                  {product.options?.storages?.map((storage) => (
                    <option key={storage.code} value={storage.code}>{storage.name}</option>
                  ))}
                </select>
              </div>

              <div style={styles.selectorGroup}>
                <label style={styles.label}>Color:</label>
                <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} style={styles.select}>
                  {product.options?.colors?.map((color) => (
                    <option key={color.code} value={color.code}>{color.name}</option>
                  ))}
                </select>
              </div>

              <button 
                onClick={handleAddToCart} 
                style={{
                  ...styles.button,
                  backgroundColor: isAdding ? '#6c757d' : '#0d6efd',
                  cursor: isAdding ? 'not-allowed' : 'pointer'
                }}
                disabled={isAdding || !product.price}
              >
                {isAdding ? 'Añadiendo...' : 'Añadir a la cesta'}
              </button>
            </section>
          </div>
        </div>
      </main>

      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ 
              ...styles.modalTitle, 
              color: modalConfig.isError ? '#dc3545' : '#198754' 
            }}>
              {modalConfig.title}
            </h3>
            <p style={styles.modalText}>{modalConfig.message}</p>
            <button 
              style={{
                ...styles.modalButton,
                backgroundColor: modalConfig.isError ? '#dc3545' : '#198754'
              }} 
              onClick={() => setShowModal(false)}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px 30px',
    fontFamily: 'sans-serif',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
    fontFamily: 'sans-serif'
  },
  backLink: {
    display: 'inline-block',
    marginBottom: '20px',
    color: '#0d6efd',
    textDecoration: 'none',
    fontWeight: '500'
  },
  twoColumns: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '40px',
    marginTop: '10px'
  },
  columnImage: {
    flex: '1 1 350px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e9ecef'
  },
  image: {
    maxWidth: '100%',
    maxHeight: '400px',
    objectFit: 'contain'
  },
  columnInfo: {
    flex: '2 1 500px',
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '8px',
    border: '1px solid #e9ecef'
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '28px',
    color: '#212529'
  },
  price: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#198754',
    margin: '0 0 20px 0'
  },
  sectionTitle: {
    margin: '15px 0 10px 0',
    fontSize: '16px',
    color: '#495057'
  },
  list: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    lineHeight: '2'
  },
  divider: {
    border: '0',
    borderTop: '1px solid #dee2e6',
    margin: '25px 0'
  },
  selectorGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '15px'
  },
  label: {
    width: '120px',
    fontWeight: '500',
    color: '#495057',
    fontSize: '14px'
  },
  select: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ced4da',
    minWidth: '150px',
    outline: 'none',
    fontSize: '14px'
  },
  button: {
    marginTop: '15px',
    padding: '12px 24px',
    backgroundColor: '#0d6efd',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    maxWidth: '300px',
    transition: 'background-color 0.2s'
  },
  
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    maxWidth: '450px',
    width: '90%',
    textAlign: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    fontFamily: 'sans-serif'
  },
  modalTitle: {
    margin: '0 0 15px 0',
    fontSize: '22px',
    fontWeight: 'bold'
  },
  modalText: {
    fontSize: '15px',
    color: '#495057',
    lineHeight: '1.5',
    marginBottom: '25px'
  },
  modalButton: {
    padding: '10px 25px',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'opacity 0.2s'
  }
};

export default ProductDetailPage;