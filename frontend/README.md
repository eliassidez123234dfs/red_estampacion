# Frontend - React + Vite

Frontend moderno para RED Estampación usando React con Vite.

## Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Iniciar servidor de desarrollo:**
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:5173`

## Estructura

```
src/
├── components/
│   ├── admin/               # Componentes para administrador
│   │   ├── ProductForm.jsx      # Crear/editar productos (US#10)
│   │   ├── ImageUpload.jsx      # Subir imágenes (US#11)
│   │   ├── VariantManager.jsx   # Gestionar variantes (US#12)
│   │   └── ProductList.jsx      # Listar/filtrar (US#16)
│   └── client/              # Componentes para cliente
│       ├── Catalog.jsx          # Vista de catálogo
│       └── ProductDetail.jsx    # Detalle de producto
├── services/
│   ├── api.js              # Configuración de axios
│   └── productService.js   # Servicios para productos
├── App.jsx                 # Componente principal
└── main.jsx               # Punto de entrada
```

## Features Implementados

### User Story #10: Crear Producto
- ✅ Nombre único, requerido, máx 100 caracteres
- ✅ Descripción máx 500 caracteres
- ✅ Precio base > 0 con máx 2 decimales
- ✅ Validación de configuración mínima

### User Story #11: Subir Imágenes
- ✅ Formato JPG/PNG
- ✅ Tamaño máximo 2MB
- ✅ Resolución mínima 400x400 píxeles
- ✅ Máximo 5 imágenes por producto
- ✅ Imagen principal marcable

### User Story #12: Variantes
- ✅ Combinaciones únicas (talla + color)
- ✅ Stock >= 0
- ✅ Máximo 4 tallas y 10 colores

### User Story #16: Búsqueda y Filtrado
- ✅ Búsqueda parcial insensible a mayúsculas
- ✅ Filtros combinables (estado, aprobación, precio)
- ✅ Paginación (20 por página)
- ✅ Ordenamiento por múltiples criterios

## Rutas Principales

```
/                    - Catálogo de productos (cliente)
/producto/:id        - Detalle de producto
/admin              - Panel de administración
/admin/crear        - Crear nuevo producto
/admin/editar/:id   - Editar producto
```

## Conexión Backend

El frontend se conecta automáticamente a:
```
http://127.0.0.1:8000/api
```

Para cambiar la URL, editar en `src/services/api.js`

## Build para Producción

```bash
npm run build
```

Genera la carpeta `dist/` lista para desplegar.

## Dependencias

- **React 18.2** - Library UI
- **Vite 5.0** - Build tool
- **Axios 1.6** - HTTP client
- **React Router 6** - Routing (opcional)
- **Bootstrap 5** (opcional) - Estilos

## Estilos

- CSS puro con SCSS para modulación
- Responsive design mobile-first
- Tema de color: Crimson Red (#DC143C)
