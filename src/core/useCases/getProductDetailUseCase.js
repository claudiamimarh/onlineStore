import { itxApiAdapter } from '../../infrastructure/api/itxApiAdapter';
import { localStorageAdapter } from '../../infrastructure/storage/localStorageAdapter';

const CACHE_KEY_PREFIX = 'itx_product_detail_';

/**
 * Caso de uso para obtener los detalles de un producto
 */
export const getProductDetailUseCase = async (productId) => {
  const cacheKey = `${CACHE_KEY_PREFIX}${productId}`;
  
  const cachedDetail = localStorageAdapter.get(cacheKey);
  if (cachedDetail) {
    console.log(`Obteniendo detalle del producto ${productId} desde la caché local.`);
    return cachedDetail;
  }

  console.log(`Obteniendo detalle del producto ${productId} al servidor remoto...`);
  const productDetail = await itxApiAdapter.getProductDetail(productId);

  localStorageAdapter.set(cacheKey, productDetail);

  return productDetail;
};