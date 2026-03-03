import React, { useState } from 'react'
import './App.css'
import ProductForm from './components/admin/ProductForm'
import ImageUpload from './components/admin/ImageUpload'
import VariantManager from './components/admin/VariantManager'
import ProductList from './components/admin/ProductList'
import Catalog from './components/client/Catalog'
import ProductDetail from './components/client/ProductDetail'

/**
 * Aplicación principal RED Estampación
 * Integra módulos de administrador y cliente
 */
function App() {
  const [view, setView] = useState('catalog') // admin-list, admin-create, admin-edit, catalog, product-detail
  const [productoActual, setProductoActual] = useState(null)
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)

  const handleProductoSeleccionado = (productoId) => {
    setProductoSeleccionado(productoId)
    setView('product-detail')
  }

  const handleVolver = () => {
    setProductoSeleccionado(null)
    setView('catalog')
  }

  return (
    <div className="app">
      {/* NAVEGACIÓN PRINCIPAL */}
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="logo">RED Estampación</h1>
          <div className="nav-links">
            <button
              onClick={() => setView('catalog')}
              className={view.includes('catalog') || view.includes('product-detail') ? 'active' : ''}
            >
              Catálogo
            </button>
            <button
              onClick={() => setView('admin-list')}
              className={view.includes('admin') ? 'active' : ''}
            >
              Admin
            </button>
          </div>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">
        {/* VISTA: CATÁLOGO CLIENTE */}
        {view === 'catalog' && (
          <Catalog onProductoSeleccionado={handleProductoSeleccionado} />
        )}

        {/* VISTA: DETALLE DE PRODUCTO CLIENTE */}
        {view === 'product-detail' && productoSeleccionado && (
          <ProductDetail productoId={productoSeleccionado} onVolver={handleVolver} />
        )}

        {/* VISTA: LISTA DE PRODUCTOS ADMIN */}
        {view === 'admin-list' && (
          <div className="admin-section">
            <h2>Administración de Productos</h2>
            <ProductList
              onEditarProducto={(id) => {
                setProductoActual(id)
                setView('admin-edit')
              }}
            />
          </div>
        )}

        {/* VISTA: CREAR PRODUCTO ADMIN */}
        {view === 'admin-create' && (
          <div className="admin-section">
            <h2>Crear Nuevo Producto</h2>
            <ProductForm
              onSubmit={(producto) => {
                setProductoActual(producto.id)
                setView('admin-edit')
              }}
              onCancel={() => setView('admin-list')}
            />
          </div>
        )}

        {/* VISTA: EDITAR PRODUCTO ADMIN */}
        {view === 'admin-edit' && productoActual && (
          <div className="admin-section">
            <h2>Editar Producto</h2>
            <div className="edit-container">
              <div className="edit-form">
                <h3>Información del Producto</h3>
                <ProductForm
                  productoId={productoActual}
                  onCancel={() => setView('admin-list')}
                />
              </div>

              <div className="edit-images">
                <h3>Imágenes</h3>
                <ImageUpload
                  productoId={productoActual}
                  onImagenAgregada={() => {}}
                />
              </div>

              <div className="edit-variants">
                <h3>Variantes</h3>
                <VariantManager
                  productoId={productoActual}
                  onVarianteAgregada={() => {}}
                />
              </div>

              <button
                onClick={() => setView('admin-list')}
                className="btn btn-secondary"
              >
                Volver a Lista
              </button>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <p>&copy; 2025 RED Estampación. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}

export default App
