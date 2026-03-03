import React, { useState, useEffect } from 'react'
import './VariantManager.scss'
import { 
  agregarVariante, 
  obtenerVariantes, 
  actualizarVariante, 
  eliminarVariante 
} from '../../services/productService'

/**
 * User Story #12: Gestor de variantes de talla/color
 * Validaciones:
 * - Combinaciones únicas (talla + color) por producto
 * - Stock >= 0
 * - Máximo 4 tallas y 10 colores por producto
 */
const VariantManager = ({ productoId, onVarianteAgregada = null }) => {
  const [variantes, setVariantes] = useState([])
  const [loading, setLoading] = useState(false)
  const [errores, setErrores] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  const TALLAS = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const COLORES = [
    'blanco', 'negro', 'rojo', 'azul', 'verde', 
    'amarillo', 'rosa', 'gris', 'naranja', 'morado'
  ]

  const [formData, setFormData] = useState({
    talla: 'M',
    color: 'negro',
    stock: 0,
    precio_variante: ''
  })

  useEffect(() => {
    cargarVariantes()
  }, [productoId])

  const cargarVariantes = async () => {
    try {
      const response = await obtenerVariantes(productoId)
      setVariantes(response.data.results)
    } catch (error) {
      console.error('Error al cargar variantes:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  const validarFormulario = () => {
    const nuevosErrores = {}

    // Validar que no exista la combinación - US#12
    const combinacionExiste = variantes.some(v =>
      v.talla === formData.talla && v.color === formData.color
    )

    if (combinacionExiste) {
      nuevosErrores.combinacion = `La combinación ${formData.talla}-${formData.color} ya existe`
    }

    // Validar stock - US#12
    const stock = parseInt(formData.stock)
    if (stock < 0) {
      nuevosErrores.stock = 'El stock no puede ser negativo'
    }

    // Validar límite de tallas - US#12
    const tallasUniquement = new Set(variantes.map(v => v.talla)).size + 1
    if (tallasUniquement > 4) {
      nuevosErrores.talla = 'Máximo 4 tallas diferentes por producto'
    }

    // Validar límite de colores - US#12
    const coloresUniquement = new Set(variantes.map(v => v.color)).size + 1
    if (coloresUniquement > 10) {
      nuevosErrores.color = 'Máximo 10 colores diferentes por producto'
    }

    return nuevosErrores
  }

  const handleAgregarVariante = async (e) => {
    e.preventDefault()

    const nuevosErrores = validarFormulario()
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }

    setLoading(true)
    try {
      const payload = {
        talla: formData.talla,
        color: formData.color,
        stock: parseInt(formData.stock),
        precio_variante: formData.precio_variante ? parseFloat(formData.precio_variante) : null
      }

      const response = await agregarVariante(productoId, payload)
      
      setVariantes([...variantes, response.data])
      setFormData({
        talla: 'M',
        color: 'negro',
        stock: 0,
        precio_variante: ''
      })
      setErrores({})
      setSuccessMessage('Variante agregada exitosamente')
      
      if (onVarianteAgregada) {
        onVarianteAgregada(response.data)
      }

      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      const apiErrors = error.response?.data || {}
      setErrores(apiErrors)
      console.error('Error al agregar variante:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleActualizarStock = async (varianteId, nuevoStock) => {
    try {
      await actualizarVariante(varianteId, { stock: nuevoStock })
      setVariantes(variantes.map(v =>
        v.id === varianteId ? { ...v, stock: nuevoStock } : v
      ))
      setSuccessMessage('Stock actualizado')
      setTimeout(() => setSuccessMessage(''), 2000)
    } catch (error) {
      console.error('Error al actualizar stock:', error)
    }
  }

  const handleEliminarVariante = async (varianteId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta variante?')) {
      try {
        await eliminarVariante(varianteId)
        setVariantes(variantes.filter(v => v.id !== varianteId))
        setSuccessMessage('Variante eliminada')
        setTimeout(() => setSuccessMessage(''), 2000)
      } catch (error) {
        console.error('Error al eliminar variante:', error)
      }
    }
  }

  const tallasUsadas = new Set(variantes.map(v => v.talla)).size
  const coloresUsados = new Set(variantes.map(v => v.color)).size

  return (
    <div className="variant-manager">
      <h3>Gestión de Variantes</h3>

      {errores.combinacion && (
        <div className="alert alert-danger">{errores.combinacion}</div>
      )}

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      <form onSubmit={handleAgregarVariante} className="variant-form">
        <div className="form-row">
          <div className="form-group col-md-3">
            <label htmlFor="talla">Talla *</label>
            <select
              id="talla"
              name="talla"
              value={formData.talla}
              onChange={handleChange}
              className="form-control"
            >
              {TALLAS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {tallasUsadas >= 4 && (
              <small className="text-warning">Has usado 4 de 4 tallas disponibles</small>
            )}
          </div>

          <div className="form-group col-md-3">
            <label htmlFor="color">Color *</label>
            <select
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="form-control"
            >
              {COLORES.map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
            {coloresUsados >= 10 && (
              <small className="text-warning">Has usado 10 de 10 colores disponibles</small>
            )}
          </div>

          <div className="form-group col-md-3">
            <label htmlFor="stock">Stock *</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Stock >= 0"
              className={errores.stock ? 'form-control error' : 'form-control'}
              min="0"
            />
            {errores.stock && (
              <small className="text-danger">{errores.stock}</small>
            )}
          </div>

          <div className="form-group col-md-2">
            <label htmlFor="precio_variante">Precio (opt.)</label>
            <input
              type="number"
              id="precio_variante"
              name="precio_variante"
              value={formData.precio_variante}
              onChange={handleChange}
              placeholder="O usa precio base"
              className="form-control"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Agregando...' : 'Agregar Variante'}
          </button>
        </div>
      </form>

      {variantes.length > 0 ? (
        <div className="variants-table">
          <h4>Variantes Actuales ({variantes.length})</h4>
          <table className="table">
            <thead>
              <tr>
                <th>Talla</th>
                <th>Color</th>
                <th>Stock</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {variantes.map(variante => (
                <tr key={variante.id}>
                  <td>{variante.talla}</td>
                  <td>
                    <span className="color-badge" style={{
                      backgroundColor: obtenerColorHex(variante.color)
                    }}>
                      {variante.color}
                    </span>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={variante.stock}
                      onChange={(e) => handleActualizarStock(variante.id, parseInt(e.target.value))}
                      min="0"
                      style={{ width: '70px' }}
                    />
                  </td>
                  <td>${variante.precio_mostrado}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleEliminarVariante(variante.id)}
                      className="btn btn-sm btn-danger"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-info">
          No hay variantes aún. Agrega la primera variante arriba.
        </div>
      )}

      <small className="form-hint">
        * Talla y Color son requeridos.
        * Las combinaciones talla-color deben ser únicas.
        * Máximo 4 tallas y 10 colores por producto.
        * El producto necesita al menos 1 variante con stock &gt; 0 para publicarse.
      </small>
    </div>
  )
}

// Función auxiliar para obtener color hexadecimal
function obtenerColorHex(color) {
  const coloresMap = {
    'blanco': '#FFFFFF',
    'negro': '#000000',
    'rojo': '#FF0000',
    'azul': '#0000FF',
    'verde': '#00AA00',
    'amarillo': '#FFFF00',
    'rosa': '#FF69B4',
    'gris': '#888888',
    'naranja': '#FFA500',
    'morado': '#800080'
  }
  return coloresMap[color] || '#CCCCCC'
}

export default VariantManager
