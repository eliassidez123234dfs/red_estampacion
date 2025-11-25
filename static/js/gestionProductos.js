// ============================================
// GESTIÓN DE PRODUCTOS - ADMIN
// JavaScript para RF-001 a RF-022
// ============================================

class GestionProductos {
    constructor() {
        this.productos = [];
        this.productoActual = null;
        this.filtros = {
            busqueda: '',
            activo: 'true',
            aprobado: 'true',
            precioMin: null,
            precioMax: null,
            orden: 'fecha_desc'
        };
        this.paginaActual = 1;
        this.productosPorPagina = 20;
        
        this.init();
    }

    init() {
        this.cargarProductos();
        this.bindEvents();
        this.renderizarProductos();
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================
    
    bindEvents() {
        // Menú móvil
        document.getElementById('menuToggle')?.addEventListener('click', () => {
            document.getElementById('navbarNav').classList.toggle('active');
        });

        // Botones crear producto
        document.getElementById('btnNuevoProducto')?.addEventListener('click', () => this.abrirModalCrear());
        document.getElementById('btnCrearDesdeEmpty')?.addEventListener('click', () => this.abrirModalCrear());

        // Modal producto
        document.getElementById('cerrarModal')?.addEventListener('click', () => this.cerrarModal('modalProducto'));
        document.getElementById('cancelarProducto')?.addEventListener('click', () => this.cerrarModal('modalProducto'));
        document.getElementById('formProducto')?.addEventListener('submit', (e) => this.guardarProducto(e));

        // Filtros (RF-007 a RF-010)
        document.getElementById('buscarNombre')?.addEventListener('input', (e) => {
            this.filtros.busqueda = e.target.value;
            this.aplicarFiltros();
        });

        document.getElementById('filtroActivo')?.addEventListener('change', (e) => {
            this.filtros.activo = e.target.value;
            this.aplicarFiltros();
        });

        document.getElementById('filtroAprobado')?.addEventListener('change', (e) => {
            this.filtros.aprobado = e.target.value;
            this.aplicarFiltros();
        });

        document.getElementById('precioMin')?.addEventListener('change', (e) => {
            this.filtros.precioMin = e.target.value ? parseFloat(e.target.value) : null;
            this.aplicarFiltros();
        });

        document.getElementById('precioMax')?.addEventListener('change', (e) => {
            this.filtros.precioMax = e.target.value ? parseFloat(e.target.value) : null;
            this.aplicarFiltros();
        });

        document.getElementById('ordenarPor')?.addEventListener('change', (e) => {
            this.filtros.orden = e.target.value;
            this.aplicarFiltros();
        });

        document.getElementById('limpiarFiltros')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.limpiarFiltros();
        });

        // Validación en tiempo real (RF-006)
        document.getElementById('nombre')?.addEventListener('input', () => this.validarFormulario());
        document.getElementById('descripcion')?.addEventListener('input', (e) => {
            document.getElementById('contadorDescripcion').textContent = e.target.value.length;
            this.validarFormulario();
        });
        document.getElementById('precioBase')?.addEventListener('input', () => this.validarFormulario());

        // Botón agregar variante (RF-004)
        document.getElementById('btnAgregarVariante')?.addEventListener('click', () => this.agregarVariante());

        // Modal eliminar (RF-018, RF-019)
        document.getElementById('cancelarEliminar')?.addEventListener('click', () => this.cerrarModal('modalEliminar'));
        document.getElementById('confirmarEliminar')?.addEventListener('click', () => this.confirmarEliminarProducto());

        // Modal aprobar/desaprobar (RF-020, RF-021)
        document.getElementById('cancelarAprobar')?.addEventListener('click', () => this.cerrarModal('modalAprobar'));
        document.getElementById('confirmarAprobar')?.addEventListener('click', () => this.confirmarAprobar());
        document.getElementById('motivoDesaprobacion')?.addEventListener('input', (e) => {
            document.getElementById('contadorMotivo').textContent = e.target.value.length;
        });
    }

    // ============================================
    // CARGAR Y FILTRAR DATOS (RF-007 a RF-010)
    // ============================================

    cargarProductos() {
        this.productos = MockData.getProductos();
    }

    aplicarFiltros() {
        this.paginaActual = 1;
        this.renderizarProductos();
    }

    limpiarFiltros() {
        this.filtros = {
            busqueda: '',
            activo: 'true',
            aprobado: 'true',
            precioMin: null,
            precioMax: null,
            orden: 'fecha_desc'
        };

        // Resetear campos
        document.getElementById('buscarNombre').value = '';
        document.getElementById('filtroActivo').value = 'true';
        document.getElementById('filtroAprobado').value = 'true';
        document.getElementById('precioMin').value = '';
        document.getElementById('precioMax').value = '';
        document.getElementById('ordenarPor').value = 'fecha_desc';

        this.aplicarFiltros();
    }

    filtrarProductos() {
        let productosFiltrados = [...this.productos];

        // Búsqueda por nombre (RF-007)
        if (this.filtros.busqueda) {
            const busqueda = this.filtros.busqueda.toLowerCase();
            productosFiltrados = productosFiltrados.filter(p => 
                p.nombre.toLowerCase().includes(busqueda) ||
                p.descripcion.toLowerCase().includes(busqueda)
            );
        }

        // Filtro activo (RF-008)
        if (this.filtros.activo !== '') {
            const activo = this.filtros.activo === 'true';
            productosFiltrados = productosFiltrados.filter(p => p.activo === activo);
        }

        // Filtro aprobado (RF-008)
        if (this.filtros.aprobado !== '') {
            const aprobado = this.filtros.aprobado === 'true';
            productosFiltrados = productosFiltrados.filter(p => p.aprobado === aprobado);
        }

        // Filtro precio (RF-009)
        if (this.filtros.precioMin !== null) {
            productosFiltrados = productosFiltrados.filter(p => p.precio_base >= this.filtros.precioMin);
        }
        if (this.filtros.precioMax !== null) {
            productosFiltrados = productosFiltrados.filter(p => p.precio_base <= this.filtros.precioMax);
        }

        // Ordenamiento (RF-010)
        productosFiltrados.sort((a, b) => {
            switch (this.filtros.orden) {
                case 'fecha_desc':
                    return new Date(b.fecha_creacion) - new Date(a.fecha_creacion);
                case 'fecha_asc':
                    return new Date(a.fecha_creacion) - new Date(b.fecha_creacion);
                case 'nombre_asc':
                    return a.nombre.localeCompare(b.nombre);
                case 'nombre_desc':
                    return b.nombre.localeCompare(a.nombre);
                case 'precio_asc':
                    return a.precio_base - b.precio_base;
                case 'precio_desc':
                    return b.precio_base - a.precio_base;
                default:
                    return 0;
            }
        });

        return productosFiltrados;
    }

    // ============================================
    // RENDERIZAR TABLA (RF-007 a RF-022)
    // ============================================

    renderizarProductos() {
        const productosFiltrados = this.filtrarProductos();
        const inicio = (this.paginaActual - 1) * this.productosPorPagina;
        const fin = inicio + this.productosPorPagina;
        const productosPagina = productosFiltrados.slice(inicio, fin);

        // Actualizar contador
        document.getElementById('contadorResultados').textContent = 
            `Mostrando ${inicio + 1}-${Math.min(fin, productosFiltrados.length)} de ${productosFiltrados.length} productos`;

        // Renderizar tabla
        const tbody = document.getElementById('tablaProductos');
        
        if (productosPagina.length === 0) {
            tbody.innerHTML = '';
            document.querySelector('.table-container').style.display = 'none';
            document.getElementById('emptyState').classList.remove('hidden');
            document.getElementById('paginacion').style.display = 'none';
            return;
        }

        document.querySelector('.table-container').style.display = 'block';
        document.getElementById('emptyState').classList.add('hidden');

        tbody.innerHTML = productosPagina.map(producto => {
            const variantes = MockData.getVariantes(producto.id);
            const stockTotal = MockData.getStockTotal(producto.id);
            const imagen = MockData.getImagenPrincipal(producto.id);

            return `
                <tr>
                    <td>${producto.id}</td>
                    <td>
                        <img src="${imagen?.ruta_imagen || 'https://via.placeholder.com/50'}" 
                             alt="${producto.nombre}">
                    </td>
                    <td>
                        <div class="truncate" style="max-width: 200px;" title="${producto.nombre}">
                            ${producto.nombre}
                        </div>
                    </td>
                    <td>$${producto.precio_base.toLocaleString('es-CO')}</td>
                    <td>${variantes.length}</td>
                    <td>
                        <span class="badge ${stockTotal < 5 ? 'badge-danger' : 'badge-success'}">
                            ${stockTotal}
                        </span>
                    </td>
                    <td>
                        <span class="badge ${producto.activo ? 'badge-success' : 'badge-danger'}">
                            ${producto.activo ? 'Activo' : 'Inactivo'}
                        </span>
                    </td>
                    <td>
                        <span class="badge ${producto.aprobado ? 'badge-success' : 'badge-warning'}">
                            ${producto.aprobado ? 'Aprobado' : 'Pendiente'}
                        </span>
                    </td>
                    <td>${new Date(producto.fecha_creacion).toLocaleDateString('es-CO')}</td>
                    <td>
                        <div class="acciones-td">
                            <button class="btn-icon btn-editar" onclick="gestion.editarProducto(${producto.id})" 
                                    title="Editar">
                                ✏️
                            </button>
                            <button class="btn-icon btn-eliminar" onclick="gestion.eliminarProducto(${producto.id})" 
                                    title="Eliminar">
                                🗑️
                            </button>
                            ${producto.aprobado ? `
                                <button class="btn-icon btn-desaprobar" onclick="gestion.desaprobarProducto(${producto.id})" 
                                        title="Desaprobar">
                                    ⚠️
                                </button>
                            ` : `
                                <button class="btn-icon btn-aprobar" onclick="gestion.aprobarProducto(${producto.id})" 
                                        title="Aprobar">
                                    ✅
                                </button>
                            `}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Renderizar paginación
        this.renderizarPaginacion(productosFiltrados.length);
    }

    renderizarPaginacion(totalProductos) {
        const totalPaginas = Math.ceil(totalProductos / this.productosPorPagina);
        const paginacion = document.getElementById('paginacion');

        if (totalPaginas <= 1) {
            paginacion.style.display = 'none';
            return;
        }

        paginacion.style.display = 'flex';
        
        let html = `
            <button class="pagination-btn" ${this.paginaActual === 1 ? 'disabled' : ''} 
                    onclick="gestion.cambiarPagina(${this.paginaActual - 1})">
                ‹ Anterior
            </button>
        `;

        for (let i = 1; i <= totalPaginas; i++) {
            if (i === 1 || i === totalPaginas || (i >= this.paginaActual - 2 && i <= this.paginaActual + 2)) {
                html += `
                    <button class="pagination-btn ${i === this.paginaActual ? 'active' : ''}" 
                            onclick="gestion.cambiarPagina(${i})">
                        ${i}
                    </button>
                `;
            } else if (i === this.paginaActual - 3 || i === this.paginaActual + 3) {
                html += `<span>...</span>`;
            }
        }

        html += `
            <button class="pagination-btn" ${this.paginaActual === totalPaginas ? 'disabled' : ''} 
                    onclick="gestion.cambiarPagina(${this.paginaActual + 1})">
                Siguiente ›
            </button>
        `;

        paginacion.innerHTML = html;
    }

    cambiarPagina(pagina) {
        this.paginaActual = pagina;
        this.renderizarProductos();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ============================================
    // CREAR/EDITAR PRODUCTO (RF-001 a RF-006, RF-011 a RF-017)
    // ============================================

    abrirModalCrear() {
        this.productoActual = null;
        document.getElementById('tituloModal').textContent = 'Crear Producto';
        document.getElementById('formProducto').reset();
        document.getElementById('productoId').value = '';
        document.getElementById('variantes-container').innerHTML = '';
        this.validarFormulario();
        this.abrirModal('modalProducto');
    }

    editarProducto(id) {
        this.productoActual = MockData.getProducto(id);
        document.getElementById('tituloModal').textContent = 'Editar Producto';
        
        // Cargar datos
        document.getElementById('productoId').value = this.productoActual.id;
        document.getElementById('nombre').value = this.productoActual.nombre;
        document.getElementById('descripcion').value = this.productoActual.descripcion;
        document.getElementById('precioBase').value = this.productoActual.precio_base;
        
        // Cargar variantes
        const variantes = MockData.getVariantes(id);
        document.getElementById('variantes-container').innerHTML = '';
        variantes.forEach(v => {
            this.agregarVariante(v);
        });

        this.validarFormulario();
        this.abrirModal('modalProducto');
    }

    guardarProducto(e) {
        e.preventDefault();

        const producto = {
            id: document.getElementById('productoId').value ? parseInt(document.getElementById('productoId').value) : null,
            nombre: document.getElementById('nombre').value,
            descripcion: document.getElementById('descripcion').value,
            precio_base: parseFloat(document.getElementById('precioBase').value),
            activo: this.productoActual?.activo ?? true,
            aprobado: this.productoActual?.aprobado ?? false,
            usuario_id_creador: 1,
            fecha_creacion: this.productoActual?.fecha_creacion // Preservar fecha al editar
        };

        // Guardar producto
        const productoGuardado = MockData.saveProducto(producto);

        // Si es edición, eliminar variantes antiguas
        if (productoGuardado.id) {
            const variantesAntiguasData = localStorage.getItem('variantes_red');
            let variantesAntiguas = variantesAntiguasData ? JSON.parse(variantesAntiguasData) : [];
            variantesAntiguas = variantesAntiguas.filter(v => v.producto_id !== productoGuardado.id);
            localStorage.setItem('variantes_red', JSON.stringify(variantesAntiguas));
        }

        // Guardar variantes (RF-004, RF-005, RF-006)
        const variantesItems = document.querySelectorAll('.variante-item');
        variantesItems.forEach((varianteItem) => {
            const variante = {
                producto_id: productoGuardado.id,
                talla: varianteItem.querySelector('.variante-talla').value,
                color_hex: varianteItem.querySelector('.variante-color').value,
                color_nombre: this.getNombreColor(varianteItem.querySelector('.variante-color').value),
                stock: parseInt(varianteItem.querySelector('.variante-stock').value) || 0,
                precio_variante: parseFloat(varianteItem.querySelector('.variante-precio').value) || null
            };
            MockData.saveVariante(variante);
        });

        this.mostrarToast('✅ Producto guardado exitosamente', 'success');
        this.cerrarModal('modalProducto');
        this.cargarProductos();
        this.renderizarProductos();
    }

    agregarVariante(varianteData = null) {
        const container = document.getElementById('variantes-container');
        const varianteId = Date.now();

        const html = `
            <div class="variante-item" data-variante="${varianteId}">
                <div class="variante-header">
                    <span class="variante-title">Variante #${container.children.length + 1}</span>
                    <button type="button" class="variante-remove" onclick="this.closest('.variante-item').remove(); gestion.validarFormulario();">
                        ✖
                    </button>
                </div>
                <div class="variante-grid">
                    <div class="form-group">
                        <label class="form-label">Talla</label>
                        <select class="form-select variante-talla" required>
                            <option value="">Seleccionar...</option>
                            <option value="S" ${varianteData?.talla === 'S' ? 'selected' : ''}>S</option>
                            <option value="M" ${varianteData?.talla === 'M' ? 'selected' : ''}>M</option>
                            <option value="L" ${varianteData?.talla === 'L' ? 'selected' : ''}>L</option>
                            <option value="XL" ${varianteData?.talla === 'XL' ? 'selected' : ''}>XL</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Color (HEX)</label>
                        <div class="color-input-group">
                            <input type="text" class="form-input variante-color" 
                                   value="${varianteData?.color_hex || '#FFFFFF'}" 
                                   pattern="^#[0-9A-Fa-f]{6}$" 
                                   placeholder="#FFFFFF" 
                                   required>
                            <div class="color-preview" style="background-color: ${varianteData?.color_hex || '#FFFFFF'}"></div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Stock</label>
                        <input type="number" class="form-input variante-stock" 
                               value="${varianteData?.stock || 0}" 
                               min="0" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Precio Variante (opcional)</label>
                        <input type="number" class="form-input variante-precio" 
                               value="${varianteData?.precio_variante || ''}" 
                               min="0" step="1" 
                               placeholder="Deja vacío para usar precio base">
                    </div>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', html);

        // Bind color preview
        const varianteItem = container.lastElementChild;
        const colorInput = varianteItem.querySelector('.variante-color');
        const colorPreview = varianteItem.querySelector('.color-preview');

        colorInput.addEventListener('input', () => {
            if (/^#[0-9A-Fa-f]{6}$/.test(colorInput.value)) {
                colorPreview.style.backgroundColor = colorInput.value;
            }
        });

        this.validarFormulario();
    }

    validarFormulario() {
        const nombre = document.getElementById('nombre').value.trim();
        const descripcion = document.getElementById('descripcion').value.trim();
        const precio = document.getElementById('precioBase').value;
        const variantes = document.querySelectorAll('.variante-item');

        // Actualizar checklist
        this.actualizarCheck('checkNombre', nombre.length > 0);
        this.actualizarCheck('checkDescripcion', descripcion.length > 0);
        this.actualizarCheck('checkPrecio', precio > 0);
        this.actualizarCheck('checkImagen', true); // Mock
        this.actualizarCheck('checkVariantes', variantes.length > 0);

        // Habilitar/deshabilitar botón guardar
        const esValido = nombre.length > 0 && descripcion.length > 0 && precio > 0 && variantes.length > 0;
        document.getElementById('guardarProducto').disabled = !esValido;
    }

    actualizarCheck(id, completado) {
        const element = document.getElementById(id);
        if (completado) {
            element.classList.add('completed');
        } else {
            element.classList.remove('completed');
        }
    }

    // ============================================
    // ELIMINAR PRODUCTO (RF-018, RF-019)
    // ============================================

    eliminarProducto(id) {
        this.productoActual = MockData.getProducto(id);
        const variantes = MockData.getVariantes(id);
        const stockTotal = MockData.getStockTotal(id);

        document.getElementById('mensajeEliminar').textContent = 
            `¿Estás seguro de que deseas desactivar "${this.productoActual.nombre}"?`;

        // Advertencias
        const advertencias = document.getElementById('advertenciasEliminar');
        let htmlAdvertencias = '';

        if (stockTotal > 0) {
            htmlAdvertencias += `
                <div class="advertencia-item">
                    ⚠️ Este producto tiene ${stockTotal} unidades en stock
                </div>
            `;
        }

        if (variantes.length > 0) {
            htmlAdvertencias += `
                <div class="advertencia-item">
                    ⚠️ Este producto tiene ${variantes.length} variantes activas
                </div>
            `;
        }

        advertencias.innerHTML = htmlAdvertencias || '<p class="text-sm text-gray">No hay advertencias</p>';

        this.abrirModal('modalEliminar');
    }

    confirmarEliminarProducto() {
        if (this.productoActual) {
            this.productoActual.activo = false;
            MockData.saveProducto(this.productoActual);
            
            this.mostrarToast('✅ Producto desactivado exitosamente', 'success');
            this.cerrarModal('modalEliminar');
            this.cargarProductos();
            this.renderizarProductos();
        }
    }

    // ============================================
    // APROBAR/DESAPROBAR (RF-020, RF-021)
    // ============================================

    aprobarProducto(id) {
        this.productoActual = MockData.getProducto(id);
        document.getElementById('tituloModalAprobar').textContent = 'Aprobar Producto';
        document.getElementById('mensajeAprobar').textContent = 
            `"${this.productoActual.nombre}" será visible en el catálogo público.`;
        document.getElementById('grupoMotivo').classList.add('hidden');
        document.getElementById('confirmarAprobar').textContent = 'Aprobar';
        document.getElementById('confirmarAprobar').className = 'btn btn-primary';
        this.abrirModal('modalAprobar');
    }

    desaprobarProducto(id) {
        this.productoActual = MockData.getProducto(id);
        document.getElementById('tituloModalAprobar').textContent = 'Desaprobar Producto';
        document.getElementById('mensajeAprobar').textContent = 
            `"${this.productoActual.nombre}" será ocultado del catálogo público.`;
        document.getElementById('grupoMotivo').classList.remove('hidden');
        document.getElementById('confirmarAprobar').textContent = 'Desaprobar';
        document.getElementById('confirmarAprobar').className = 'btn btn-warning';
        this.abrirModal('modalAprobar');
    }

    confirmarAprobar() {
        if (!this.productoActual) return;

        const esAprobar = this.productoActual.aprobado === false;

        if (!esAprobar) {
            // Validar motivo
            const motivo = document.getElementById('motivoDesaprobacion').value.trim();
            if (motivo.length === 0) {
                this.mostrarToast('⚠️ Debes ingresar un motivo', 'error');
                return;
            }
        }

        this.productoActual.aprobado = esAprobar;
        MockData.saveProducto(this.productoActual);

        this.mostrarToast(
            `✅ Producto ${esAprobar ? 'aprobado' : 'desaprobado'} exitosamente`, 
            'success'
        );
        this.cerrarModal('modalAprobar');
        this.cargarProductos();
        this.renderizarProductos();
    }

    // ============================================
    // UTILIDADES
    // ============================================

    getNombreColor(hex) {
        const colores = {
            '#FFFFFF': 'Blanco', '#000000': 'Negro', '#FF0000': 'Rojo',
            '#00FF00': 'Verde', '#0000FF': 'Azul', '#FFFF00': 'Amarillo',
            '#FF00FF': 'Magenta', '#00FFFF': 'Cian', '#808080': 'Gris'
        };
        return colores[hex.toUpperCase()] || hex;
    }

    abrirModal(modalId) {
        document.getElementById(modalId).classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    cerrarModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    mostrarToast(mensaje, tipo = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${tipo}`;
        toast.innerHTML = `
            <div class="flex items-center gap-md">
                <span>${mensaje}</span>
                <button class="btn-close" onclick="this.closest('.toast').remove()">✖</button>
            </div>
        `;

        document.getElementById('toastContainer').appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toastSlideOut 0.3s ease-in-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Inicializar
const gestion = new GestionProductos();
