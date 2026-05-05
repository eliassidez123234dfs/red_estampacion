#!/usr/bin/env python
"""
Script para poblar la base de datos Django con productos de ejemplo
usando las imágenes de camisas disponibles en assets/img_camisas/
"""

import os
import sys
import django
from decimal import Decimal
from pathlib import Path

# Configurar Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import Producto, Variante, Imagen

def poblar_productos_con_imagenes():
    """Poblar la base de datos con productos usando las imágenes disponibles"""
    
    # Ruta a las imágenes
    img_dir = Path("/home/South_Knight/Documentos/red_estampacion/assets/img_camisas")
    
    # Mapeo de imágenes a productos
    productos_data = [
        {
            "nombre": "Buzo con Capucha Hombre",
            "descripcion": "Buzo con capucha manga larga con gráfico estilo AE, perfecto para uso casual",
            "precio_base": Decimal("85000.00"),
            "categoria": "Streetwear",
            "imagenes": ["Buzo con Capucha Manga Larga con gráfico Hombre AE.webp"],
            "variantes": [
                {"talla": "M", "color": "Negro", "stock": 25},
                {"talla": "L", "color": "Negro", "stock": 20},
                {"talla": "XL", "color": "Negro", "stock": 15},
            ]
        },
        {
            "nombre": "Camisa Oxford Talla Grande",
            "descripcion": "Camisa estilo Oxford disponible en tallas grandes, elegante y cómoda",
            "precio_base": Decimal("65000.00"),
            "categoria": "Elegantes",
            "imagenes": ["CAMISAS-OXFORD-TALLAS-GRANDES_3-300x300.jpg"],
            "variantes": [
                {"talla": "L", "color": "Blanco", "stock": 18},
                {"talla": "XL", "color": "Blanco", "stock": 12},
                {"talla": "XL", "color": "Azul", "stock": 10},
            ]
        },
        {
            "nombre": "Goku Drip Puffer Jacket",
            "descripcion": "Chaqueta estilo puffer con diseño Goku Drip, edición limitada",
            "precio_base": Decimal("95000.00"),
            "categoria": "Streetwear",
            "imagenes": ["Goku-Drip-Puffer-Jacket-Black.webp"],
            "variantes": [
                {"talla": "M", "color": "Negro", "stock": 8},
                {"talla": "L", "color": "Negro", "stock": 12},
                {"talla": "XL", "color": "Negro", "stock": 6},
            ]
        },
        {
            "nombre": "Camisa Estilo Columbia",
            "descripcion": "Camisa manga larga estilo Columbia, ideal para actividades al aire libre",
            "precio_base": Decimal("75000.00"),
            "categoria": "Deportivas",
            "imagenes": ["camisas-estilo-columbia-manga-larga.jpg"],
            "variantes": [
                {"talla": "S", "color": "Azul", "stock": 15},
                {"talla": "M", "color": "Azul", "stock": 20},
                {"talla": "L", "color": "Azul", "stock": 18},
                {"talla": "XL", "color": "Verde", "stock": 10},
            ]
        },
        {
            "nombre": "Buzo Confort Caramelo",
            "descripcion": "Buzo confort tipo hoodie tacto suave color caramelo para mujer",
            "precio_base": Decimal("70000.00"),
            "categoria": "Streetwear",
            "imagenes": ["dunay-comfy-too-caramelo-Buzo confort tipo hoddie tacto suave caramelo mujer S.webp"],
            "variantes": [
                {"talla": "S", "color": "Caramelo", "stock": 12},
                {"talla": "M", "color": "Caramelo", "stock": 18},
                {"talla": "L", "color": "Caramelo", "stock": 14},
            ]
        },
        {
            "nombre": "Camisa Diseño Serpientes",
            "descripcion": "Camisa con diseño estampado de serpientes, estilo único y audaz",
            "precio_base": Decimal("55000.00"),
            "categoria": "Streetwear",
            "imagenes": ["imagen_camisa_diseño_Serpientes.webp"],
            "variantes": [
                {"talla": "M", "color": "Blanco", "stock": 16},
                {"talla": "L", "color": "Blanco", "stock": 14},
                {"talla": "XL", "color": "Negro", "stock": 8},
            ]
        },
        {
            "nombre": "Men Shirt Mockup",
            "descripcion": "Camisa básica masculina, perfecta para diseño personalizado",
            "precio_base": Decimal("45000.00"),
            "categoria": "Básicas",
            "imagenes": ["men-s-shirts-mockup-design-template-mockup-free-photo.jfif"],
            "variantes": [
                {"talla": "S", "color": "Blanco", "stock": 30},
                {"talla": "M", "color": "Blanco", "stock": 35},
                {"talla": "L", "color": "Blanco", "stock": 25},
                {"talla": "XL", "color": "Negro", "stock": 20},
            ]
        }
    ]
    
    print("Limpiando datos existentes...")
    Producto.objects.all().delete()
    
    print(f"Creando {len(productos_data)} productos con imágenes...")
    
    for i, prod_data in enumerate(productos_data):
        print(f"\nCreando producto {i+1}: {prod_data['nombre']}")
        
        # Crear producto
        producto = Producto.objects.create(
            nombre=prod_data['nombre'],
            descripcion=prod_data['descripcion'],
            precio_base=prod_data['precio_base'],
            categoria=prod_data['categoria'],
            estado='activo',
            aprobado=True
        )
        
        print(f"  - Producto creado: ID {producto.id}")
        
        # Agregar imágenes
        for j, img_nombre in enumerate(prod_data['imagenes']):
            img_path = img_dir / img_nombre
            if img_path.exists():
                # Copiar imagen al directorio media de Django
                media_dir = Path("media/productos")
                media_dir.mkdir(exist_ok=True)
                
                # Nombre de archivo único
                media_filename = f"producto_{producto.id}_{j+1}_{img_nombre}"
                media_path = media_dir / media_filename
                
                # Copiar archivo
                import shutil
                shutil.copy2(img_path, media_path)
                
                # Crear registro en base de datos
                imagen = Imagen.objects.create(
                    producto=producto,
                    archivo=f"productos/{media_filename}",
                    es_principal=(j == 0),  # Primera imagen como principal
                    orden=j,
                    descripcion=f"Imagen {j+1} de {producto.nombre}"
                )
                print(f"  - Imagen agregada: {media_filename}")
            else:
                print(f"  - ADVERTENCIA: No se encontró la imagen {img_path}")
        
        # Agregar variantes
        for var_data in prod_data['variantes']:
            variante = Variante.objects.create(
                producto=producto,
                talla=var_data['talla'],
                color=var_data['color'],
                stock=var_data['stock']
            )
            print(f"  - Variante agregada: {var_data['talla']} {var_data['color']} (Stock: {var_data['stock']})")
    
    print("\n¡Base de datos poblada exitosamente!")
    
    # Resumen
    total_productos = Producto.objects.count()
    total_imagenes = Imagen.objects.count()
    total_variantes = Variante.objects.count()
    
    print(f"\nResumen:")
    print(f"- Productos creados: {total_productos}")
    print(f"- Imágenes agregadas: {total_imagenes}")
    print(f"- Variantes creadas: {total_variantes}")
    
    # Mostrar productos para verificación
    print(f"\nProductos en catálogo:")
    for prod in Producto.objects.all():
        imagenes_count = prod.imagenes.count()
        variantes_count = prod.variantes.count()
        stock_total = sum(v.stock for v in prod.variantes.all())
        print(f"- {prod.nombre} (${prod.precio_base}) - {variantes_count} variantes, {imagenes_count} imágenes, Stock total: {stock_total}")

if __name__ == "__main__":
    poblar_productos_con_imagenes()
