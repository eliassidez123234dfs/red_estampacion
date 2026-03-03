import React, { useState, useEffect } from 'react'
import './ProductList.scss'
import { buscarProductos, publicarProducto, desactivarProducto } from '../../services/productService'

/**
 * User Story #16: Listar, buscar y filtrar productos
 * Funcionalidades:
 * - Búsqueda parcial insensible a mayúsculas
 * - Filtros combinables por estado, aprobación, rango de precio
 * - Paginación (máximo 20 por página)
 * - Ordenamiento por diferentes criterios
 */
const ProductList = ({ onEditarProducto = null, onEliminarProducto = null }) => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(false)
  const [totalProductos, setTotalProductos] = useState(0)
  const [paginaActual, setPaginaActual] = useState(1)

  // Filtros y búsqueda - US#16
  const [busqueda, setBusqueda] = useState('')
  const [filtros, setFiltros] = useState({
    estado: '',
    aprobado: '',
    precioMin: '',
    precioMax: '',
    ordenamiento: '-creado_en'
  })

  useEffect(() => {
    cargarProductos()
  }, [paginaActual, filtros])

  const cargarProductos = async () => {
    setLoading(true)
    try {
      const params = {
        search: busqueda,
        estado: filtros.estado,
        aprobado: filtros.aprobado === '' ? '' : filtros.aprobado === 'true',
        precioMin: filtros.precioMin,
        precioMax: filtros.precioMax,
        ordering: filtros.ordenamiento,
        page: paginaActual
      }

      // Limpiar parámetros vacíos
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null) {
          delete params[key]
        }
      })

      const response = await buscarProductos(params)
      setProductos(response.data.results)
      setTotalProductos(response.data.count)
    } catch (error) {
      console.error('Error al cargar productos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value)
    setPaginaActual(1) // Resetear a primera página
  }

  const handleFiltroChange = (e) => {
    const { name, value } = e.target
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }))
    setPaginaActual(1)
  }

  const limpiarFiltros = () => {
    setBusqueda('')
    setFiltros({
      estado: '',
      aprobado: '',
      precioMin: '',
      precioMax: '',
      ordenamiento: '-creado_en'
    })
    setPaginaActual(1)
  }

  const handlePublicar = async (productoId) => {
    try {
      await publicarProducto(productoId)
      cargarProductos()
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || 'No se pudo publicar el producto'))
    }
  }

  const handleDesactivar = async (productoId) => {
    if (window.confirm('¿Desactivar este producto?')) {
      try {
        await desactivarProducto(productoId)
        cargarProductos()
      } catch (error) {
        console.error('Error al desactivar:', error)
      }
    }
  }

  const totalPaginas = Math.ceil(totalProductos / 20)

  return (
    <div className="product-list">
      {/* FILTROS Y BÚSQUEDA - US#16 */}
      <div className="filters-section">
        <h3>Filtros de Búsqueda</h3>

        <div className="filter-group">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={handleBusqueda}
            className="search-input"
          />
        </div>

        <div className="filters-row">
          <div className="filter-item">
            <label htmlFor="estado">Estado</label>
            <select
              id="estado"
              name="estado"
              value={filtros.estado}
              onChange={handleFiltroChange}
              className="form-control"
            >
              <option value="">Todos</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="aprobado">Aprobación</label>
            <select
              id="aprobado"
              name="aprobado"
              value={filtros.aprobado}
              onChange={handleFiltroChange}
              className="form-control"
            >
              <option value="">Todos</option>
              <option value="true">Aprobado</option>
              <option value="false">No Aprobado</option>
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="precioMin">Precio Mínimo</label>
            <input
              type="number"
              id="precioMin"
              name="precioMin"
              value={filtros.precioMin}
              onChange={handleFiltroChange}
              placeholder="Desde"
              className="form-control"
              min="0"
            />
          </div>

          <div className="filter-item">
            <label htmlFor="precioMax">Precio Máximo</label>
            <input
              type="number"
              id="precioMax"
              name="precioMax"
              value={filtros.precioMax}
              onChange={handleFiltroChange}
              placeholder="Hasta"
              className="form-control"
              min="0"
            />
          </div>

          <div className="filter-item">
            <label htmlFor="ordenamiento">Ordenar Por</label>
            <select
              id="ordenamiento"
              name="ordenamiento"
              value={filtros.ordenamiento}
              onChange={handleFiltroChange}
              className="form-control"
            >
              <option value="-creado_en">Más Recientes</option>
              <option value="creado_en">Más Antiguos</option>
              <option value="nombre">Nombre (A-Z)</option>
              <option value="-nombre">Nombre (Z-A)</option>
              <option value="precio_base">Precio (Menor)</option>
              <option value="-precio_base">Precio (Mayor)</option>
              <option value="-aprobado">Aprobados Primero</option>
            </select>
          </div>

          <button
            type="button"
            onClick={limpiarFiltros}
            className="btn btn-secondary"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* RESULTADOS */}
      <div className="results-section">
        <div className="results-header">
          <h3>Productos ({totalProductos})</h3>
          {loading && <small>Cargando...</small>}
        </div>

        {productos.length > 0 ? (
          <>
            <table className="products-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Variantes</th>
                  <th>Estado</th>
                  <th>Aprobado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map(producto => (
                  <tr key={producto.id} className={`row-${producto.estado}`}>
                    <td className="image-cell">
                      {producto.imagen_principal ? (
                        <img src={producto.imagen_principal} alt={producto.nombre} />
                      ) : (
                        <span className="no-image">Sin imagen</span>
                      )}
                    </td>
                    <td className="name-cell">
                      <strong>{producto.nombre}</strong>
                    </td>
                    <td className="price-cell">
                      ${parseFloat(producto.precio_base).toLocaleString('es-CO', { 
                        minimumFractionDigits: 2 
                      })}
                    </td>
                    <td className="variants-cell">
                      {producto.variantes_count}
                    </td>
                    <td className="estado-cell">
                      <span className={`badge badge-${producto.estado}`}>
                        {producto.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="approval-cell">
                      <span className={`badge ${producto.aprobado ? 'badge-success' : 'badge-warning'}`}>
                        {producto.aprobado ? '✓ Aprobado' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <div className="action-buttons">
                        {onEditarProducto && (
                          <button
                            onClick={() => onEditarProducto(producto.id)}
                            className="btn btn-sm btn-info"
                            title="Editar"
                          >
                            ✎
                          </button>
                        )}

                        {producto.estado === 'inactivo' && (
                          <button
                            onClick={() => handlePublicar(producto.id)}
                            className="btn btn-sm btn-success"
                            title="Publicar"
                          >
                            ✓
                          </button>
                        )}

                        {producto.estado === 'activo' && (
                          <button
                            onClick={() => handleDesactivar(producto.id)}
                            className="btn btn-sm btn-warning"
                            title="Desactivar"
                          >
                            ✕
                          </button>
                        )}

                        {onEliminarProducto && (
                          <button
                            onClick={() => onEliminarProducto(producto.id)}
                            className="btn btn-sm btn-danger"
                            title="Eliminar"
                          >
                            🗑
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAGINACIÓN - US#16 */}
            {totalPaginas > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
                  disabled={paginaActual === 1}
                  className="btn btn-sm"
                >
                  ← Anterior
                </button>

                <div className="page-numbers">
                  {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                    const pagina = i + 1
                    return (
                      <button
                        key={pagina}
                        onClick={() => setPaginaActual(pagina)}
                        className={`btn btn-sm ${paginaActual === pagina ? 'active' : ''}`}
                      >
                        {pagina}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => setPaginaActual(Math.min(totalPaginas, paginaActual + 1))}
                  disabled={paginaActual === totalPaginas}
                  className="btn btn-sm"
                >
                  Siguiente →
                </button>

                <small className="page-info">
                  Página {paginaActual} de {totalPaginas} ({totalProductos} total)
                </small>
              </div>
            )}
          </>
        ) : (
          <div className="alert alert-info">
            {loading ? 'Cargando productos...' : 'No hay productos que coincidan con los filtros'}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductList
