# Backend - Django REST API

API REST de RED Estampación implementada con Django Rest Framework.

## Configuración

### Requisitos
- Python 3.8+
- MySQL 5.7+
- pip

### Instalación

1. **Crear el entorno virtual:**
```bash
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

2. **Instalar dependencias:**
```bash
pip install -r requirements.txt
```

3. **Configurar variables de entorno:**
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales de MySQL:
```
DB_NAME=red_estampacion
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_HOST=127.0.0.1
```

4. **Crear base de datos MySQL:**
```bash
mysql -u root -p
CREATE DATABASE red_estampacion CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

5. **Realizar migraciones:**
```bash
python manage.py migrate
```

6. **Crear superusuario (admin):**
```bash
python manage.py createsuperuser
```

7. **Iniciar servidor:**
```bash
python manage.py runserver
```

El servidor estará disponible en `http://127.0.0.1:8000/`

---

## APIs Endpoints

### Base URL
```
http://localhost:8000/api
```

### Productos

#### Listar productos (con filtros y búsqueda - US#16)
```
GET /api/productos/

Query Parameters:
  - search=nombre_parcial      # Búsqueda por nombre (case-insensitive)
  - ordering=nombre            # Ordenar por: nombre, precio_base, creado_en, aprobado
  - estado=activo              # Filtrar por estado
  - aprobado=true              # Filtrar por aprobación
  - precio_base__gte=1000      # Precio mínimo
  - precio_base__lte=50000     # Precio máximo
  - page=1                     # Paginación (20 por página)

Respuesta:
{
  "count": 10,
  "next": "http://localhost:8000/api/productos/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "nombre": "Camiseta Básica",
      "precio_base": "25000.00",
      "estado": "activo",
      "aprobado": true,
      "imagen_principal": "http://...",
      "variantes_count": 3,
      "creado_en": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Crear producto (US#10)
```
POST /api/productos/

{
  "nombre": "Camiseta Premium",
  "descripcion": "Camiseta de algodón 100% con estampación personalizada",
  "precio_base": "35000.00",
  "categoria": "Premium",
  "estado": "inactivo",
  "aprobado": false
}

Validaciones (US#10):
- nombre: único, requerido, máx 100 caracteres
- descripcion: máx 500 caracteres
- precio_base: > 0, máx 2 decimales
```

#### Obtener detalle del producto
```
GET /api/productos/{id}/

Retorna:
{
  "id": 1,
  "nombre": "Camiseta Básica",
  "descripcion": "...",
  "precio_base": "25000.00",
  "estado": "activo",
  "aprobado": true,
  "categoria": "Básicas",
  "imagenes": [
    {
      "id": 1,
      "archivo": "http://...",
      "es_principal": true,
      "orden": 0,
      "descripcion": "Vista frontal"
    }
  ],
  "variantes": [
    {
      "id": 1,
      "talla": "M",
      "color": "negro",
      "stock": 10,
      "precio_variante": null,
      "precio_mostrado": "25000.00"
    }
  ],
  "puede_publicarse": true
}
```

#### Actualizar producto
```
PUT/PATCH /api/productos/{id}/

{
  "nombre": "Camiseta Básica Revised",
  "precio_base": "28000.00",
  ...
}
```

#### Eliminar producto
```
DELETE /api/productos/{id}/
```

#### Verificar si puede publicarse (US#10)
```
GET /api/productos/{id}/puede-publicarse/

Retorna:
{
  "puede_publicarse": true,
  "motivo": "Cumple requisitos mínimos"
}
```

#### Publicar producto
```
POST /api/productos/{id}/publicar/

Requiere:
- Al menos 1 imagen principal
- Al menos 1 variante con stock > 0
```

---

### Imágenes (US#11)

#### Agregar imagen a producto
```
POST /api/productos/{producto_id}/agregar-imagen/

Content-Type: multipart/form-data

Fields:
  - archivo: <image_file>
  - es_principal: false
  - orden: 0
  - descripcion: "Vista frontal"

Validaciones (US#11):
- Extensión: JPG, PNG
- Tamaño máximo: 2MB
- Resolución mínima: 400x400 píxeles
- Máximo 5 imágenes por producto
```

#### Hacer imagen principal
```
POST /api/imagenes/{imagen_id}/hacer-principal/
```

#### Reordenar imágenes
```
POST /api/imagenes/reordenar/?producto={producto_id}

{
  "nuevo_orden": [3, 1, 2]  # IDs en el nuevo orden
}
```

---

### Variantes (US#12)

#### Agregar variante a producto
```
POST /api/productos/{producto_id}/agregar-variante/

{
  "talla": "M",
  "color": "negro",
  "stock": 10,
  "precio_variante": null
}

Validaciones (US#12):
- Combinación única (talla + color) por producto
- stock >= 0
- Máximo 4 tallas diferentes por producto
- Máximo 10 colores diferentes por producto
```

#### Listar variantes de un producto
```
GET /api/variantes/?producto={producto_id}
```

#### Actualizar variante
```
PUT/PATCH /api/variantes/{variante_id}/

{
  "stock": 15,
  "precio_variante": "38000.00"
}
```

#### Eliminar variante
```
DELETE /api/variantes/{variante_id}/
```

---

## Modelos de Datos

### Producto (US#10)
- `id`: ID único
- `nombre`: Texto único, máx 100 caracteres
- `descripcion`: Texto, máx 500 caracteres
- `precio_base`: Decimal(8,2), > 0
- `estado`: 'activo' | 'inactivo'
- `aprobado`: Boolean
- `categoria`: Texto
- `creado_en`: DateTime (auto)
- `actualizado_en`: DateTime (auto)

### Variante (US#12)
- `id`: ID único
- `producto_id`: FK a Producto
- `talla`: S, M, L, XL, XXL
- `color`: 10 opciones predefinidas
- `stock`: Integer >= 0
- `precio_variante`: Decimal(8,2) (opcional)
- Constraint: unique(producto, talla, color)

### Imagen (US#11)
- `id`: ID único
- `producto_id`: FK a Producto
- `archivo`: ImageField (JPG/PNG, máx 2MB, mín 400x400)
- `es_principal`: Boolean
- `orden`: PositiveInteger
- `descripcion`: Texto (alt text)
- Constraint: una imagen principal por producto
- Límite: máximo 5 imágenes por producto

---

## Autenticación y Permisos

Actualmente configurado con autenticación de sesión. Para producción, implementar:
- JWT tokens
- OAuth2
- API Key

---

## Testing

Ejecutar pruebas:
```bash
python manage.py test api
```

---

## Deployment

Para producción:
1. Cambiar `DEBUG=False` en `.env`
2. Generar nueva `SECRET_KEY`
3. Configurar `ALLOWED_HOSTS`
4. Usar base de datos MySQL separada
5. Servir archivos estáticos con nginx/apache
6. Usar WSGI server como Gunicorn
