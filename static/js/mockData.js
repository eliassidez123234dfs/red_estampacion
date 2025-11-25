// ============================================
// DATOS MOCK - RED ESTAMPACIÓN
// LocalStorage para testing y mockup
// ============================================

const MockData = {
    /**
     * Inicializar datos mock en localStorage si no existen
     */
    init() {
        if (!localStorage.getItem('categorias_red')) {
            this.initCategorias();
        }
        if (!localStorage.getItem('productos_red')) {
            this.initProductos();
        }
        if (!localStorage.getItem('variantes_red')) {
            this.initVariantes();
        }
        if (!localStorage.getItem('imagenes_red')) {
            this.initImagenes();
        }
        if (!localStorage.getItem('carrito_red')) {
            localStorage.setItem('carrito_red', JSON.stringify([]));
        }
        console.log('✅ Datos mock inicializados en localStorage');
    },

    // Alias para compatibilidad
    inicializar() {
        return this.init();
    },

    /**
     * Generar categorías de ejemplo
     */
    initCategorias() {
        const categorias = [
            { id: 1, nombre: 'Camisetas Básicas', descripcion: 'Camisetas clásicas para el día a día' },
            { id: 2, nombre: 'Camisetas Premium', descripcion: 'Alta calidad y acabados de lujo' },
            { id: 3, nombre: 'Deportivas', descripcion: 'Ropa técnica para actividades físicas' },
            { id: 4, nombre: 'Streetwear', descripcion: 'Estilo urbano y moderno' },
            { id: 5, nombre: 'Elegantes', descripcion: 'Para ocasiones especiales' }
        ];

        localStorage.setItem('categorias_red', JSON.stringify(categorias));
        console.log(`✅ ${categorias.length} categorías creadas`);
    },

    /**
     * Generar productos de ejemplo
     */
    initProductos() {
        const productos = [
            {
                id: 1,
                nombre: "Camiseta Básica Algodón",
                descripcion: "Camiseta 100% algodón de alta calidad. Perfecta para personalizar con tus diseños favoritos. Tela suave y transpirable.",
                categoria_id: 1,
                precio_base: 25000,
                activo: true,
                aprobado: true,
                fecha_creacion: new Date('2025-11-01').toISOString(),
                usuario_id_creador: 1,
                eliminado: false
            },
            {
                id: 2,
                nombre: "Camiseta Premium Cuello Redondo",
                descripcion: "Camiseta premium con acabado de lujo. Material de primera calidad con costuras reforzadas. Ideal para diseños complejos.",
                categoria_id: 2,
                precio_base: 35000,
                activo: true,
                aprobado: true,
                fecha_creacion: new Date('2025-11-05').toISOString(),
                usuario_id_creador: 1,
                eliminado: false
            },
            {
                id: 3,
                nombre: "Camiseta Deportiva Dry-Fit",
                descripcion: "Tecnología dry-fit para máxima transpirabilidad. Perfecta para actividades deportivas. Secado rápido y tela anti-bacterial.",
                categoria_id: 3,
                precio_base: 42000,
                activo: true,
                aprobado: true,
                fecha_creacion: new Date('2025-11-10').toISOString(),
                usuario_id_creador: 1,
                eliminado: false
            },
            {
                id: 4,
                nombre: "Camiseta Oversize Streetwear",
                descripcion: "Estilo urbano oversize. Corte holgado y moderno. Perfecta para looks casuales y estampados grandes.",
                categoria_id: 4,
                precio_base: 38000,
                activo: true,
                aprobado: true,
                fecha_creacion: new Date('2025-11-12').toISOString(),
                usuario_id_creador: 1,
                eliminado: false
            },
            {
                id: 5,
                nombre: "Camiseta Cuello V Elegante",
                descripcion: "Diseño elegante con cuello en V. Ideal para ocasiones semi-formales. Tela suave con caída perfecta.",
                categoria_id: 5,
                precio_base: 32000,
                activo: true,
                aprobado: true,
                fecha_creacion: new Date('2025-11-15').toISOString(),
                usuario_id_creador: 1,
                eliminado: false
            },
            {
                id: 6,
                nombre: "Camiseta Manga Larga Classic",
                descripcion: "Camiseta de manga larga clásica. Perfecta para climas frescos. Material confortable para uso diario.",
                categoria_id: 1,
                precio_base: 40000,
                activo: true,
                aprobado: true,
                fecha_creacion: new Date('2025-11-17').toISOString(),
                usuario_id_creador: 1,
                eliminado: false
            },
            {
                id: 7,
                nombre: "Camiseta Slim Fit Moderna",
                descripcion: "Corte ajustado y moderno. Resalta la figura con estilo. Ideal para looks urbanos contemporáneos.",
                categoria_id: 4,
                precio_base: 36000,
                activo: true,
                aprobado: true,
                fecha_creacion: new Date('2025-11-18').toISOString(),
                usuario_id_creador: 1,
                eliminado: false
            },
            {
                id: 8,
                nombre: "Camiseta Pocket Tee Casual",
                descripcion: "Con bolsillo frontal estilo casual. Perfecta para el día a día. Diseño relajado y cómodo.",
                categoria_id: 1,
                precio_base: 28000,
                activo: true,
                aprobado: true,
                fecha_creacion: new Date('2025-11-19').toISOString(),
                usuario_id_creador: 1,
                eliminado: false
            },
            {
                id: 9,
                nombre: "Camiseta Polo Clásica",
                descripcion: "Polo elegante con cuello y botones. Perfecta para looks semi-formales. Tela piqué de alta calidad.",
                categoria_id: 5,
                precio_base: 45000,
                activo: true,
                aprobado: true,
                fecha_creacion: new Date('2025-11-20').toISOString(),
                usuario_id_creador: 1,
                eliminado: false
            },
            {
                id: 10,
                nombre: "Camiseta Raglán Deportiva",
                descripcion: "Mangas raglán para mayor movilidad. Ideal para deportes y actividades físicas. Material técnico.",
                categoria_id: 3,
                precio_base: 38000,
                activo: true,
                aprobado: true,
                fecha_creacion: new Date('2025-11-21').toISOString(),
                usuario_id_creador: 1,
                eliminado: false
            },
            {
                id: 11,
                nombre: "Camiseta Henley Moderna",
                descripcion: "Estilo henley con botones frontales. Look casual y versátil. Perfecta para combinar.",
                categoria_id: 1,
                precio_base: 33000,
                activo: true,
                aprobado: true,
                fecha_creacion: new Date('2025-11-01').toISOString(),
                usuario_id_creador: 1,
                eliminado: false
            },
            {
                id: 12,
                nombre: "Camiseta Longline Streetwear",
                descripcion: "Diseño longline extra largo. Tendencia urbana moderna. Corte asimétrico único.",
                categoria_id: 4,
                precio_base: 40000,
                activo: true,
                aprobado: true,
                fecha_creacion: new Date('2025-11-02').toISOString(),
                usuario_id_creador: 1,
                eliminado: false
            },
            {
                id: 13,
                nombre: "Camiseta Tank Top Fitness",
                descripcion: "Sin mangas para máximo movimiento. Ideal para gimnasio y entrenamientos. Tela respirable.",
                categoria_id: 3,
                precio_base: 22000,
                activo: true,
                aprobado: true,
                fecha_creacion: new Date('2025-11-03').toISOString(),
                usuario_id_creador: 1,
                eliminado: false
            },
            {
                id: 14,
                nombre: "Camiseta Crop Top Moderna",
                descripcion: "Diseño corto y moderno. Tendencia actual. Perfecta para looks casuales y urbanos.",
                categoria_id: 4,
                precio_base: 29000,
                activo: true,
                aprobado: true,
                fecha_creacion: new Date('2025-11-04').toISOString(),
                usuario_id_creador: 1,
                eliminado: false
            },
            {
                id: 15,
                nombre: "Camiseta Túnica Elegante",
                descripcion: "Corte túnica alargado. Elegante y cómoda. Ideal para ocasiones especiales.",
                categoria_id: 5,
                precio_base: 48000,
                activo: true,
                aprobado: true,
                fecha_creacion: new Date('2025-11-06').toISOString(),
                usuario_id_creador: 1,
                eliminado: false
            },
            {
                id: 16,
                nombre: "Camiseta Vintage Retro",
                descripcion: "Estilo vintage con diseño retro. Tela con acabado envejecido. Look único y auténtico.",
                categoria_id: 1,
                precio_base: 35000,
                activo: true,
                aprobado: true,
                fecha_creacion: new Date('2025-11-07').toISOString(),
                usuario_id_creador: 1,
                eliminado: false
            },
            {
                id: 17,
                nombre: "Camiseta Performance Pro",
                descripcion: "Tecnología de compresión y control de humedad. Para atletas exigentes. Máximo rendimiento.",
                categoria_id: 3,
                precio_base: 55000,
                activo: true,
                aprobado: true,
                fecha_creacion: new Date('2025-11-08').toISOString(),
                usuario_id_creador: 1,
                eliminado: false
            },
            {
                id: 18,
                nombre: "Camiseta Hoodie Sin Mangas",
                descripcion: "Con capucha pero sin mangas. Estilo urbano único. Perfecta para looks deportivos casuales.",
                categoria_id: 4,
                precio_base: 42000,
                activo: true,
                aprobado: true,
                fecha_creacion: new Date('2025-11-09').toISOString(),
                usuario_id_creador: 1,
                eliminado: false
            },
            {
                id: 19,
                nombre: "Camiseta Cuello Alto Térmica",
                descripcion: "Cuello alto para mayor abrigo. Tela térmica de alta calidad. Perfecta para invierno.",
                categoria_id: 2,
                precio_base: 44000,
                activo: true,
                aprobado: true,
                fecha_creacion: new Date('2025-11-11').toISOString(),
                usuario_id_creador: 1,
                eliminado: false
            },
            {
                id: 20,
                nombre: "Camiseta Baseball Retro",
                descripcion: "Estilo beisbol con mangas contrastantes. Look deportivo clásico. Perfecta para personalizar.",
                categoria_id: 1,
                precio_base: 32000,
                activo: true,
                aprobado: true,
                fecha_creacion: new Date('2025-11-13').toISOString(),
                usuario_id_creador: 1,
                eliminado: false
            }
        ];

        localStorage.setItem('productos_red', JSON.stringify(productos));
        console.log(`✅ ${productos.length} productos creados`);
    },

    /**
     * Generar variantes (talla + color + stock) para productos
     */
    initVariantes() {
        const colores = [
            { hex: '#FFFFFF', nombre: 'Blanco' },
            { hex: '#000000', nombre: 'Negro' },
            { hex: '#DC143C', nombre: 'Rojo' },
            { hex: '#1E90FF', nombre: 'Azul' },
            { hex: '#32CD32', nombre: 'Verde' },
            { hex: '#FFD700', nombre: 'Amarillo' },
            { hex: '#FF69B4', nombre: 'Rosa' },
            { hex: '#808080', nombre: 'Gris' }
        ];

        const tallas = ['S', 'M', 'L', 'XL'];
        const variantes = [];
        let varianteId = 1;

        // Generar variantes para cada producto
        for (let productoId = 1; productoId <= 20; productoId++) {
            // Cada producto tiene 2-3 tallas y 3-4 colores
            const tallasProducto = tallas.slice(0, Math.floor(Math.random() * 2) + 2);
            const coloresProducto = colores.slice(0, Math.floor(Math.random() * 2) + 3);

            tallasProducto.forEach(talla => {
                coloresProducto.forEach(color => {
                    variantes.push({
                        id: varianteId++,
                        producto_id: productoId,
                        talla: talla,
                        color_hex: color.hex,
                        color_nombre: color.nombre,
                        stock: Math.floor(Math.random() * 50) + 5, // Stock entre 5 y 55
                        precio_variante: null, // Usa precio_base del producto
                        fecha_creacion: new Date().toISOString()
                    });
                });
            });
        }

        localStorage.setItem('variantes_red', JSON.stringify(variantes));
        console.log(`✅ ${variantes.length} variantes creadas`);
    },

    /**
     * Generar imágenes mock para productos
     */
    initImagenes() {
        const imagenes = [];
        let imagenId = 1;

        // URLs de imágenes locales de camisetas y prendas (ahora en carpeta img_camisas)
        const imagenesBase = [
            '../../assets/img_camisas/men-s-shirts-mockup-design-template-mockup-free-photo.jpg',
            '../../assets/img_camisas/imagen_camisa_diseño_Serpientes.webp',
            '../../assets/img_camisas/camisas-estilo-columbia-manga-larga.jpg',
            '../../assets/img_camisas/CAMISAS-OXFORD-TALLAS-GRANDES_3-300x300.jpg',
            '../../assets/img_camisas/Buzo con Capucha Manga Larga con gráfico Hombre AE.webp',
            '../../assets/img_camisas/dunay-comfy-too-caramelo-Buzo confort tipo hoddie tacto suave caramelo mujer S.webp',
            '../../assets/img_camisas/Goku-Drip-Puffer-Jacket-Black.webp'
        ];

        // Imágenes adicionales para vistas alternativas
        const imagenesAdicionales = [
            '../../assets/img_camisas/camisas-estilo-columbia-manga-larga.jpg',
            '../../assets/img_camisas/CAMISAS-OXFORD-TALLAS-GRANDES_3-300x300.jpg',
            '../../assets/img_camisas/imagen_camisa_diseño_Serpientes.webp'
        ];

        for (let productoId = 1; productoId <= 20; productoId++) {
            // Imagen principal (rotando las imágenes disponibles)
            const imagenPrincipalIndex = (productoId - 1) % imagenesBase.length;
            imagenes.push({
                id: imagenId++,
                producto_id: productoId,
                ruta_imagen: imagenesBase[imagenPrincipalIndex],
                alt_text: `Camiseta ${productoId} - Vista principal`,
                principal: true,
                orden: 0,
                fecha_carga: new Date().toISOString()
            });

            // 2 imágenes adicionales rotando las imágenes disponibles
            for (let i = 1; i <= 2; i++) {
                const indexImagen = (productoId - 1 + i) % imagenesAdicionales.length;
                imagenes.push({
                    id: imagenId++,
                    producto_id: productoId,
                    ruta_imagen: imagenesAdicionales[indexImagen],
                    alt_text: `Camiseta ${productoId} - Vista ${i}`,
                    principal: false,
                    orden: i,
                    fecha_carga: new Date().toISOString()
                });
            }
        }

        localStorage.setItem('imagenes_red', JSON.stringify(imagenes));
        console.log(`✅ ${imagenes.length} imágenes creadas`);
    },

    /**
     * Obtener todas las categorías
     */
    getCategorias() {
        const categorias = localStorage.getItem('categorias_red');
        return categorias ? JSON.parse(categorias) : [];
    },

    /**
     * Obtener todos los productos
     */
    getProductos() {
        const productos = localStorage.getItem('productos_red');
        return productos ? JSON.parse(productos) : [];
    },

    /**
     * Obtener productos aprobados y activos (para catálogo)
     */
    getProductosActivos() {
        const productos = this.getProductos();
        return productos.filter(p => p.activo && p.aprobado && !p.eliminado);
    },

    /**
     * Obtener producto por ID
     */
    getProducto(id) {
        const productos = this.getProductos();
        return productos.find(p => p.id === parseInt(id));
    },

    /**
     * Obtener variantes de un producto
     */
    getVariantes(productoId) {
        const variantes = localStorage.getItem('variantes_red');
        const todasVariantes = variantes ? JSON.parse(variantes) : [];
        return todasVariantes.filter(v => v.producto_id === parseInt(productoId));
    },

    /**
     * Obtener variante específica
     */
    getVariante(varianteId) {
        const variantes = localStorage.getItem('variantes_red');
        const todasVariantes = variantes ? JSON.parse(variantes) : [];
        return todasVariantes.find(v => v.id === parseInt(varianteId));
    },

    /**
     * Obtener imágenes de un producto
     */
    getImagenes(productoId) {
        const imagenes = localStorage.getItem('imagenes_red');
        const todasImagenes = imagenes ? JSON.parse(imagenes) : [];
        return todasImagenes.filter(i => i.producto_id === parseInt(productoId))
            .sort((a, b) => b.principal - a.principal || a.orden - b.orden);
    },

    /**
     * Obtener imagen principal
     */
    getImagenPrincipal(productoId) {
        const imagenes = this.getImagenes(productoId);
        return imagenes.find(i => i.principal);
    },

    /**
     * Calcular precio mínimo de un producto (considerando variantes)
     */
    getPrecioMinimo(productoId) {
        const producto = this.getProducto(productoId);
        const variantes = this.getVariantes(productoId);
        
        const preciosVariantes = variantes
            .map(v => v.precio_variante)
            .filter(p => p !== null);
        
        if (preciosVariantes.length > 0) {
            return Math.min(...preciosVariantes, producto.precio_base);
        }
        
        return producto.precio_base;
    },

    /**
     * Calcular stock total de un producto
     */
    getStockTotal(productoId) {
        const variantes = this.getVariantes(productoId);
        return variantes.reduce((total, v) => total + v.stock, 0);
    },

    /**
     * Guardar producto (crear o actualizar)
     */
    saveProducto(producto) {
        const productos = this.getProductos();
        const index = productos.findIndex(p => p.id === producto.id);
        
        if (index !== -1) {
            productos[index] = producto;
        } else {
            producto.id = Math.max(...productos.map(p => p.id), 0) + 1;
            producto.fecha_creacion = new Date().toISOString();
            productos.push(producto);
        }
        
        localStorage.setItem('productos_red', JSON.stringify(productos));
        return producto;
    },

    /**
     * Guardar variante
     */
    saveVariante(variante) {
        const variantes = localStorage.getItem('variantes_red');
        const todasVariantes = variantes ? JSON.parse(variantes) : [];
        const index = todasVariantes.findIndex(v => v.id === variante.id);
        
        if (index !== -1) {
            todasVariantes[index] = variante;
        } else {
            variante.id = Math.max(...todasVariantes.map(v => v.id), 0) + 1;
            variante.fecha_creacion = new Date().toISOString();
            todasVariantes.push(variante);
        }
        
        localStorage.setItem('variantes_red', JSON.stringify(todasVariantes));
        return variante;
    },

    /**
     * Eliminar variante
     */
    deleteVariante(varianteId) {
        const variantes = localStorage.getItem('variantes_red');
        let todasVariantes = variantes ? JSON.parse(variantes) : [];
        todasVariantes = todasVariantes.filter(v => v.id !== parseInt(varianteId));
        localStorage.setItem('variantes_red', JSON.stringify(todasVariantes));
    },

    /**
     * CARRITO - Obtener carrito actual
     */
    getCarrito() {
        const carrito = localStorage.getItem('carrito_red');
        return carrito ? JSON.parse(carrito) : [];
    },

    /**
     * CARRITO - Agregar item
     */
    agregarAlCarrito(varianteId, cantidad) {
        const carrito = this.getCarrito();
        const variante = this.getVariante(varianteId);
        const producto = this.getProducto(variante.producto_id);
        
        // Verificar stock
        if (cantidad > variante.stock) {
            throw new Error(`Stock insuficiente. Solo hay ${variante.stock} unidades disponibles.`);
        }
        
        // Buscar si ya existe en carrito
        const itemExistente = carrito.find(item => item.variante_id === varianteId);
        
        if (itemExistente) {
            // Actualizar cantidad
            const nuevaCantidad = itemExistente.cantidad + cantidad;
            if (nuevaCantidad > variante.stock) {
                throw new Error(`Stock insuficiente. Solo hay ${variante.stock} unidades disponibles.`);
            }
            itemExistente.cantidad = nuevaCantidad;
            itemExistente.subtotal = itemExistente.cantidad * itemExistente.precio_unitario;
        } else {
            // Agregar nuevo item
            const precioUnitario = variante.precio_variante || producto.precio_base;
            carrito.push({
                id: Date.now(),
                variante_id: varianteId,
                cantidad: cantidad,
                precio_unitario: precioUnitario,
                subtotal: cantidad * precioUnitario,
                fecha_agregado: new Date().toISOString()
            });
        }
        
        localStorage.setItem('carrito_red', JSON.stringify(carrito));
        return carrito;
    },

    /**
     * CARRITO - Eliminar item
     */
    eliminarDelCarrito(itemId) {
        let carrito = this.getCarrito();
        carrito = carrito.filter(item => item.id !== itemId);
        localStorage.setItem('carrito_red', JSON.stringify(carrito));
        return carrito;
    },

    /**
     * CARRITO - Actualizar cantidad
     */
    actualizarCantidadCarrito(itemId, nuevaCantidad) {
        const carrito = this.getCarrito();
        const item = carrito.find(i => i.id === itemId);
        
        if (item) {
            const variante = this.getVariante(item.variante_id);
            if (nuevaCantidad > variante.stock) {
                throw new Error(`Stock insuficiente. Solo hay ${variante.stock} unidades disponibles.`);
            }
            
            item.cantidad = nuevaCantidad;
            item.subtotal = item.cantidad * item.precio_unitario;
            localStorage.setItem('carrito_red', JSON.stringify(carrito));
        }
        
        return carrito;
    },

    /**
     * CARRITO - Obtener total
     */
    getTotalCarrito() {
        const carrito = this.getCarrito();
        return carrito.reduce((total, item) => total + item.subtotal, 0);
    },

    /**
     * CARRITO - Vaciar
     */
    vaciarCarrito() {
        localStorage.setItem('carrito_red', JSON.stringify([]));
    },

    /**
     * Resetear todos los datos (útil para testing)
     */
    reset() {
        localStorage.removeItem('productos_red');
        localStorage.removeItem('variantes_red');
        localStorage.removeItem('imagenes_red');
        localStorage.removeItem('carrito_red');
        this.init();
        console.log('🔄 Datos mock reseteados');
    }
};

// Auto-inicializar al cargar el script
if (typeof window !== 'undefined') {
    MockData.init();
}

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MockData;
}
