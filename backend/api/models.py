from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
import os

class Producto(models.Model):
    """
    User Story #10: El sistema debe permitir al administrador crear un nuevo producto.
    - Nombre único y requerido (max 100 caracteres)
    - Descripción (max 500 caracteres)
    - Precio base > 0 con 2 decimales
    - Configuración mínima: al menos 1 imagen principal y 1 variante
    """
    ESTADO_CHOICES = [
        ('activo', 'Activo'),
        ('inactivo', 'Inactivo'),
    ]
    
    # Campo básico (RF-001)
    nombre = models.CharField(
        max_length=100,
        unique=True,
        help_text="Nombre único del producto, máximo 100 caracteres"
    )
    
    descripcion = models.TextField(
        max_length=500,
        blank=True,
        default="",
        help_text="Descripción del producto, máximo 500 caracteres"
    )
    
    precio_base = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
        help_text="Precio base del producto (mínimo 0.01)"
    )
    
    estado = models.CharField(
        max_length=20,
        choices=ESTADO_CHOICES,
        default='inactivo',
        help_text="Estado del producto (activo/inactivo)"
    )
    
    aprobado = models.BooleanField(
        default=False,
        help_text="Producto aprobado por administrador"
    )
    
    categoria = models.CharField(
        max_length=100,
        blank=True,
        default="",
        help_text="Categoría del producto"
    )
    
    # Metadatos
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-creado_en']
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'
        indexes = [
            models.Index(fields=['nombre']),
            models.Index(fields=['estado']),
            models.Index(fields=['aprobado']),
        ]
    
    def __str__(self):
        return self.nombre
    
    def puede_publicarse(self):
        """
        Valida que el producto cumpla requisitos mínimos (US#10)
        """
        # Verificar imagen principal
        tiene_imagen = self.imagenes.filter(es_principal=True).exists()
        
        # Verificar variante (talla + color + stock > 0)
        tiene_variante = self.variantes.filter(stock__gt=0).exists()
        
        return tiene_imagen and tiene_variante
    
    def clean(self):
        """Validaciones personalizadas"""
        if self.precio_base < 0:
            raise ValidationError({'precio_base': 'El precio debe ser mayor a 0'})
        
        if len(self.nombre) > 100:
            raise ValidationError({'nombre': 'Máximo 100 caracteres'})
        
        if len(self.descripcion) > 500:
            raise ValidationError({'descripcion': 'Máximo 500 caracteres'})


class Variante(models.Model):
    """
    User Story #12: El sistema debe permitir al administrador definir variantes de talla.
    - Combinaciones únicas (talla + color) por producto
    - Stock >= 0
    - Máximo 4 tallas y 10 colores por producto
    """
    TALLA_CHOICES = [
        ('XS', 'XS'),
        ('S', 'S'),
        ('M', 'M'),
        ('L', 'L'),
        ('XL', 'XL'),
        ('XXL', 'XXL'),
    ]
    
    COLOR_CHOICES = [
        ('blanco', 'Blanco'),
        ('negro', 'Negro'),
        ('rojo', 'Rojo'),
        ('azul', 'Azul'),
        ('verde', 'Verde'),
        ('amarillo', 'Amarillo'),
        ('rosa', 'Rosa'),
        ('gris', 'Gris'),
        ('naranja', 'Naranja'),
        ('morado', 'Morado'),
    ]
    
    producto = models.ForeignKey(
        Producto,
        on_delete=models.CASCADE,
        related_name='variantes'
    )
    
    talla = models.CharField(
        max_length=10,
        choices=TALLA_CHOICES,
        help_text="Talla de la variante"
    )
    
    color = models.CharField(
        max_length=20,
        choices=COLOR_CHOICES,
        help_text="Color de la variante"
    )
    
    stock = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Stock disponible (>= 0)"
    )
    
    precio_variante = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="Precio específico de variante (opcional). Si es NULL usa precio_base"
    )
    
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('producto', 'talla', 'color')
        verbose_name = 'Variante'
        verbose_name_plural = 'Variantes'
    
    def __str__(self):
        return f"{self.producto.nombre} - {self.talla} {self.color}"
    
    def get_precio(self):
        """Retorna precio de variante o precio base del producto"""
        return self.precio_variante or self.producto.precio_base
    
    def clean(self):
        """Validaciones personalizadas US#12"""
        if self.stock < 0:
            raise ValidationError({'stock': 'El stock no puede ser negativo'})
        
        # Validar límites de tallas y colores por producto
        variantes_qs = self.producto.variantes.exclude(pk=self.pk) if self.pk else self.producto.variantes.all()
        tallas_actuales = set(variantes_qs.values_list('talla', flat=True))
        colores_actuales = set(variantes_qs.values_list('color', flat=True))

        tallas_unicas = len(tallas_actuales | {self.talla})
        colores_unicos = len(colores_actuales | {self.color})
        
        if tallas_unicas > 4:
            raise ValidationError('Máximo 4 tallas diferentes por producto')
        
        if colores_unicos > 10:
            raise ValidationError('Máximo 10 colores diferentes por producto')


class Imagen(models.Model):
    """
    User Story #11: El sistema debe permitir al administrador subir imágenes al producto.
    - Imagen principal obligatoria (JPG/PNG)
    - Máximo 2MB, resolución mínima 400x400
    - Máximo 5 imágenes por producto, reordenables
    """
    def validar_extension_imagen(value):
        """Validador para extensiones permitidas"""
        ext = os.path.splitext(value.name)[1]
        if ext.lower() not in ['.jpg', '.jpeg', '.png']:
            raise ValidationError(
                _('Solo se permiten imágenes JPG y PNG'),
                code='invalid_image_extension'
            )
    
    def validar_tamaño_imagen(value):
        """Validador para tamaño máximo de 2MB"""
        if value.size > 2 * 1024 * 1024:  # 2MB en bytes
            raise ValidationError(
                _('El tamaño de la imagen no debe exceder 2MB'),
                code='image_too_large'
            )
    
    producto = models.ForeignKey(
        Producto,
        on_delete=models.CASCADE,
        related_name='imagenes'
    )
    
    archivo = models.ImageField(
        upload_to='productos/%Y/%m/%d/',
        validators=[validar_extension_imagen, validar_tamaño_imagen],
        help_text="Imagen en formato JPG o PNG, máximo 2MB"
    )
    
    es_principal = models.BooleanField(
        default=False,
        help_text="Si es TRUE, esta será la imagen principal del producto"
    )
    
    orden = models.PositiveIntegerField(
        default=0,
        help_text="Orden de la imagen en la galería"
    )
    
    descripcion = models.CharField(
        max_length=255,
        blank=True,
        default="",
        help_text="Descripción de la imagen (alt text)"
    )
    
    creado_en = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['orden', 'creado_en']
        constraints = [
            models.UniqueConstraint(
                fields=['producto'],
                condition=models.Q(es_principal=True),
                name='unique_imagen_principal_por_producto'
            )
        ]
        verbose_name = 'Imagen'
        verbose_name_plural = 'Imágenes'
    
    def __str__(self):
        return f"Imagen de {self.producto.nombre}"
    
    def clean(self):
        """Validaciones personalizadas US#11"""
        # Máximo 5 imágenes por producto
        cantidad_imagenes = self.producto.imagenes.count()
        
        # No contar la imagen actual si es una edición
        if self.pk:
            cantidad_imagenes -= 1
        
        if cantidad_imagenes >= 5:
            raise ValidationError('Máximo 5 imágenes por producto')
        
        # Validar resolución mínima (400x400) - se valida cuando se guarda
        # Esta validación completa se hace en el serializer
    
    def save(self, *args, **kwargs):
        """
        Si esta imagen es principal, desmarcar otras como principales
        """
        if self.es_principal:
            # Desmarcar otras imágenes principales
            self.producto.imagenes.exclude(pk=self.pk).update(es_principal=False)
        
        super().save(*args, **kwargs)
