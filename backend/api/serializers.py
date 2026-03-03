from rest_framework import serializers
from django.core.files.images import get_image_dimensions
from .models import Producto, Variante, Imagen
import os

class ImagenSerializer(serializers.ModelSerializer):
    """
    Serializer para imágenes con validaciones US#11
    """
    class Meta:
        model = Imagen
        fields = ['id', 'archivo', 'es_principal', 'orden', 'descripcion', 'creado_en']
        read_only_fields = ['id', 'creado_en']
    
    def validate_archivo(self, value):
        """
        Validaciones para archivo de imagen US#11:
        - Extensión JPG/PNG
        - Tamaño máximo 2MB
        - Resolución mínima 400x400
        """
        # Validar extensión
        ext = os.path.splitext(value.name)[1].lower()
        if ext not in ['.jpg', '.jpeg', '.png']:
            raise serializers.ValidationError(
                "Solo se permiten imágenes JPG y PNG"
            )
        
        # Validar tamaño (máximo 2MB)
        if value.size > 2 * 1024 * 1024:
            raise serializers.ValidationError(
                "El tamaño de la imagen no debe exceder 2MB"
            )
        
        # Validar resolución mínima (400x400)
        try:
            width, height = get_image_dimensions(value)
            if width < 400 or height < 400:
                raise serializers.ValidationError(
                    "La resolución mínima de la imagen debe ser 400x400 píxeles"
                )
        except Exception as e:
            raise serializers.ValidationError(
                f"Error al validar la imagen: {str(e)}"
            )
        
        return value


class VarianteSerializer(serializers.ModelSerializer):
    """
    Serializer para variantes con validaciones US#12
    """
    precio_mostrado = serializers.SerializerMethodField()
    
    class Meta:
        model = Variante
        fields = ['id', 'talla', 'color', 'stock', 'precio_variante', 'precio_mostrado', 'creado_en']
        read_only_fields = ['id', 'creado_en']
    
    def validate_stock(self, value):
        """Stock debe ser >= 0 US#12"""
        if value < 0:
            raise serializers.ValidationError("El stock debe ser mayor o igual a 0")
        return value
    
    def validate(self, attrs):
        """
        Validaciones de combinaciones únicas y límites
        """
        producto_id = self.context.get('producto_id')
        talla = attrs.get('talla')
        color = attrs.get('color')
        
        # Validar combinación única (talla + color)
        qs = Variante.objects.filter(
            producto_id=producto_id,
            talla=talla,
            color=color
        )
        
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        
        if qs.exists():
            raise serializers.ValidationError(
                f"La combinación {talla}-{color} ya existe en este producto"
            )
        
        return attrs
    
    def get_precio_mostrado(self, obj):
        """Retorna el precio de la variante o el base del producto"""
        return float(obj.get_precio())


class ProductoListSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para listar productos (óptimo para catálogos)
    """
    imagen_principal = serializers.SerializerMethodField()
    variantes_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'precio_base', 'estado', 'aprobado', 'imagen_principal', 'variantes_count', 'creado_en']
        read_only_fields = ['id', 'creado_en']
    
    def get_imagen_principal(self, obj):
        imagen = obj.imagenes.filter(es_principal=True).first()
        if imagen:
            request = self.context.get('request')
            return request.build_absolute_uri(imagen.archivo.url) if request else imagen.archivo.url
        return None
    
    def get_variantes_count(self, obj):
        return obj.variantes.count()


class ProductoDetailSerializer(serializers.ModelSerializer):
    """
    Serializer completo para detalle de producto con validaciones US#10, #11, #12
    """
    imagenes = ImagenSerializer(many=True, read_only=True)
    variantes = VarianteSerializer(many=True, read_only=True)
    puede_publicarse = serializers.SerializerMethodField()
    
    class Meta:
        model = Producto
        fields = [
            'id', 'nombre', 'descripcion', 'precio_base', 'estado', 
            'aprobado', 'categoria', 'imagenes', 'variantes', 
            'puede_publicarse', 'creado_en', 'actualizado_en'
        ]
        read_only_fields = ['id', 'creado_en', 'actualizado_en']
    
    def validate_nombre(self, value):
        """
        US#10: Nombre único y requerido, máximo 100 caracteres
        """
        if len(value) > 100:
            raise serializers.ValidationError(
                "El nombre debe tener máximo 100 caracteres"
            )
        
        if not value.strip():
            raise serializers.ValidationError(
                "El nombre es requerido"
            )
        
        # Validar unicidad
        qs = Producto.objects.filter(nombre__iexact=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        
        if qs.exists():
            raise serializers.ValidationError(
                "El nombre del producto debe ser único"
            )
        
        return value
    
    def validate_descripcion(self, value):
        """
        US#10: Descripción máximo 500 caracteres
        """
        if len(value) > 500:
            raise serializers.ValidationError(
                "La descripción debe tener máximo 500 caracteres"
            )
        
        return value
    
    def validate_precio_base(self, value):
        """
        US#10: Precio base > 0 con 2 decimales
        """
        if value <= 0:
            raise serializers.ValidationError(
                "El precio base debe ser mayor a 0"
            )
        
        # Validar que tenga máximo 2 decimales
        if value.as_tuple().exponent < -2:
            raise serializers.ValidationError(
                "El precio debe tener máximo 2 decimales"
            )
        
        return value
    
    def validate(self, attrs):
        """
        Validaciones globales
        """
        return attrs
    
    def get_puede_publicarse(self, obj):
        """
        US#10: Valida que el producto tenga configuración mínima:
        - Al menos una imagen principal
        - Al menos una variante con stock > 0
        """
        return obj.puede_publicarse()


class ProductoCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer para crear y actualizar productos
    Llama validaciones completas de US#10, #11, #12
    """
    class Meta:
        model = Producto
        fields = ['nombre', 'descripcion', 'precio_base', 'estado', 'aprobado', 'categoria']
    
    def validate_nombre(self, value):
        """US#10"""
        if len(value) > 100:
            raise serializers.ValidationError("Máximo 100 caracteres")
        if not value.strip():
            raise serializers.ValidationError("El nombre es requerido")
        
        qs = Producto.objects.filter(nombre__iexact=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        
        if qs.exists():
            raise serializers.ValidationError("El nombre del producto ya existe")
        
        return value
    
    def validate_descripcion(self, value):
        """US#10"""
        if len(value) > 500:
            raise serializers.ValidationError("Máximo 500 caracteres")
        return value
    
    def validate_precio_base(self, value):
        """US#10"""
        if value <= 0:
            raise serializers.ValidationError("Debe ser mayor a 0")
        return value
