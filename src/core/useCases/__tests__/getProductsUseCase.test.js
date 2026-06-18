import { getProductsUseCase } from '../getProductsUseCase';
import { itxApiAdapter } from '../../../infrastructure/api/itxApiAdapter';
import { localStorageAdapter } from '../../../infrastructure/storage/localStorageAdapter';

jest.mock('../../../infrastructure/api/itxApiAdapter');
jest.mock('../../../infrastructure/storage/localStorageAdapter');

describe('getProductsUseCase - Sistema de Caché', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Debe retornar los datos desde la caché si no ha expirado y NO llamar a la API', async () => {
    const mockProducts = [{ id: '1', brand: 'Acer', model: 'Iconia' }];
    
    localStorageAdapter.get.mockReturnValue(mockProducts);

    const result = await getProductsUseCase();

    expect(result).toEqual(mockProducts);
    expect(localStorageAdapter.get).toHaveBeenCalledWith('itx_products_list');

    expect(itxApiAdapter.getProducts).not.toHaveBeenCalled();
  });

  test('Debe llamar a la API y refrescar la caché si el almacenamiento local está vacío o expirado', async () => {
    const mockApiProducts = [{ id: '2', brand: 'Apple', model: 'iPhone' }];
    
    localStorageAdapter.get.mockReturnValue(null);
    itxApiAdapter.getProducts.mockResolvedValue(mockApiProducts);

    const result = await getProductsUseCase();

    expect(result).toEqual(mockApiProducts);
    expect(itxApiAdapter.getProducts).toHaveBeenCalledTimes(1);

    expect(localStorageAdapter.set).toHaveBeenCalledWith('itx_products_list', mockApiProducts);
  });
});