/**
 * Adaptador para gestionar el almacenamiento local con TTL (Time-To-Live)
 */
const ONE_HOUR_IN_MS = 3600000; // 1 hora en milisegundos 

export const localStorageAdapter = {
  /**
   * Guarda un elemento en el storage junto con la fecha actual
   */
  set: (key, value) => {
    const item = {
      data: value,
      timestamp: Date.now() 
    };
    localStorage.setItem(key, JSON.stringify(item));
  },

  /**
   * Recupera un elemento si existe y no ha expirado 
   */
  get: (key) => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    try {
      const { data, timestamp } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > ONE_HOUR_IN_MS;

      if (isExpired) {
        localStorage.removeItem(key);
        return null;
      }

      return data;
    } catch (error) {
      return error; 
    }
  },

  /**
   * Elimina un elemento específico
   */
  remove: (key) => {
    localStorage.removeItem(key);
  }
};