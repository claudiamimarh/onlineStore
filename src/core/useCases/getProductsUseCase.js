import { itxApiAdapter } from '../../infrastructure/api/itxApiAdapter';
import { localStorageAdapter } from '../../infrastructure/storage/localStorageAdapter';

const CACHE_KEY_PRODUCTS = 'itx_products_list';

/**
 * Caso de uso para obtener los productos
 */
export const getProductsUseCase = async () => {
  
  const cachedProducts = localStorageAdapter.get(CACHE_KEY_PRODUCTS);
  
  if (cachedProducts) {
    console.log('Listado de productos desde la caché.');
    return cachedProducts; 
  }

  console.log('La caché expiró o no existe. Solicitando datos al servidor remoto...');
  const products = await itxApiAdapter.getProducts();

  localStorageAdapter.set(CACHE_KEY_PRODUCTS, products);

  return products;
};