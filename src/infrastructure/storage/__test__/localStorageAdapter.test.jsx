import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { localStorageAdapter } from '../localStorageAdapter';

describe('localStorageAdapter', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('set', () => {
    test('Debe guardar el valor y la marca de tiempo actual en localStorage', () => {
      // Se fija una fecha específica 
      const mockTimestamp = 1000000;
      vi.setSystemTime(mockTimestamp);

      localStorageAdapter.set('test_key', { name: 'React' });

      const storedValue = localStorage.getItem('test_key');
      expect(storedValue).toBeDefined();
      
      const parsed = JSON.parse(storedValue);
      expect(parsed.data).toEqual({ name: 'React' });
      expect(parsed.timestamp).toBe(mockTimestamp);
    });
  });

  describe('get', () => {
    test('Debe retornar null si la clave no existe en localStorage', () => {
      const result = localStorageAdapter.get('non_existent_key');
      expect(result).toBeNull();
    });

    test('Debe retornar los datos si existen y no han expirado (menos de 1 hora)', () => {
      const baseTime = 1000000;
      vi.setSystemTime(baseTime);

      localStorageAdapter.set('test_key', 'mi_data');

      // Se adelanta el tiempo 30 minutos (1,800,000 ms) -> No ha expirado
      vi.advanceTimersByTime(1800000);

      const result = localStorageAdapter.get('test_key');
      expect(result).toBe('mi_data');
    });

    test('Debe eliminar el item y retornar null si ya expiró (más de 1 hora)', () => {
      const baseTime = 1000000;
      vi.setSystemTime(baseTime);

      localStorageAdapter.set('test_key', 'mi_data');

      // Se adelanta el tiempo 1 hora y 1 segundo (3,600,001 ms) -> Ya expiró
      vi.advanceTimersByTime(3600001);

      const result = localStorageAdapter.get('test_key');
      
      expect(result).toBeNull();
      // Se verifica que se haya limpiado del storage
      expect(localStorage.getItem('test_key')).toBeNull();
    });

    test('Debe retornar el error si el JSON guardado es inválido y no se puede parsear', () => {
      localStorage.setItem('bad_key', 'not-a-json-string{[');

      const result = localStorageAdapter.get('bad_key');
      
      expect(result).toBeInstanceOf(SyntaxError);
    });
  });

  describe('remove', () => {
    test('Debe eliminar correctamente un elemento del localStorage', () => {
      localStorage.setItem('remove_key', 'valor');
      
      localStorageAdapter.remove('remove_key');
      
      expect(localStorage.getItem('remove_key')).toBeNull();
    });
  });
});