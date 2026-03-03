from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductoViewSet, VarianteViewSet, ImagenViewSet

# Router para registrar ViewSets
router = DefaultRouter()
router.register(r'productos', ProductoViewSet, basename='producto')
router.register(r'variantes', VarianteViewSet, basename='variante')
router.register(r'imagenes', ImagenViewSet, basename='imagen')

app_name = 'api'

urlpatterns = [
    path('', include(router.urls)),
]
