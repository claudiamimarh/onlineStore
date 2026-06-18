module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx'],
  
  // 1. Inyecta TextEncoder ANTES de que se monte el entorno
  setupFiles: ['<rootDir>/jest.setup.js'],
  
  // 2. Carga los matchers personalizados DESPUÉS de que el entorno (expect) esté listo
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
};