import { itxApiAdapter } from '../../infrastructure/api/itxApiAdapter';

/**
 * Caso de uso para añadir un producto al carrito
 * @param {string} productId 
 * @param {string} colorCode 
 * @param {string} storageCode 
 * @returns {Promise<{count: number}>} Respuesta con el nuevo contador
 */
export const addProductToCartUseCase = async (productId, colorCode, storageCode) => {
  if (!productId || !colorCode || !storageCode) {
    throw new Error('Todos los campos (id, color y almacenamiento) son obligatorios.');
  }
  
  console.log(`Enviando POST al API de carrito para el producto: ${productId}`);
  return await itxApiAdapter.addProductToCart(productId, colorCode, storageCode);
};