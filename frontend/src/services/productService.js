import api from './api'

// User Story #10: Crear producto
export const crearProducto = (datos) => {
  return api.post('/productos/', datos)
}

// Obtener todos los productos
export const obtenerProductos = (params = {}) => {
  return api.get('/productos/', { params })
}

// Obtener producto por ID
export const obtenerProducto = (id) => {
  return api.get(`/productos/${id}/`)
}

// Actualizar producto
export const actualizarProducto = (id, datos) => {
  return api.patch(`/productos/${id}/`, datos)
}

// Eliminar producto
export const eliminarProducto = (id) => {
  return api.delete(`/productos/${id}/`)
}

// US#10: Verificar si puede publicarse
export const verificarPublicacion = (id) => {
  return api.get(`/productos/${id}/puede-publicarse/`)
}

// Publicar producto
export const publicarProducto = (id) => {
  return api.post(`/productos/${id}/publicar/`)
}

// Desactivar producto
export const desactivarProducto = (id) => {
  return api.post(`/productos/${id}/desactivar/`)
}

// User Story #11: Agregar imagen a producto
export const agregarImagen = (productoId, formData) => {
  return api.post(`/productos/${productoId}/agregar-imagen/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// Hacer imagen principal
export const hacerImagenPrincipal = (imagenId) => {
  return api.post(`/imagenes/${imagenId}/hacer-principal/`)
}

// Reordenar imágenes
export const reordenarImagenes = (productoId, nuevoOrden) => {
  return api.post(`/imagenes/reordenar/?producto=${productoId}`, {
    nuevo_orden: nuevoOrden
  })
}

// User Story #12: Agregar variante a producto
export const agregarVariante = (productoId, datos) => {
  return api.post(`/productos/${productoId}/agregar-variante/`, datos)
}

// Obtener variantes de un producto
export const obtenerVariantes = (productoId) => {
  return api.get('/variantes/', { params: { producto: productoId } })
}

// Actualizar variante
export const actualizarVariante = (varianteId, datos) => {
  return api.patch(`/variantes/${varianteId}/`, datos)
}

// Eliminar variante
export const eliminarVariante = (varianteId) => {
  return api.delete(`/variantes/${varianteId}/`)
}

// User Story #16: Búsqueda y filtrado
export const buscarProductos = (searchParams = {}) => {
  return api.get('/productos/', {
    params: {
      search: searchParams.search || '',
      estado: searchParams.estado || '',
      aprobado: searchParams.aprobado !== undefined ? searchParams.aprobado : '',
      precio_base__gte: searchParams.precioMin || '',
      precio_base__lte: searchParams.precioMax || '',
      ordering: searchParams.ordering || '-creado_en',
      page: searchParams.page || 1,
      ...searchParams
    }
  })
}
