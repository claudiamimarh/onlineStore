import { describe, test, expect, beforeEach, vi } from 'vitest';
import { itxApiAdapter } from '../itxApiAdapter';

const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

describe('itxApiAdapter', () => {
  beforeEach(() => {
    fetchMock.mockClear();
  });

  describe('getProducts', () => {
    test('Debe retornar la lista de productos si la respuesta es OK', async () => {
      const mockData = [{ id: '1', brand: 'Samsung' }];
      
      // Se simula una respuesta exitosa (ok: true) que resuelve el JSON
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await itxApiAdapter.getProducts();

      expect(fetchMock).toHaveBeenCalledWith('https://itx-frontend-test.onrender.com/api/product');
      expect(result).toEqual(mockData);
    });

    test('Debe lanzar un error si la respuesta NO es OK', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(itxApiAdapter.getProducts()).rejects.toThrow(
        'Error al obtener productos: 500'
      );
    });
  });

  describe('getProductDetail', () => {
    test('Debe retornar el detalle del producto por ID si la respuesta es OK', async () => {
      const mockDetail = { id: '123', model: 'Galaxy S23' };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDetail,
      });

      const result = await itxApiAdapter.getProductDetail('123');

      expect(fetchMock).toHaveBeenCalledWith('https://itx-frontend-test.onrender.com/api/product/123');
      expect(result).toEqual(mockDetail);
    });

    test('Debe lanzar un error si la respuesta NO es OK al buscar detalle', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(itxApiAdapter.getProductDetail('123')).rejects.toThrow(
        'Error al obtener detalle del producto 123: 404'
      );
    });
  });

  describe('addProductToCart', () => {
    test('Debe enviar los datos correctamente mediante POST y retornar el resultado', async () => {
      const mockCartResponse = { count: 1 };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCartResponse,
      });

      const result = await itxApiAdapter.addProductToCart('prod_1', 'color_A', 'stor_B');

      expect(fetchMock).toHaveBeenCalledWith('https://itx-frontend-test.onrender.com/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: 'prod_1',
          colorCode: 'color_A',
          storageCode: 'stor_B',
        }),
      });
      expect(result).toEqual(mockCartResponse);
    });

    test('Debe lanzar un error si el POST al carrito falla', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      await expect(
        itxApiAdapter.addProductToCart('prod_1', 'color_A', 'stor_B')
      ).rejects.toThrow('Error al añadir producto al carrito: 400');
    });
  });
});