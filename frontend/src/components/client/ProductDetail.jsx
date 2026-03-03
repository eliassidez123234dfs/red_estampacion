import React, { useState, useEffect } from 'react'
import './ProductDetail.scss'
import { obtenerProducto } from '../../services/productService'

/**
 * Vista de detalles del producto
 */
const ProductDetail = ({ productoId, onVolver = null }) => {
  const [producto, setProducto] = useState(null)
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null)
  const [varianteSeleccionada, setVarianteSeleccionada] = useState(null)
  const [cantidad, setCantidad] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarProducto()
  }, [productoId])

  const cargarProducto = async () => {
    try {
      const response = await obtenerProducto(productoId)
      setProducto(response.data)
      
      // Seleccionar imagen principal por defecto
      const imagenPrincipal = response.data.imagenes.find(img => img.es_principal)
      setImagenSeleccionada(imagenPrincipal || response.data.imagenes[0])
      
      // Seleccionar primera variante por defecto
      if (response.data.variantes.length > 0) {
        setVarianteSeleccionada(response.data.variantes[0])
      }
    } catch (error) {
      console.error('Error al cargar producto:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAgregarAlCarrito = () => {
    if (!varianteSeleccionada) {
      alert('Por favor selecciona una variante')
      return
    }

    // Aquí iría lógica para agregar al carrito
    console.log({
      producto_id: producto.id,
      variante_id: varianteSeleccionada.id,
      cantidad
    })
    alert(`Se agregó ${cantidad} ${producto.nombre} al carrito`)
  }

  if (loading) return <div className="loading">Cargando...</div>
  if (!producto) return <div className="alert alert-danger">Producto no encontrado</div>

  return (
    <div className="product-detail">
      {onVolver && (
        <button onClick={onVolver} className="btn-volver">← Volver</button>
      )}

      <div className="detail-container">
        {/* GALERÍA DE IMÁGENES */}
        <div className="gallery-section">
          {imagenSeleccionada && (
            <div className="main-image">
              <img src={imagenSeleccionada.archivo} alt={producto.nombre} />
            </div>
          )}

          {producto.imagenes.length > 1 && (
            <div className="thumbnails">
              {producto.imagenes.map(img => (
                <img
                  key={img.id}
                  src={img.archivo}
                  alt="Thumbnail"
                  className={imagenSeleccionada?.id === img.id ? 'active' : ''}
                  onClick={() => setImagenSeleccionada(img)}
                />
              ))}
            </div>
          )}
        </div>

        {/* INFORMACIÓN DEL PRODUCTO */}
        <div className="info-section">
          <h1>{producto.nombre}</h1>

          <div className="price-info">
            <p className="price">
              ${parseFloat(producto.precio_base).toLocaleString('es-CO', {
                minimumFractionDigits: 2
              })}
            </p>
          </div>

          {producto.descripcion && (
            <div className="description">
              <h3>Descripción</h3>
              <p>{producto.descripcion}</p>
            </div>
          )}

          {/* SELECCIÓN DE VARIANTES */}
          {producto.variantes.length > 0 && (
            <div className="variants-section">
              <h3>Selecciona tu variante</h3>

              <div className="variant-selector">
                {producto.variantes.map(variante => (
                  <button
                    key={variante.id}
                    onClick={() => setVarianteSeleccionada(variante)}
                    className={`variant-btn ${varianteSeleccionada?.id === variante.id ? 'active' : ''}`}
                    disabled={variante.stock <= 0}
                    title={variante.stock <= 0 ? 'Agotado' : `${variante.talla} - ${variante.color}`}
                  >
                    <span className="size">{variante.talla}</span>
                    <span className="color">{variante.color}</span>
                    <span className="stock">
                      {variante.stock > 0 ? `${variante.stock}` : 'Agotado'}
                    </span>
                  </button>
                ))}
              </div>

              {varianteSeleccionada && varianteSeleccionada.stock > 0 && (
                <div className="quantity-section">
                  <label htmlFor="cantidad">Cantidad:</label>
                  <input
                    type="number"
                    id="cantidad"
                    min="1"
                    max={varianteSeleccionada.stock}
                    value={cantidad}
                    onChange={(e) => setCantidad(parseInt(e.target.value))}
                  />
                  <small>Stock disponible: {varianteSeleccionada.stock}</small>
                </div>
              )}
            </div>
          )}

          {/* BOTÓN DE CARRITO */}
          {varianteSeleccionada && varianteSeleccionada.stock > 0 ? (
            <button
              onClick={handleAgregarAlCarrito}
              className="btn btn-success btn-lg"
            >
              🛒 Agregar al Carrito
            </button>
          ) : (
            <button disabled className="btn btn-secondary btn-lg">
              Producto Agotado
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
