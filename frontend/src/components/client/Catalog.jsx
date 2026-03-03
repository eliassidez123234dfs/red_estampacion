import React, { useState, useEffect } from 'react'
import './Catalog.scss'
import { buscarProductos } from '../../services/productService'

/**
 * Catálogo de productos para clientes
 * Integra filtrado y búsqueda desde US#16
 */
const Catalog = ({ onProductoSeleccionado = null }) => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(false)
  const [paginaActual, setPaginaActual] = useState(1)
  const [totalProductos, setTotalProductos] = useState(0)

  const [filtros, setFiltros] = useState({
    search: '',
    precioMin: '',
    precioMax: '',
    estado: 'activo',
    aprobado: true,
    ordenamiento: '-creado_en'
  })

  useEffect(() => {
    cargarProductos()
  }, [paginaActual, filtros])

  const cargarProductos = async () => {
    setLoading(true)
    try {
      const response = await buscarProductos({
        search: filtros.search,
        estado: 'activo',
        aprobado: true,
        precioMin: filtros.precioMin,
        precioMax: filtros.precioMax,
        ordering: filtros.ordenamiento,
        page: paginaActual
      })
      
      setProductos(response.data.results)
      setTotalProductos(response.data.count)
    } catch (error) {
      console.error('Error al cargar productos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBusqueda = (e) => {
    setFiltros(prev => ({ ...prev, search: e.target.value }))
    setPaginaActual(1)
  }

  const handleFiltroChange = (e) => {
    const { name, value } = e.target
    setFiltros(prev => ({ ...prev, [name]: value }))
    setPaginaActual(1)
  }

  const totalPaginas = Math.ceil(totalProductos / 20)

  return (
    <div className="catalog">
      {/* HEADER */}
      <div className="catalog-header">
        <h1>Catálogo de Productos</h1>
        <p>Descubre nuestros diseños personalizados</p>
      </div>

      {/* FILTROS */}
      <div className="catalog-filters">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={filtros.search}
          onChange={handleBusqueda}
          className="search-input"
        />

        <div className="filters-group">
          <div className="filter-item">
            <label>Precio Mínimo</label>
            <input
              type="number"
              name="precioMin"
              value={filtros.precioMin}
              onChange={handleFiltroChange}
              placeholder="Desde"
            />
          </div>

          <div className="filter-item">
            <label>Precio Máximo</label>
            <input
              type="number"
              name="precioMax"
              value={filtros.precioMax}
              onChange={handleFiltroChange}
              placeholder="Hasta"
            />
          </div>

          <div className="filter-item">
            <label>Ordenar</label>
            <select
              name="ordenamiento"
              value={filtros.ordenamiento}
              onChange={handleFiltroChange}
            >
              <option value="-creado_en">Más Recientes</option>
              <option value="nombre">Nombre (A-Z)</option>
              <option value="precio_base">Precio (Menor)</option>
              <option value="-precio_base">Precio (Mayor)</option>
            </select>
          </div>
        </div>
      </div>

      {/* PRODUCTOS GRID */}
      {loading && <div className="loading">Cargando productos...</div>}

      {!loading && productos.length > 0 ? (
        <>
          <div className="products-grid">
            {productos.map(producto => (
              <div
                key={producto.id}
                className="product-card"
                onClick={() => onProductoSeleccionado && onProductoSeleccionado(producto.id)}
              >
                <div className="product-image">
                  {producto.imagen_principal ? (
                    <img src={producto.imagen_principal} alt={producto.nombre} />
                  ) : (
                    <div className="no-image">Sin imagen</div>
                  )}
                </div>

                <div className="product-info">
                  <h3>{producto.nombre}</h3>
                  <p className="price">
                    ${parseFloat(producto.precio_base).toLocaleString('es-CO', {
                      minimumFractionDigits: 2
                    })}
                  </p>
                  <p className="variants">
                    {producto.variantes_count} variante{producto.variantes_count !== 1 ? 's' : ''}
                  </p>
                  <button className="btn btn-primary">Ver Detalles</button>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINACIÓN */}
          {totalPaginas > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
                disabled={paginaActual === 1}
              >
                ← Anterior
              </button>

              {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                const pagina = i + 1
                return (
                  <button
                    key={pagina}
                    onClick={() => setPaginaActual(pagina)}
                    className={paginaActual === pagina ? 'active' : ''}
                  >
                    {pagina}
                  </button>
                )
              })}

              <button
                onClick={() => setPaginaActual(Math.min(totalPaginas, paginaActual + 1))}
                disabled={paginaActual === totalPaginas}
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      ) : (
        !loading && (
          <div className="alert alert-info">
            No hay productos disponibles
          </div>
        )
      )}
    </div>
  )
}

export default Catalog
