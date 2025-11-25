// Verificar si hay un usuario autenticado
document.addEventListener('DOMContentLoaded', function () {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        // Si no hay usuario autenticado, redirigir a la página de login
        window.location.href = '../usuarios/index.html';
        return;
    }

    // Actualizar la información del usuario en la interfaz
    document.getElementById('userInitial').textContent = currentUser.nombre.charAt(0);

    // Configurar menú desplegable
    const userMenu = document.getElementById('userMenu');
    const dropdownMenu = document.getElementById('dropdownMenu');

    userMenu.addEventListener('click', function (e) {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function (e) {
        if (!userMenu.contains(e.target)) {
            dropdownMenu.classList.remove('show');
        }
    });

    // Configurar eventos de los enlaces del menú
    document.getElementById('profileLink').addEventListener('click', function (e) {
        e.preventDefault();
        alert('Redirigiendo a tu perfil...');
        // Aquí podrías redirigir a una página de perfil específica
        // window.location.href = 'user_profile.html';
    });

    document.getElementById('ordersLink').addEventListener('click', function (e) {
        e.preventDefault();
        alert('Redirigiendo a tus pedidos...');
        // window.location.href = 'user_orders.html';
    });

    document.getElementById('wishlistLink').addEventListener('click', function (e) {
        e.preventDefault();
        alert('Redirigiendo a tu lista de deseos...');
        // window.location.href = 'user_wishlist.html';
    });

    // Configurar evento de cierre de sesión
    document.getElementById('logoutLink').addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.href = 'modulos/usuarios/index.html';
    });
});





/**
 * ============================================
 * Módulo de Detalle de Producto
 * RF-038 a RF-050
 * ============================================
 */

class DetalleProducto {
    constructor() {
        this.productoId = null;
        this.producto = null;
        this.variantes = [];
        this.imagenes = [];
        this.categorias = [];
        this.varianteSeleccionada = null;
        this.tallaSeleccionada = null;
        this.colorSeleccionado = null;
        this.cantidad = 1;

        this.init();
    }

    /**
     * Inicializar el módulo
     */
    init() {
        // Obtener ID del producto desde sessionStorage
        this.productoId = sessionStorage.getItem('producto_detalle_id');

        if (!this.productoId) {
            alert('No se especificó un producto. Redirigiendo al catálogo...');
            window.location.href = '../catalogo/index.html';
            return;
        }

        // Cargar datos
        this.cargarDatos();
        this.renderizar();
        this.inicializarEventos();
        this.actualizarContadorCarrito();
    }

    /**
     * Cargar datos desde localStorage
     */
    cargarDatos() {
        const productos = JSON.parse(localStorage.getItem('productos_red')) || [];
        this.producto = productos.find(p => p.id === parseInt(this.productoId));

        if (!this.producto) {
            alert('Producto no encontrado. Redirigiendo al catálogo...');
            window.location.href = '../catalogo/index.html';
            return;
        }

        const variantes = JSON.parse(localStorage.getItem('variantes_red')) || [];
        this.variantes = variantes.filter(v => v.producto_id === parseInt(this.productoId));

        const imagenes = JSON.parse(localStorage.getItem('imagenes_red')) || [];
        this.imagenes = imagenes.filter(i => i.producto_id === parseInt(this.productoId))
                                 .sort((a, b) => a.orden - b.orden);

        this.categorias = JSON.parse(localStorage.getItem('categorias_red')) || [];
    }

    /**
     * Renderizar toda la interfaz
     */
    renderizar() {
        this.renderizarBreadcrumb();
        this.renderizarCategoria();
        this.renderizarInfoBasica();
        this.renderizarGaleria();
        this.renderizarTallas();
        this.renderizarColores();
        this.renderizarProductosRelacionados();
    }

    /**
     * Renderizar breadcrumb
     */
    renderizarBreadcrumb() {
        document.getElementById('breadcrumbProducto').textContent = this.producto.nombre;
    }

    /**
     * Renderizar categoría
     */
    renderizarCategoria() {
        const categoria = this.categorias.find(c => c.id === this.producto.categoria_id);
        document.getElementById('categoriaBadge').textContent = categoria ? categoria.nombre : 'Sin categoría';
    }

    /**
     * Renderizar información básica
     */
    renderizarInfoBasica() {
        document.getElementById('productoTitulo').textContent = this.producto.nombre;
        document.getElementById('productoPrecio').textContent = this.formatearPrecio(this.producto.precio_base);
        document.getElementById('productoDescripcion').textContent = this.producto.descripcion;
    }

    /**
     * Renderizar galería de imágenes
     */
    renderizarGaleria() {
        if (this.imagenes.length === 0) {
            document.getElementById('imagenPrincipal').src = 'https://via.placeholder.com/600x600/DC143C/FFFFFF?text=Sin+Imagen';
            return;
        }

        // Imagen principal
        const imagenPrincipal = this.imagenes.find(i => i.principal) || this.imagenes[0];
        const imgElement = document.getElementById('imagenPrincipal');
        imgElement.src = imagenPrincipal.ruta_imagen;
        imgElement.alt = imagenPrincipal.alt_text;

        // Thumbnails
        const thumbnailsContainer = document.getElementById('thumbnailsContainer');
        thumbnailsContainer.innerHTML = '';

        this.imagenes.forEach((imagen, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = imagen.ruta_imagen;
            thumbnail.alt = imagen.alt_text;
            thumbnail.className = 'thumbnail';
            if (imagen.principal) {
                thumbnail.classList.add('active');
            }

            thumbnail.addEventListener('click', () => {
                this.cambiarImagenPrincipal(index);
            });

            thumbnailsContainer.appendChild(thumbnail);
        });
    }

    /**
     * Cambiar imagen principal
     */
    cambiarImagenPrincipal(index) {
        const imagen = this.imagenes[index];
        const imgElement = document.getElementById('imagenPrincipal');
        imgElement.src = imagen.ruta_imagen;
        imgElement.alt = imagen.alt_text;

        // Actualizar thumbnails activos
        document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }

    /**
     * Renderizar selector de tallas
     */
    renderizarTallas() {
        const tallasUnicas = [...new Set(this.variantes.map(v => v.talla))];
        const tallasContainer = document.getElementById('tallasContainer');
        tallasContainer.innerHTML = '';

        // Orden de tallas personalizado
        const ordenTallas = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
        const tallasOrdenadas = tallasUnicas.sort((a, b) => {
            const indexA = ordenTallas.indexOf(a);
            const indexB = ordenTallas.indexOf(b);
            return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
        });

        tallasOrdenadas.forEach(talla => {
            const btn = document.createElement('button');
            btn.className = 'talla-btn';
            btn.textContent = talla;
            btn.dataset.talla = talla;

            // Verificar si hay stock para esta talla
            const tieneStock = this.variantes.some(v => v.talla === talla && v.stock > 0);
            if (!tieneStock) {
                btn.disabled = true;
            }

            btn.addEventListener('click', () => {
                this.seleccionarTalla(talla);
            });

            tallasContainer.appendChild(btn);
        });
    }

    /**
     * Renderizar selector de colores
     */
    renderizarColores() {
        const coloresUnicos = [];
        const coloresVistos = new Set();

        this.variantes.forEach(v => {
            if (!coloresVistos.has(v.color_hex)) {
                coloresVistos.add(v.color_hex);
                coloresUnicos.push({
                    hex: v.color_hex,
                    nombre: v.color_nombre
                });
            }
        });

        const coloresContainer = document.getElementById('coloresContainer');
        coloresContainer.innerHTML = '';

        coloresUnicos.forEach(color => {
            const btn = document.createElement('button');
            btn.className = 'color-btn';
            btn.style.backgroundColor = color.hex;
            btn.dataset.color = color.hex;
            btn.dataset.nombre = color.nombre;
            btn.title = color.nombre;

            // Verificar si hay stock para este color
            const tieneStock = this.variantes.some(v => v.color_hex === color.hex && v.stock > 0);
            if (!tieneStock) {
                btn.disabled = true;
            }

            btn.addEventListener('click', () => {
                this.seleccionarColor(color.hex, color.nombre);
            });

            coloresContainer.appendChild(btn);
        });
    }

    /**
     * Seleccionar talla
     */
    seleccionarTalla(talla) {
        this.tallaSeleccionada = talla;

        // Actualizar UI
        document.querySelectorAll('.talla-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.talla === talla);
        });

        // Actualizar colores disponibles
        this.actualizarColoresDisponibles();

        // Buscar variante si ambos están seleccionados
        if (this.colorSeleccionado) {
            this.buscarVariante();
        }
    }

    /**
     * Seleccionar color
     */
    seleccionarColor(hex, nombre) {
        this.colorSeleccionado = hex;

        // Actualizar UI
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.color === hex);
        });
        document.getElementById('colorNombre').textContent = nombre;

        // Actualizar tallas disponibles
        this.actualizarTallasDisponibles();

        // Buscar variante si ambos están seleccionados
        if (this.tallaSeleccionada) {
            this.buscarVariante();
        }
    }

    /**
     * Actualizar colores disponibles según talla seleccionada
     */
    actualizarColoresDisponibles() {
        if (!this.tallaSeleccionada) return;

        const coloresDisponibles = this.variantes
            .filter(v => v.talla === this.tallaSeleccionada && v.stock > 0)
            .map(v => v.color_hex);

        document.querySelectorAll('.color-btn').forEach(btn => {
            const color = btn.dataset.color;
            btn.disabled = !coloresDisponibles.includes(color);
        });
    }

    /**
     * Actualizar tallas disponibles según color seleccionado
     */
    actualizarTallasDisponibles() {
        if (!this.colorSeleccionado) return;

        const tallasDisponibles = this.variantes
            .filter(v => v.color_hex === this.colorSeleccionado && v.stock > 0)
            .map(v => v.talla);

        document.querySelectorAll('.talla-btn').forEach(btn => {
            const talla = btn.dataset.talla;
            btn.disabled = !tallasDisponibles.includes(talla);
        });
    }

    /**
     * Buscar variante según talla y color seleccionados
     */
    buscarVariante() {
        this.varianteSeleccionada = this.variantes.find(v => 
            v.talla === this.tallaSeleccionada && 
            v.color_hex === this.colorSeleccionado
        );

        if (this.varianteSeleccionada) {
            this.actualizarPrecio();
            this.actualizarStock();
            this.mostrarControlCantidad();
        }
    }

    /**
     * Actualizar precio
     */
    actualizarPrecio() {
        let precioFinal = this.producto.precio_base;

        if (this.varianteSeleccionada && this.varianteSeleccionada.precio_variante) {
            precioFinal += this.varianteSeleccionada.precio_variante;
        }

        document.getElementById('productoPrecio').textContent = this.formatearPrecio(precioFinal);
    }

    /**
     * Actualizar stock
     */
    actualizarStock() {
        const stockBadge = document.getElementById('stockBadge');
        const btnAgregar = document.getElementById('btnAgregarCarrito');
        const cantidadInput = document.getElementById('cantidadInput');

        if (!this.varianteSeleccionada) {
            stockBadge.textContent = 'Selecciona talla y color';
            stockBadge.className = 'stock-badge sin-seleccion';
            btnAgregar.disabled = true;
            return;
        }

        const stock = this.varianteSeleccionada.stock;

        if (stock === 0) {
            stockBadge.textContent = 'Agotado';
            stockBadge.className = 'stock-badge agotado';
            btnAgregar.disabled = true;
        } else if (stock <= 5) {
            stockBadge.textContent = `¡Solo ${stock} disponibles!`;
            stockBadge.className = 'stock-badge bajo';
            btnAgregar.disabled = false;
            cantidadInput.max = stock;
        } else {
            stockBadge.textContent = `${stock} disponibles`;
            stockBadge.className = 'stock-badge disponible';
            btnAgregar.disabled = false;
            cantidadInput.max = stock;
        }

        // Ajustar cantidad si excede el stock
        if (this.cantidad > stock) {
            this.cantidad = stock;
            cantidadInput.value = stock;
        }
    }

    /**
     * Mostrar control de cantidad
     */
    mostrarControlCantidad() {
        document.getElementById('cantidadGroup').style.display = 'flex';
    }

    /**
     * Agregar al carrito
     */
    agregarAlCarrito() {
        if (!this.varianteSeleccionada) {
            alert('Por favor selecciona talla y color');
            return;
        }

        const carrito = JSON.parse(localStorage.getItem('carrito_red')) || [];
        
        // Verificar si ya existe en el carrito
        const itemExistente = carrito.find(item => 
            item.producto_id === this.producto.id && 
            item.variante_id === this.varianteSeleccionada.id
        );

        if (itemExistente) {
            // Actualizar cantidad
            const nuevaCantidad = itemExistente.cantidad + this.cantidad;
            if (nuevaCantidad > this.varianteSeleccionada.stock) {
                alert(`Solo hay ${this.varianteSeleccionada.stock} unidades disponibles`);
                return;
            }
            itemExistente.cantidad = nuevaCantidad;
        } else {
            // Agregar nuevo item
            const nuevoItem = {
                id: Date.now(),
                producto_id: this.producto.id,
                variante_id: this.varianteSeleccionada.id,
                cantidad: this.cantidad,
                precio_unitario: this.calcularPrecioFinal(),
                fecha_agregado: new Date().toISOString()
            };
            carrito.push(nuevoItem);
        }

        localStorage.setItem('carrito_red', JSON.stringify(carrito));

        // Mostrar mensaje de éxito
        this.mostrarMensajeExito();
        this.actualizarContadorCarrito();

        // Resetear cantidad
        this.cantidad = 1;
        document.getElementById('cantidadInput').value = 1;
    }

    /**
     * Calcular precio final
     */
    calcularPrecioFinal() {
        let precio = this.producto.precio_base;
        if (this.varianteSeleccionada && this.varianteSeleccionada.precio_variante) {
            precio += this.varianteSeleccionada.precio_variante;
        }
        return precio;
    }

    /**
     * Mostrar mensaje de éxito
     */
    mostrarMensajeExito() {
        const mensaje = document.getElementById('mensajeExito');
        mensaje.style.display = 'block';
        
        setTimeout(() => {
            mensaje.style.display = 'none';
        }, 3000);
    }

    /**
     * Actualizar contador del carrito
     */
    actualizarContadorCarrito() {
        const carrito = JSON.parse(localStorage.getItem('carrito_red')) || [];
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        document.getElementById('cartCount').textContent = totalItems;
    }

    /**
     * Renderizar productos relacionados
     */
    renderizarProductosRelacionados() {
        const productos = JSON.parse(localStorage.getItem('productos_red')) || [];
        const relacionados = productos
            .filter(p => 
                p.id !== this.producto.id && 
                p.categoria_id === this.producto.categoria_id &&
                p.activo && 
                p.aprobado &&
                !p.eliminado
            )
            .slice(0, 4);

        const grid = document.getElementById('relacionadosGrid');
        grid.innerHTML = '';

        if (relacionados.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: #666;">No hay productos relacionados</p>';
            return;
        }

        relacionados.forEach(producto => {
            const imagenes = JSON.parse(localStorage.getItem('imagenes_red')) || [];
            const imagenPrincipal = imagenes.find(i => i.producto_id === producto.id && i.principal);

            const card = document.createElement('div');
            card.className = 'producto-card';
            card.onclick = () => {
                sessionStorage.setItem('producto_detalle_id', producto.id);
                window.location.reload();
            };

            card.innerHTML = `
                <img src="${imagenPrincipal?.ruta_imagen || 'https://via.placeholder.com/280x280/DC143C/FFFFFF?text=Sin+Imagen'}" 
                     alt="${producto.nombre}" 
                     class="producto-card-imagen">
                <div class="producto-card-info">
                    <div class="producto-card-titulo">${producto.nombre}</div>
                    <div class="producto-card-precio">${this.formatearPrecio(producto.precio_base)}</div>
                </div>
            `;

            grid.appendChild(card);
        });
    }

    /**
     * Inicializar eventos
     */
    inicializarEventos() {
        // Botón agregar al carrito
        document.getElementById('btnAgregarCarrito').addEventListener('click', () => {
            this.agregarAlCarrito();
        });

        // Control de cantidad
        document.getElementById('btnMenos').addEventListener('click', () => {
            this.modificarCantidad(-1);
        });

        document.getElementById('btnMas').addEventListener('click', () => {
            this.modificarCantidad(1);
        });

        document.getElementById('cantidadInput').addEventListener('change', (e) => {
            const valor = parseInt(e.target.value);
            if (valor >= 1 && valor <= this.varianteSeleccionada?.stock) {
                this.cantidad = valor;
            } else {
                e.target.value = this.cantidad;
            }
        });

        // Zoom de imagen
        document.getElementById('zoomBtn').addEventListener('click', () => {
            this.abrirZoom();
        });

        document.getElementById('imagenPrincipal').addEventListener('click', () => {
            this.abrirZoom();
        });

        document.getElementById('modalZoomOverlay').addEventListener('click', () => {
            this.cerrarZoom();
        });

        document.getElementById('closeZoom').addEventListener('click', () => {
            this.cerrarZoom();
        });
    }

    /**
     * Modificar cantidad
     */
    modificarCantidad(delta) {
        const nuevaCantidad = this.cantidad + delta;
        const stock = this.varianteSeleccionada?.stock || 1;

        if (nuevaCantidad >= 1 && nuevaCantidad <= stock) {
            this.cantidad = nuevaCantidad;
            document.getElementById('cantidadInput').value = nuevaCantidad;
        }
    }

    /**
     * Abrir modal de zoom
     */
    abrirZoom() {
        const imagenPrincipal = document.getElementById('imagenPrincipal');
        const imagenZoom = document.getElementById('imagenZoom');
        const modal = document.getElementById('modalZoom');

        imagenZoom.src = imagenPrincipal.src;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    /**
     * Cerrar modal de zoom
     */
    cerrarZoom() {
        const modal = document.getElementById('modalZoom');
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    /**
     * Formatear precio
     */
    formatearPrecio(precio) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(precio);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new DetalleProducto();
});
