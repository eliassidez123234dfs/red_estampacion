// ============================================
// CATÁLOGO DE PRODUCTOS - CLIENTE
// JavaScript para RF-023 a RF-037
// ============================================

class Catalogo {
    constructor() {
        this.productos = [];
        this.productosFiltrados = [];
        this.categorias = [];
        this.filtros = {
            busqueda: '',
            categorias: [],
            precioMin: null,
            precioMax: null,
            colores: [],
            tallas: [],
            soloStock: true,
            orden: 'fecha_desc'
        };
        this.paginaActual = 1;
        this.productosPorPagina = 12;
        
        this.init();
    }

    init() {
        // Inicializar mock data (usa init o inicializar)
        if (typeof MockData.inicializar === 'function') {
            MockData.inicializar();
        } else {
            MockData.init();
        }
        
        // Cargar datos
        this.cargarProductos();
        this.cargarCategorias();
        this.cargarFiltrosDinamicos();
        
        // Bind events
        this.bindEvents();
        
        // Renderizar productos iniciales
        this.aplicarFiltros();
        
        // Actualizar contador del carrito
        this.actualizarContadorCarrito();
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================
    
    bindEvents() {
        // Búsqueda (RF-031)
        document.getElementById('buscarProducto')?.addEventListener('input', (e) => {
            this.filtros.busqueda = e.target.value.toLowerCase();
            this.paginaActual = 1;
            this.aplicarFiltros();
        });

        // Limpiar filtros
        document.getElementById('limpiarFiltros')?.addEventListener('click', () => this.limpiarFiltros());
        document.getElementById('btnLimpiarFiltrosEmpty')?.addEventListener('click', () => this.limpiarFiltros());

        // Precio (RF-025)
        document.getElementById('aplicarPrecio')?.addEventListener('click', () => {
            this.filtros.precioMin = parseFloat(document.getElementById('precioMin').value) || null;
            this.filtros.precioMax = parseFloat(document.getElementById('precioMax').value) || null;
            this.paginaActual = 1;
            this.aplicarFiltros();
        });

        // Stock (RF-028)
        document.getElementById('soloStock')?.addEventListener('change', (e) => {
            this.filtros.soloStock = e.target.checked;
            this.paginaActual = 1;
            this.aplicarFiltros();
        });

        // Ordenamiento (RF-032, RF-033)
        document.getElementById('ordenarPor')?.addEventListener('change', (e) => {
            this.filtros.orden = e.target.value;
            this.aplicarFiltros();
        });

        // Paginación (RF-034, RF-035)
        document.getElementById('btnPrevPage')?.addEventListener('click', () => this.cambiarPagina(-1));
        document.getElementById('btnNextPage')?.addEventListener('click', () => this.cambiarPagina(1));
    }

    // ============================================
    // CARGAR DATOS
    // ============================================
    
    cargarProductos() {
        // RF-023: Cargar solo productos aprobados y activos
        const todosProductos = MockData.getProductos();
        this.productos = todosProductos.filter(p => p.aprobado && p.activo && !p.eliminado);
    }

    cargarCategorias() {
        this.categorias = MockData.getCategorias();
    }

    cargarFiltrosDinamicos() {
        // Cargar categorías (RF-024)
        this.renderizarCategorias();
        
        // Cargar colores disponibles (RF-026)
        this.renderizarColores();
        
        // Cargar tallas disponibles (RF-027)
        this.renderizarTallas();
    }

    renderizarCategorias() {
        const container = document.getElementById('categoriasFiltro');
        if (!container) return;

        const html = this.categorias.map(cat => {
            const count = this.productos.filter(p => p.categoria_id === cat.id).length;
            return `
                <label class="checkbox-label">
                    <input type="checkbox" class="filtro-categoria" value="${cat.id}" 
                           ${this.filtros.categorias.includes(cat.id) ? 'checked' : ''}>
                    <span>${cat.nombre} (${count})</span>
                </label>
            `;
        }).join('');

        container.innerHTML = html;

        // Bind events
        container.querySelectorAll('.filtro-categoria').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const categoriaId = parseInt(e.target.value);
                if (e.target.checked) {
                    this.filtros.categorias.push(categoriaId);
                } else {
                    this.filtros.categorias = this.filtros.categorias.filter(id => id !== categoriaId);
                }
                this.paginaActual = 1;
                this.aplicarFiltros();
            });
        });
    }

    renderizarColores() {
        const container = document.getElementById('coloresFiltro');
        if (!container) return;

        // Obtener colores únicos de todas las variantes
        const coloresMap = new Map();
        
        this.productos.forEach(producto => {
            const variantes = MockData.getVariantes(producto.id);
            variantes.forEach(v => {
                const key = v.color_hex;
                if (!coloresMap.has(key)) {
                    coloresMap.set(key, {
                        hex: v.color_hex,
                        nombre: v.color_nombre,
                        count: 0
                    });
                }
                coloresMap.get(key).count++;
            });
        });

        const colores = Array.from(coloresMap.values());

        const html = colores.map(color => `
            <div class="color-filter ${this.filtros.colores.includes(color.hex) ? 'active' : ''}" 
                 style="background-color: ${color.hex}"
                 data-color="${color.hex}"
                 data-count="${color.count}"
                 title="${color.nombre}">
            </div>
        `).join('');

        container.innerHTML = html;

        // Bind events
        container.querySelectorAll('.color-filter').forEach(colorDiv => {
            colorDiv.addEventListener('click', (e) => {
                const colorHex = e.currentTarget.dataset.color;
                
                if (this.filtros.colores.includes(colorHex)) {
                    this.filtros.colores = this.filtros.colores.filter(c => c !== colorHex);
                    e.currentTarget.classList.remove('active');
                } else {
                    this.filtros.colores.push(colorHex);
                    e.currentTarget.classList.add('active');
                }
                
                this.paginaActual = 1;
                this.aplicarFiltros();
            });
        });
    }

    renderizarTallas() {
        const container = document.getElementById('tallasFiltro');
        if (!container) return;

        // Obtener tallas únicas
        const tallasSet = new Set();
        this.productos.forEach(producto => {
            const variantes = MockData.getVariantes(producto.id);
            variantes.forEach(v => tallasSet.add(v.talla));
        });

        const tallas = Array.from(tallasSet).sort();

        const html = tallas.map(talla => `
            <div class="size-filter ${this.filtros.tallas.includes(talla) ? 'active' : ''}" 
                 data-talla="${talla}">
                ${talla}
            </div>
        `).join('');

        container.innerHTML = html;

        // Bind events
        container.querySelectorAll('.size-filter').forEach(tallaDiv => {
            tallaDiv.addEventListener('click', (e) => {
                const talla = e.currentTarget.dataset.talla;
                
                if (this.filtros.tallas.includes(talla)) {
                    this.filtros.tallas = this.filtros.tallas.filter(t => t !== talla);
                    e.currentTarget.classList.remove('active');
                } else {
                    this.filtros.tallas.push(talla);
                    e.currentTarget.classList.add('active');
                }
                
                this.paginaActual = 1;
                this.aplicarFiltros();
            });
        });
    }

    // ============================================
    // FILTRADO Y ORDENAMIENTO
    // ============================================
    
    aplicarFiltros() {
        let productos = [...this.productos];

        // Filtro de búsqueda (RF-031)
        if (this.filtros.busqueda) {
            productos = productos.filter(p => 
                p.nombre.toLowerCase().includes(this.filtros.busqueda) ||
                p.descripcion.toLowerCase().includes(this.filtros.busqueda)
            );
        }

        // Filtro de categorías (RF-024)
        if (this.filtros.categorias.length > 0) {
            productos = productos.filter(p => 
                this.filtros.categorias.includes(p.categoria_id)
            );
        }

        // Filtro de precio (RF-025)
        if (this.filtros.precioMin !== null) {
            productos = productos.filter(p => p.precio_base >= this.filtros.precioMin);
        }
        if (this.filtros.precioMax !== null) {
            productos = productos.filter(p => p.precio_base <= this.filtros.precioMax);
        }

        // Filtro de colores (RF-026)
        if (this.filtros.colores.length > 0) {
            productos = productos.filter(p => {
                const variantes = MockData.getVariantes(p.id);
                return variantes.some(v => this.filtros.colores.includes(v.color_hex));
            });
        }

        // Filtro de tallas (RF-027)
        if (this.filtros.tallas.length > 0) {
            productos = productos.filter(p => {
                const variantes = MockData.getVariantes(p.id);
                return variantes.some(v => this.filtros.tallas.includes(v.talla));
            });
        }

        // Filtro de stock (RF-028)
        if (this.filtros.soloStock) {
            productos = productos.filter(p => {
                const stockTotal = MockData.getStockTotal(p.id);
                return stockTotal > 0;
            });
        }

        // Ordenamiento (RF-032, RF-033)
        productos = this.ordenarProductos(productos);

        this.productosFiltrados = productos;
        this.renderizarProductos();
        this.renderizarPaginacion();
    }

    ordenarProductos(productos) {
        const orden = this.filtros.orden;

        switch (orden) {
            case 'fecha_desc':
                return productos.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
            case 'fecha_asc':
                return productos.sort((a, b) => new Date(a.fecha_creacion) - new Date(b.fecha_creacion));
            case 'nombre_asc':
                return productos.sort((a, b) => a.nombre.localeCompare(b.nombre));
            case 'nombre_desc':
                return productos.sort((a, b) => b.nombre.localeCompare(a.nombre));
            case 'precio_asc':
                return productos.sort((a, b) => a.precio_base - b.precio_base);
            case 'precio_desc':
                return productos.sort((a, b) => b.precio_base - a.precio_base);
            default:
                return productos;
        }
    }

    limpiarFiltros() {
        // Resetear filtros
        this.filtros = {
            busqueda: '',
            categorias: [],
            precioMin: null,
            precioMax: null,
            colores: [],
            tallas: [],
            soloStock: true,
            orden: 'fecha_desc'
        };

        // Limpiar inputs
        document.getElementById('buscarProducto').value = '';
        document.getElementById('precioMin').value = '';
        document.getElementById('precioMax').value = '';
        document.getElementById('soloStock').checked = true;
        document.getElementById('ordenarPor').value = 'fecha_desc';

        // Recargar filtros dinámicos
        this.cargarFiltrosDinamicos();

        // Aplicar filtros
        this.paginaActual = 1;
        this.aplicarFiltros();
    }

    // ============================================
    // RENDERIZADO
    // ============================================
    
    renderizarProductos() {
        const container = document.getElementById('productosGrid');
        const emptyState = document.getElementById('emptyState');
        
        if (!container) return;

        // Actualizar contador de resultados
        document.getElementById('resultadosCount').textContent = 
            `${this.productosFiltrados.length} producto${this.productosFiltrados.length !== 1 ? 's' : ''} encontrado${this.productosFiltrados.length !== 1 ? 's' : ''}`;

        if (this.productosFiltrados.length === 0) {
            container.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');

        // Paginación
        const inicio = (this.paginaActual - 1) * this.productosPorPagina;
        const fin = inicio + this.productosPorPagina;
        const productosPagina = this.productosFiltrados.slice(inicio, fin);

        const html = productosPagina.map(producto => this.renderizarProductoCard(producto)).join('');
        container.innerHTML = html;

        // Bind events a los botones
        container.querySelectorAll('.btn-ver-detalle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productoId = parseInt(e.target.dataset.id);
                this.verDetalleProducto(productoId);
            });
        });
    }

    renderizarProductoCard(producto) {
        const variantes = MockData.getVariantes(producto.id);
        const stockTotal = MockData.getStockTotal(producto.id);
        const imagen = MockData.getImagenPrincipal(producto.id);

        // Obtener colores únicos
        const coloresUnicos = [...new Set(variantes.map(v => v.color_hex))];
        
        // Obtener tallas únicas
        const tallasUnicas = [...new Set(variantes.map(v => v.talla))].sort();

        // Estado de stock
        let stockClass = 'stock-out';
        let stockText = 'Sin stock';
        if (stockTotal > 10) {
            stockClass = 'stock-available';
            stockText = 'Disponible';
        } else if (stockTotal > 0) {
            stockClass = 'stock-low';
            stockText = `Stock: ${stockTotal}`;
        }

        return `
            <div class="product-card">
                <img src="${imagen?.ruta_imagen || 'https://via.placeholder.com/250'}" 
                     alt="${producto.nombre}" 
                     class="product-image">
                
                <div class="product-info">
                    <h3 class="product-name">${producto.nombre}</h3>
                    <p class="product-description">${producto.descripcion}</p>
                    
                    <div class="product-meta">
                        ${coloresUnicos.length > 0 ? `
                            <div class="product-colors">
                                ${coloresUnicos.slice(0, 5).map(color => 
                                    `<div class="color-dot" style="background-color: ${color}" title="${color}"></div>`
                                ).join('')}
                                ${coloresUnicos.length > 5 ? `<span class="size-badge">+${coloresUnicos.length - 5}</span>` : ''}
                            </div>
                        ` : ''}
                        
                        ${tallasUnicas.length > 0 ? `
                            <div class="product-sizes">
                                ${tallasUnicas.slice(0, 4).map(talla => 
                                    `<span class="size-badge">${talla}</span>`
                                ).join('')}
                                ${tallasUnicas.length > 4 ? `<span class="size-badge">+${tallasUnicas.length - 4}</span>` : ''}
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="product-footer">
                        <span class="product-price">$${producto.precio_base.toLocaleString('es-CO')}</span>
                        <span class="product-stock ${stockClass}">${stockText}</span>
                    </div>

                    <div class="product-actions">
                        <button class="btn-ver-detalle" data-id="${producto.id}">
                            Ver detalle
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // ============================================
    // PAGINACIÓN (RF-034, RF-035)
    // ============================================
    
    renderizarPaginacion() {
        const totalPaginas = Math.ceil(this.productosFiltrados.length / this.productosPorPagina);
        
        // Botones anterior/siguiente
        document.getElementById('btnPrevPage').disabled = this.paginaActual === 1;
        document.getElementById('btnNextPage').disabled = this.paginaActual === totalPaginas || totalPaginas === 0;

        // Números de página
        const pagesContainer = document.getElementById('paginationPages');
        if (!pagesContainer) return;

        let html = '';
        for (let i = 1; i <= totalPaginas; i++) {
            // Mostrar solo algunas páginas
            if (i === 1 || i === totalPaginas || (i >= this.paginaActual - 1 && i <= this.paginaActual + 1)) {
                html += `
                    <div class="page-number ${i === this.paginaActual ? 'active' : ''}" data-page="${i}">
                        ${i}
                    </div>
                `;
            } else if (i === this.paginaActual - 2 || i === this.paginaActual + 2) {
                html += '<span>...</span>';
            }
        }

        pagesContainer.innerHTML = html;

        // Bind events
        pagesContainer.querySelectorAll('.page-number').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.paginaActual = parseInt(e.target.dataset.page);
                this.renderizarProductos();
                this.renderizarPaginacion();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    cambiarPagina(direccion) {
        const totalPaginas = Math.ceil(this.productosFiltrados.length / this.productosPorPagina);
        
        this.paginaActual += direccion;
        
        if (this.paginaActual < 1) this.paginaActual = 1;
        if (this.paginaActual > totalPaginas) this.paginaActual = totalPaginas;
        
        this.renderizarProductos();
        this.renderizarPaginacion();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ============================================
    // NAVEGACIÓN (RF-036, RF-037)
    // ============================================
    
    verDetalleProducto(productoId) {
        // Guardar ID en sessionStorage para la página de detalle
        sessionStorage.setItem('producto_detalle_id', productoId);
        
        // Navegar a la página de detalle (RF-037)
        window.location.href = '../productos/index.html';
    }

    // ============================================
    // CARRITO
    // ============================================
    
    actualizarContadorCarrito() {
        const carrito = MockData.getCarrito();
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
    }
}

// Inicializar cuando se carga la página
let catalogo;
document.addEventListener('DOMContentLoaded', () => {
    catalogo = new Catalogo();
});
