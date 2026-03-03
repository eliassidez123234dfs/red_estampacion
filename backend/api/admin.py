from django.contrib import admin
from .models import Producto, Variante, Imagen


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'precio_base', 'estado', 'aprobado', 'creado_en']
    list_filter = ['estado', 'aprobado', 'creado_en', 'categoria']
    search_fields = ['nombre', 'descripcion']
    ordering = ['-creado_en']
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('nombre', 'descripcion', 'categoria')
        }),
        ('Precios y Stock', {
            'fields': ('precio_base',)
        }),
        ('Estado y Publicación', {
            'fields': ('estado', 'aprobado')
        }),
        ('Metadatos', {
            'fields': ('creado_en', 'actualizado_en'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('creado_en', 'actualizado_en')
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # Si es una edición
            return self.readonly_fields + ['nombre']  # El nombre no se puede cambiar
        return self.readonly_fields


@admin.register(Variante)
class VarianteAdmin(admin.ModelAdmin):
    list_display = ['producto', 'talla', 'color', 'stock', 'precio_variante', 'creado_en']
    list_filter = ['producto', 'talla', 'color', 'creado_en']
    search_fields = ['producto__nombre']
    ordering = ['producto', 'talla', 'color']
    
    fieldsets = (
        ('Relación al Producto', {
            'fields': ('producto',)
        }),
        ('Variante', {
            'fields': ('talla', 'color', 'stock')
        }),
        ('Precio Específico', {
            'fields': ('precio_variante',),
            'description': 'Opcional. Si se deja en blanco, usa el precio base del producto'
        }),
        ('Metadatos', {
            'fields': ('creado_en', 'actualizado_en'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('creado_en', 'actualizado_en')
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('producto')


@admin.register(Imagen)
class ImagenAdmin(admin.ModelAdmin):
    list_display = ['producto', 'es_principal', 'orden', 'creado_en']
    list_filter = ['producto', 'es_principal', 'creado_en']
    search_fields = ['producto__nombre']
    ordering = ['producto', 'orden']
    
    fieldsets = (
        ('Relación al Producto', {
            'fields': ('producto',)
        }),
        ('Imagen', {
            'fields': ('archivo', 'descripcion')
        }),
        ('Orden y Presentación', {
            'fields': ('es_principal', 'orden')
        }),
        ('Metadatos', {
            'fields': ('creado_en',),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('creado_en',)
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('producto')
