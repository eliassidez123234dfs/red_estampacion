from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Producto, Variante, Imagen
from .serializers import (
    ProductoDetailSerializer,
    ProductoCreateUpdateSerializer,
    ProductoListSerializer,
    VarianteSerializer,
    ImagenSerializer
)


class ProductoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión completa de productos con:
    - CRUD (Create, Read, Update, Delete) - US#10
    - Búsqueda y filtrado - US#16
    - Subida de imágenes - US#11
    - Gestión de variantes - US#12
    """
    
    queryset = Producto.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    # US#16: Búsqueda parcial insensible a mayúsculas
    search_fields = ['nombre', 'descripcion', 'categoria']
    
    # US#16: Ordenamiento por diferentes criterios
    ordering_fields = ['nombre', 'precio_base', 'creado_en', 'aprobado']
    ordering = ['-creado_en']
    
    # US#16: Filtros combinables
    filterset_fields = {
        'estado': ['exact'],
        'aprobado': ['exact'],
        'precio_base': ['gte', 'lte'],
        'categoria': ['exact'],
    }
    
    def get_serializer_class(self):
        """
        Usa diferentes serializers según la acción
        """
        if self.action == 'list':
            return ProductoListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ProductoCreateUpdateSerializer
        else:
            return ProductoDetailSerializer
    
    def get_serializer_context(self):
        """Agrega contexto necesario para validaciones"""
        context = super().get_serializer_context()
        context['producto_id'] = self.kwargs.get('pk')
        return context
    
    def perform_create(self, serializer):
        """
        US#10: Al crear producto, inicialmente está inactivo y no aprobado
        """
        serializer.save(estado='inactivo', aprobado=False)
    
    @action(detail=True, methods=['post'], url_path='agregar-imagen')
    def agregar_imagen(self, request, pk=None):
        """
        US#11: Endpoint para agregar imagen a producto
        - Valida extensión (JPG/PNG)
        - Valida tamaño (máximo 2MB)
        - Valida resolución (mínimo 400x400)
        - Máximo 5 imágenes por producto
        """
        producto = self.get_object()
        
        # Validar cantidad máxima de imágenes (US#11)
        if producto.imagenes.count() >= 5:
            return Response(
                {'error': 'Máximo 5 imágenes por producto'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = ImagenSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(producto=producto)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], url_path='agregar-variante')
    def agregar_variante(self, request, pk=None):
        """
        US#12: Endpoint para agregar variante al producto
        - Validar combinación única (talla + color)
        - Stock >= 0
        - Máximo 4 tallas y 10 colores
        """
        producto = self.get_object()
        
        serializer = VarianteSerializer(data=request.data, context={'producto_id': pk})
        if serializer.is_valid():
            serializer.save(producto=producto)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'], url_path='puede-publicarse')
    def puede_publicarse(self, request, pk=None):
        """
        US#10: Verifica si el producto cumple requisitos mínimos para publicarse
        """
        producto = self.get_object()
        puede_publicarse = producto.puede_publicarse()
        
        return Response({
            'puede_publicarse': puede_publicarse,
            'motivo': 'Cumple requisitos mínimos' if puede_publicarse 
                     else 'Requiere imagen principal y al menos una variante con stock'
        })
    
    @action(detail=True, methods=['post'], url_path='publicar')
    def publicar(self, request, pk=None):
        """
        Publica (activa y aprueba) el producto si cumple requisitos
        """
        producto = self.get_object()
        
        if not producto.puede_publicarse():
            return Response(
                {
                    'error': 'El producto no cumple requisitos mínimos',
                    'detalles': {
                        'imagen_principal': producto.imagenes.filter(es_principal=True).exists(),
                        'variante_con_stock': producto.variantes.filter(stock__gt=0).exists(),
                    }
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        producto.estado = 'activo'
        producto.aprobado = True
        producto.save()
        
        serializer = self.get_serializer(producto)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], url_path='desactivar')
    def desactivar(self, request, pk=None):
        """Desactiva el producto"""
        producto = self.get_object()
        producto.estado = 'inactivo'
        producto.save()
        
        serializer = self.get_serializer(producto)
        return Response(serializer.data)


class VarianteViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de variantes de producto
    US#12: Definir variantes de talla
    """
    queryset = Variante.objects.all()
    serializer_class = VarianteSerializer
    
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['producto', 'talla', 'color']
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        if 'producto_pk' in self.kwargs:
            context['producto_id'] = self.kwargs['producto_pk']
        return context


class ImagenViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de imágenes de producto
    US#11: Subir imágenes al producto
    """
    queryset = Imagen.objects.all()
    serializer_class = ImagenSerializer
    
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['producto', 'es_principal']
    
    @action(detail=True, methods=['post'], url_path='hacer-principal')
    def hacer_principal(self, request, pk=None):
        """Establece esta imagen como principal"""
        imagen = self.get_object()
        
        # Desmarcar otras imágenes principales del mismo producto
        imagen.producto.imagenes.exclude(pk=pk).update(es_principal=False)
        
        imagen.es_principal = True
        imagen.save()
        
        serializer = self.get_serializer(imagen)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], url_path='reordenar')
    def reordenar(self, request, pk=None):
        """
        Reordena las imágenes del producto
        Espera {'nuevo_orden': [id1, id2, id3, ...]}
        """
        producto_id = request.GET.get('producto')
        nuevo_orden = request.data.get('nuevo_orden', [])
        
        if not nuevo_orden:
            return Response(
                {'error': 'Se requiere el parámetro nuevo_orden'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            for idx, imagen_id in enumerate(nuevo_orden):
                Imagen.objects.filter(pk=imagen_id, producto_id=producto_id).update(orden=idx)
            
            return Response({'mensaje': 'Orden actualizado correctamente'})
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
