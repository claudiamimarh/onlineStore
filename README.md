# ITX - Front-End E-Commerce Device Store

Este proyecto es una Single Page Application (SPA) desarrollada en React que permite explorar un catálogo de dispositivos móviles, ver sus detalles y agregarlos a un carrito de compras. La solución ha sido diseñada bajo principios de **Clean Architecture** y **SOLID**, garantizando un código mantenible, escalable y altamente desacoplado del framework.

## Arquitectura y Decisiones de Diseño

Para demostrar buenas prácticas de ingeniería de software, se implementó una variante de **Arquitectura Hexagonal / Clean Architecture** adaptada al ecosistema Frontend. El proyecto se divide en tres capas principales:

1. **Core / Domain & Use Cases (Capa de Negocio):** Contiene las entidades puras de JavaScript (Modelos) y las reglas de negocio (Casos de Uso), tales como la obtención de productos, filtrado y la gestión de la expiración de la caché.
2. **Infrastructure (Capa de Adaptadores Exteriores):** Contiene los adaptadores para comunicarse con servicios externos. Aquí se implementan el cliente HTTP para consumir la API y el mecanismo de almacenamiento en caché (`localStorage`).
3. **Presentation (Capa de UI / Framework):** Compuesta por los componentes de React, contextos globales, enrutador y vistas. Su única responsabilidad es la interfaz y reaccionar a las interacciones del usuario invocando los Casos de Uso del Core.

### Estructura de Carpetas

src/
├── core/                  # Lógica de negocio pura
│   ├── useCases/          # Reglas de negocio
├── infrastructure/        # Implementaciones y herramientas externas
│   ├── api/               # Cliente HTTP / Peticiones fetch a la API
│   └── storage/           # Implementación de caché
└── presentation/          # Capa de Interfaz de Usuario
    ├── components/        # Componentes compartidos y atómicos 
    ├── pages/             # Vistas principales: ProductList y ProductDetail 
    ├── routes/            # Configuración de rutas (React Router Dom)
    └── context/           # Estado global de la aplicación 

#### Estrategia de Optimización y Caché (TTL 1 Hora)
Para cumplir con el requerimiento de optimización de red, se diseñó un servicio de almacenamiento intermedio (CacheStorage) en la capa de infraestructura.

Mecanismo: Cada respuesta exitosa de la API se almacena en el localStorage junto con un Timestamp (marca de tiempo).

Validación: Al solicitar datos (lista o detalle), el caso de uso verifica si el registro existe y calcula la diferencia de tiempo. Si la diferencia es menor a 1 hora (3,600,000 ms), los datos se recuperan instantáneamente de la memoria local, evitando peticiones HTTP innecesarias. En caso de expirar o no existir, se realiza la petición de red y se refresca la caché.

Tecnologías Utilizadas
    React (JavaScript Moderno ES6) - Sin TypeScript por restricciones técnicas de la prueba.
    React Router Dom - Para la navegación e historial de la SPA.
    Vite - Como herramienta de construcción (Bundler) rápida y eficiente.
    Jest - Framework de pruebas unitarias.
    ESLint - Para garantizar la consistencia y calidad del código.

##### Instalación y Scripts Requeridos
Requisitos Previos
Node.js (versión 18 o superior recomendada)
npm 

Pasos para Ejecutar Localmente
Clonar el repositorio:
    git clone https://github.com/claudiamimarh/onlineStore.git
   
Instalar las dependencias:
    npm install

Ejecutar los comandos del ciclo de vida del desarrollo:
Iniciar en modo desarrollo:
  npm run start
Compilar la aplicación para producción:
  npm run build
Ejecutar la suite de pruebas unitarias:
  npm run test
Ejecutar el linter para análisis estático de código:
  npm run lint



# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
