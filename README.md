# RED Estampación

Plataforma web para gestión y venta de productos personalizables con estampación 3D.

## 📁 Estructura del Proyecto

```
red_estampacion/
├── index.html                 # Página principal
├── admin/                     # Panel de administración
├── assets/
│   ├── img/                   # Imágenes generales (logo)
│   ├── img_camisas/          # Imágenes de productos (7 fotos)
│   └── js/
│       └── mockData.js        # Datos mock (20 productos, variantes, categorías)
├── estilos/
│   └── main.css              # Estilos globales
└── modulos/
    ├── gestion_productos/     # Módulo Admin - CRUD productos (RF-001 a RF-022)
    │   ├── index.html
    │   ├── css/gestion.css
    │   └── js/gestion.js
    ├── catalogo/              # Módulo Cliente - Navegación productos (RF-023 a RF-037)
    │   ├── index.html
    │   ├── css/catalogo.css
    │   └── js/catalogo.js
    └── productos/             # Módulo Cliente - Detalle producto (RF-038 a RF-050)
        ├── index.html
        ├── css/productos.css
        └── js/productos.js
```

## 🚀 Funcionalidades Implementadas

### 1. Gestión de Productos (Admin)
- ✅ Crear, editar, eliminar productos
- ✅ Gestionar variantes (tallas, colores, stock, precios)
- ✅ Subir y gestionar imágenes
- ✅ Aprobar/desaprobar productos
- ✅ Filtros avanzados (búsqueda, precio, estado)
- ✅ Validación de formularios

### 2. Catálogo de Productos (Cliente)
- ✅ Grid responsive de productos (12 por página)
- ✅ Filtros dinámicos (categorías, precio, colores, tallas, stock)
- ✅ Búsqueda en tiempo real
- ✅ Ordenamiento (fecha, nombre, precio)
- ✅ Paginación con navegación (← 1 2 3 ... →)
- ✅ Navegación a detalle del producto

### 3. Detalle de Producto (Cliente)
- ✅ Galería de imágenes con zoom
- ✅ Selección de variantes (talla + color)
- ✅ Actualización dinámica de precio y stock
- ✅ Control de cantidad con validación
- ✅ Agregar al carrito
- ✅ Productos relacionados (misma categoría)

## 🗂️ Datos Mock

### Productos
- **Total:** 20 productos de ejemplo
- **Categorías:** 5 categorías (Básicas, Premium, Deportivas, Streetwear, Elegantes)
- **Precios:** Rango de $22,000 a $55,000 COP
- **Estado:** Todos activos y aprobados

### Variantes
- **Tallas:** S, M, L, XL (2-3 por producto)
- **Colores:** 8 colores disponibles (Blanco, Negro, Rojo, Azul, Verde, Amarillo, Rosa, Gris)
- **Stock:** Aleatorio entre 5 y 55 unidades

### Imágenes
- **Ubicación:** `assets/img_camisas/`
- **Cantidad:** 7 imágenes reales de productos
- **Uso:** Rotación entre los 20 productos (3 imágenes por producto)

## 🎨 Diseño

- **Color primario:** #DC143C (Crimson Red)
- **Tipografía:** Arial, sans-serif
- **Responsive:** Desktop, Tablet, Mobile
- **Framework:** Vanilla JavaScript (ES6+)
- **Almacenamiento:** localStorage

## 💾 LocalStorage

El sistema utiliza localStorage para persistir:
- `productos_red` - Lista de productos
- `variantes_red` - Variantes de productos (talla, color, stock)
- `imagenes_red` - Rutas de imágenes de productos
- `categorias_red` - Categorías de productos
- `carrito_red` - Items en el carrito de compras

## 🔄 Inicialización

Al cargar cualquier módulo por primera vez, el sistema detecta si localStorage está vacío y automáticamente:
1. Crea 5 categorías
2. Genera 20 productos
3. Crea variantes para cada producto
4. Asocia imágenes a productos
5. Inicializa carrito vacío

## 🌐 Navegación

```
Inicio (index.html)
├── Catálogo → Ver productos → Detalle producto → Agregar al carrito
├── Mi Carrito → Gestionar compras
└── Admin → Gestión de Productos → CRUD completo
```

## 📝 Notas Técnicas

- **Sin backend:** Todo funciona en cliente con localStorage
- **Imágenes:** Las 7 fotos se rotan entre los 20 productos
- **Paginación:** 12 productos por página en catálogo
- **Auto-reinit:** Si localStorage está vacío, se reinicializa automáticamente
