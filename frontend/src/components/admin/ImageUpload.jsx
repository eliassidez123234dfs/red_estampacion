import React, { useState, useRef } from 'react'
import './ImageUpload.scss'
import { agregarImagen, hacerImagenPrincipal, reordenarImagenes } from '../../services/productService'

/**
 * User Story #11: Componente para subir imágenes
 * Validaciones:
 * - Formato JPG/PNG
 * - Tamaño máximo 2MB
 * - Resolución mínima 400x400 píxeles
 * - Máximo 5 imágenes por producto
 * - Siempre debe existir una imagen principal
 */
const ImageUpload = ({ productoId, imagenes = [], onImagenAgregada = null }) => {
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [errores, setErrores] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const validarArchivo = (archivo) => {
    const erroresValidacion = []

    // Validar extensión (JPG/PNG) - US#11
    const extensionesValidas = ['image/jpeg', 'image/png']
    if (!extensionesValidas.includes(archivo.type)) {
      erroresValidacion.push('Solo se permiten imágenes JPG y PNG')
    }

    // Validar tamaño (máximo 2MB) - US#11
    const tamahoMaximo = 2 * 1024 * 1024
    if (archivo.size > tamahoMaximo) {
      erroresValidacion.push('El tamaño de la imagen no debe exceder 2MB')
    }

    return erroresValidacion
  }

  const validarResolucion = (image) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        if (img.width < 400 || img.height < 400) {
          resolve('La resolución mínima debe ser 400x400 píxeles')
        } else {
          resolve(null)
        }
      }
      img.onerror = () => resolve('Error al cargar la imagen')
      img.src = URL.createObjectURL(image)
    })
  }

  const handleFileChange = async (e) => {
    const archivo = e.target.files[0]
    if (!archivo) return

    setErrores('')
    setSuccessMessage('')

    // Validar errores iniciales
    const erroresArchivo = validarArchivo(archivo)
    if (erroresArchivo.length > 0) {
      setErrores(erroresArchivo.join(', '))
      return
    }

    // Validar resolución - US#11
    const errorResolucion = await validarResolucion(archivo)
    if (errorResolucion) {
      setErrores(errorResolucion)
      return
    }

    // Subir imagen
    await subirImagen(archivo)
  }

  const subirImagen = async (archivo) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('archivo', archivo)
      formData.append('es_principal', imagenes.length === 0) // Primera imagen es principal
      formData.append('orden', imagenes.length)
      formData.append('descripcion', `Imagen ${imagenes.length + 1}`)

      const response = await agregarImagen(productoId, formData)
      setSuccessMessage('Imagen subida exitosamente')

      if (onImagenAgregada) {
        onImagenAgregada(response.data)
      }

      // Limpiar input
      fileInputRef.current.value = ''

      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      const mensaje = error.response?.data?.error || 
                     error.response?.data?.archivo?.[0] ||
                     'Error al subir la imagen'
      setErrores(mensaje)
      console.error('Error al subir imagen:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleHacerPrincipal = async (imagenId) => {
    try {
      await hacerImagenPrincipal(imagenId)
      setSuccessMessage('Imagen principal actualizada')
      if (onImagenAgregada) {
        onImagenAgregada(null) // Trigger para refrescar
      }
    } catch (error) {
      setErrores('Error al actualizar imagen principal')
      console.error('Error:', error)
    }
  }

  return (
    <div className="image-upload">
      <h3>Gestión de Imágenes {imagenes.length}/5</h3>

      {errores && (
        <div className="alert alert-danger">{errores}</div>
      )}

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      <div className="upload-area">
        <input
          ref={fileInputRef}
          type="file"
          id="file-input"
          accept=".jpg,.jpeg,.png"
          onChange={handleFileChange}
          disabled={loading || imagenes.length >= 5}
          className="file-input"
        />

        <label htmlFor="file-input" className="upload-label">
          <div className="upload-icon">📸</div>
          <div className="upload-text">
            {loading ? 'Subiendo...' : 'Haz clic para seleccionar imagen'}
          </div>
          <small>
            JPG/PNG, máx 2MB, mín 400x400 píxeles
          </small>
        </label>
      </div>

      {imagenes.length > 0 && (
        <div className="gallery">
          <h4>Galería ({imagenes.length}/5)</h4>
          <div className="gallery-grid">
            {imagenes.map((imagen, idx) => (
              <div key={imagen.id} className="gallery-item">
                <img src={imagen.archivo} alt={imagen.descripcion} />
                
                <div className="image-controls">
                  {!imagen.es_principal && (
                    <button
                      type="button"
                      onClick={() => handleHacerPrincipal(imagen.id)}
                      className="btn-small"
                      title="Hacer principal"
                    >
                      ★
                    </button>
                  )}
                  
                  {imagen.es_principal && (
                    <span className="badge badge-primary">Principal</span>
                  )}
                </div>

                <small>Orden: {idx + 1}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      {imagenes.length >= 5 && (
        <div className="alert alert-warning">
          Has alcanzado el límite máximo de 5 imágenes
        </div>
      )}

      <small className="form-hint">
        * La primera imagen se marcará como principal automáticamente.
        * Todas las imágenes deben estar en formato JPG o PNG.
        * El tamaño máximo por imagen es 2MB.
        * La resolución mínima es 400x400 píxeles.
      </small>
    </div>
  )
}

export default ImageUpload
