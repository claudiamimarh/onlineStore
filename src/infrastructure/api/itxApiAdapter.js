const BASE_URL = 'https://itx-frontend-test.onrender.com';

export const itxApiAdapter = {
  /**
   * Obtiene la lista de todos los productos
   * GET /api/product
   */
  getProducts: async () => {
    const response = await fetch(`${BASE_URL}/api/product`);
    if (!response.ok) {
      throw new Error(`Error al obtener productos: ${response.status}`);
    }
    return await response.json();
  },

  /**
   * Obtiene los detalles de un producto específico por ID
   * GET /api/product/:id
   */
  getProductDetail: async (id) => {
    const response = await fetch(`${BASE_URL}/api/product/${id}`);
    if (!response.ok) {
      throw new Error(`Error al obtener detalle del producto ${id}: ${response.status}`);
    }
    return await response.json();
  },

  /**
   * Añade un producto al carrito 
   * POST /api/cart
   */
  addProductToCart: async (productId, colorCode, storageCode) => {
    const response = await fetch(`${BASE_URL}/api/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: productId,
        colorCode,
        storageCode
      }) 
    });

    if (!response.ok) {
      throw new Error(`Error al añadir producto al carrito: ${response.status}`);
    }
    return await response.json();
  }
};