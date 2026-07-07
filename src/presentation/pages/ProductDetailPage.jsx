import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductDetailUseCase } from '../../core/useCases/getProductDetailUseCase';
import { useCart } from '../context/UseCart';
import { addProductToCartUseCase } from '../../core/useCases/addProductToCartUseCase';
import Header from '../components/Header';
import './ProductDetailPage.css';

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

  if (loading) return <div className="product-detail__center">Cargando especificaciones...</div>;
  if (error) return <div className="product-detail__center">{error}</div>;
  if (!product) return null;

  return (
    <div>
      <Header currentProductModel={product ? `${product.brand} ${product.model}` : ''} />
      <main className="product-detail">
        <Link to="/" className="product-detail__back-link">← Volver a la lista de productos</Link>

        <div className="product-detail__two-columns">
          <div className="product-detail__column-image">
            <img src={product.imgUrl} alt={`${product.brand} ${product.model}`} className="product-detail__image" />
          </div>

          <div className="product-detail__column-info">
            <section>
              <h2 className="product-detail__title">{product.brand} {product.model}</h2>
              <p className="product-detail__price">Precio: {product.price ? `${product.price} €` : 'No disponible'}</p>
              
              <h4 className="product-detail__section-title">Especificaciones Técnicas:</h4>
              <ul className="product-detail__list">
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

            <hr className="product-detail__divider" />

            <section>
              <h4 className="product-detail__section-title">Personaliza tu dispositivo:</h4>
              
              <div className="product-detail__selector-group">
                <label className="product-detail__label">Almacenamiento:</label>
                <select value={selectedStorage} onChange={(e) => setSelectedStorage(e.target.value)} className="product-detail__select">
                  {product.options?.storages?.map((storage) => (
                    <option key={storage.code} value={storage.code}>{storage.name}</option>
                  ))}
                </select>
              </div>

              <div className="product-detail__selector-group">
                <label className="product-detail__label">Color:</label>
                <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} className="product-detail__select">
                  {product.options?.colors?.map((color) => (
                    <option key={color.code} value={color.code}>{color.name}</option>
                  ))}
                </select>
              </div>

              <button 
                onClick={handleAddToCart} 
                className={`product-detail__button ${isAdding ? 'product-detail__button--loading' : ''}`}
                disabled={isAdding || !product.price}
              >
                {isAdding ? 'Añadiendo...' : 'Añadir a la cesta'}
              </button>
            </section>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className={`modal-content__title ${modalConfig.isError ? 'modal-content__title--error' : 'modal-content__title--success'}`}>
              {modalConfig.title}
            </h3>
            <p className="modal-content__text">{modalConfig.message}</p>
            <button 
              className={`modal-content__button ${modalConfig.isError ? 'modal-content__button--error' : 'modal-content__button--success'}`} 
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

export default ProductDetailPage;