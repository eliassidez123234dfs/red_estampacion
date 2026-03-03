import React, { useState } from 'react'
import './ProductForm.scss'
import { crearProducto, actualizarProducto } from '../../services/productService'

/**
 * User Story #10: Form para crear/editar productos
 * Validaciones:
 * - Nombre único, requerido, máx 100 caracteres
 * - Descripción máx 500 caracteres
 * - Precio base > 0, máx 2 decimales
 */
const ProductForm = ({ productoId = null, onSubmit = null, onCancel = null }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio_base: '',
    categoria: '',
    estado: 'inactivo',
    aprobado: false
  })

  const [errores, setErrores] = useState({})
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Limpiar errores del campo actual
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  const validarFormulario = () => {
    const nuevosErrores = {}

    // Validar nombre - US#10
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido'
    } else if (formData.nombre.length > 100) {
      nuevosErrores.nombre = 'Máximo 100 caracteres'
    }

    // Validar descripción - US#10
    if (formData.descripcion.length > 500) {
      nuevosErrores.descripcion = 'Máximo 500 caracteres'
    }

    // Validar precio base - US#10
    if (!formData.precio_base) {
      nuevosErrores.precio_base = 'El precio es requerido'
    } else if (parseFloat(formData.precio_base) <= 0) {
      nuevosErrores.precio_base = 'El precio debe ser mayor a 0'
    } else if (!/^\d+\.?\d{0,2}$/.test(formData.precio_base)) {
      nuevosErrores.precio_base = 'Máximo 2 decimales'
    }

    return nuevosErrores
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const nuevosErrores = validarFormulario()
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...formData,
        precio_base: parseFloat(formData.precio_base)
      }

      if (productoId) {
        await actualizarProducto(productoId, payload)
        setSuccessMessage('Producto actualizado exitosamente')
      } else {
        const response = await crearProducto(payload)
        setSuccessMessage('Producto creado exitosamente')
        setFormData({
          nombre: '',
          descripcion: '',
          precio_base: '',
          categoria: '',
          estado: 'inactivo',
          aprobado: false
        })
        
        if (onSubmit) {
          onSubmit(response.data)
        }
      }

      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      const apiErrors = error.response?.data || {}
      setErrores(apiErrors)
      console.error('Error al guardar producto:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      <div className="form-group">
        <label htmlFor="nombre">Nombre del Producto *</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Nombre único (máx 100 caracteres)"
          className={errores.nombre ? 'form-control error' : 'form-control'}
          maxLength={100}
        />
        {errores.nombre && (
          <small className="text-danger">{errores.nombre}</small>
        )}
        <small className="text-muted">
          {formData.nombre.length}/100 caracteres
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Descripción del producto (máx 500 caracteres)"
          className={errores.descripcion ? 'form-control error' : 'form-control'}
          maxLength={500}
          rows={4}
        />
        {errores.descripcion && (
          <small className="text-danger">{errores.descripcion}</small>
        )}
        <small className="text-muted">
          {formData.descripcion.length}/500 caracteres
        </small>
      </div>

      <div className="form-row">
        <div className="form-group col-md-6">
          <label htmlFor="precio_base">Precio Base (COP) *</label>
          <input
            type="number"
            id="precio_base"
            name="precio_base"
            value={formData.precio_base}
            onChange={handleChange}
            placeholder="Precio > 0"
            className={errores.precio_base ? 'form-control error' : 'form-control'}
            step="0.01"
            min="0"
          />
          {errores.precio_base && (
            <small className="text-danger">{errores.precio_base}</small>
          )}
        </div>

        <div className="form-group col-md-6">
          <label htmlFor="categoria">Categoría</label>
          <input
            type="text"
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            placeholder="Ej: Básicas, Premium, Deportivas"
            className="form-control"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="estado">Estado</label>
        <select
          id="estado"
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          className="form-control"
        >
          <option value="inactivo">Inactivo</option>
          <option value="activo">Activo</option>
        </select>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            name="aprobado"
            checked={formData.aprobado}
            onChange={handleChange}
          />
          {' '}Aprobado por administrador
        </label>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Guardando...' : 'Guardar Producto'}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
        )}
      </div>

      <small className="form-hint">
        * Los campos marcados con asterisco son obligatorios.
        El producto necesitará al menos una imagen principal y una variante
        para poder publicarse.
      </small>
    </form>
  )
}

export default ProductForm
