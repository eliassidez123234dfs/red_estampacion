-- SCRIPT CLÁSICO (está bien por sí solo y en teoría se puede usar bien pero aún tiene cosas de gamificación que se supone ya descartamos y no esta 100% de acuerdo a lo establecido en la Matriz de Requerimientos y Ficha Técnica)
-- Configuración inicial
SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS red;
CREATE DATABASE red CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE red;

-- Tablas principales

-- Tabla USUARIO: Almacena información de todos los usuarios del sistema

-- Incluye diferentes roles: diseñador, cliente, admin, revisor
CREATE TABLE USUARIO (

    usuario_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único del usuario',
    nombre VARCHAR(100) NOT NULL COMMENT 'Nombre del usuario',
    apellido VARCHAR(100) NOT NULL COMMENT 'Apellido del usuario',
    email VARCHAR(255) UNIQUE NOT NULL COMMENT 'Email único del usuario para login',
    contrasena VARCHAR(255) NOT NULL COMMENT 'Contraseña hasheada del usuario',
    rol ENUM('cliente', 'admin', 'aprobador', 'diseñadorB') DEFAULT 'cliente' COMMENT 'Rol del usuario en el sistema',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de registro en el sistema',
    activo BOOLEAN DEFAULT TRUE COMMENT 'Estado activo/inactivo del usuario',
    
    INDEX idx_email (email),
    INDEX idx_rol (rol),
    INDEX idx_nivel_vip (nivel_vip)
    
) COMMENT = 'Tabla principal de usuarios del sistema con diferentes roles y niveles VIP';

-- Tabla CATEGORIA_DISENO: Categorías para clasificar los diseños
CREATE TABLE CATEGORIA_DISENO (
    categoria_diseno_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único de la categoría de diseño',
    nombre VARCHAR(100) UNIQUE NOT NULL COMMENT 'Nombre único de la categoría',
    descripcion TEXT COMMENT 'Descripción detallada de la categoría',
    activo BOOLEAN DEFAULT TRUE COMMENT 'Estado activo/inactivo de la categoría',
    INDEX idx_nombre (nombre)
) COMMENT = 'Categorías para clasificar diseños (abstracto, tipografía, naturaleza, etc.)';

-- Tabla DISENO: Diseños creados por usuarios diseñadores
CREATE TABLE DISENO (
    diseno_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID unico del diseño',
    usuario_id INT NOT NULL COMMENT 'ID del diseñador que creó el diseño',
    nombre VARCHAR(200) NOT NULL COMMENT 'Nombre descriptivo del diseño',
    descripcion TEXT COMMENT 'Descripción detallada del diseño',
    publico BOOLEAN DEFAULT FALSE COMMENT 'Indica si el diseño es público o privado',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creacion del diseño',
    activo BOOLEAN DEFAULT TRUE COMMENT 'Estado activo/inactivo del diseño',
    FOREIGN KEY (usuario_id) REFERENCES USUARIO(usuario_id) ON DELETE CASCADE,
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_publico (publico),
    INDEX idx_fecha_creacion (fecha_creacion)
) COMMENT = 'Diseños creados por usuarios diseñadores, pueden ser públicos o privados';

-- Tabla VERSION_DISENO: Control de versiones y estado de aprobación de diseños
CREATE TABLE VERSION_DISENO (
    version_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único de la versión',
    diseno_id INT NOT NULL COMMENT 'ID del diseño al que pertenece esta versión',
    numero_version DECIMAL(3,1) NOT NULL DEFAULT 1.0 COMMENT 'Número de versión (1.0, 1.1, 2.0, etc.)',
    estado ENUM('borrador', 'revision', 'aprobado', 'rechazado') DEFAULT 'borrador' COMMENT 'Estado del proceso de aprobación',
    ruta_archivo VARCHAR(500) NOT NULL COMMENT 'Ruta del archivo de diseño en el sistema',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación de la versión',
    usuario_revisor_id INT NULL COMMENT 'ID del revisor que evaluó la versión',
    comentarios_revision TEXT COMMENT 'Comentarios del revisor sobre la versión',
    
    FOREIGN KEY (diseno_id) REFERENCES DISENO(diseno_id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_revisor_id) REFERENCES USUARIO(usuario_id) ON DELETE SET NULL,
    
    UNIQUE KEY unique_version (diseno_id, numero_version),
    INDEX idx_diseno_id (diseno_id),
    INDEX idx_estado (estado),
    INDEX idx_revisor (usuario_revisor_id)
) COMMENT = 'Versiones de diseños con control de estado y proceso de aprobación';

-- Tabla DISENO_PUBLICO: Diseños disponibles públicamente en el marketplace
CREATE TABLE DISENO_PUBLICO (
    diseno_publico_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único del diseño público',
    diseno_id INT UNIQUE NOT NULL COMMENT 'ID del diseño base',
    usuario_id INT NOT NULL COMMENT 'ID del diseñador propietario',
    categoria_diseno_id INT NOT NULL COMMENT 'ID de la categoría del diseño',
    aprobado BOOLEAN DEFAULT FALSE COMMENT 'Estado de aprobación para marketplace',
    calificacion_promedio DECIMAL(3,2) DEFAULT 0.00 COMMENT 'Calificación promedio (0.00 a 5.00)',
    total_calificaciones INT DEFAULT 0 COMMENT 'Total de calificaciones recibidas',
    precio_licencia DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Precio por usar el diseño (0.00 = gratuito)',
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de publicación en marketplace',
    
    FOREIGN KEY (diseno_id) REFERENCES DISENO(diseno_id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES USUARIO(usuario_id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_diseno_id) REFERENCES CATEGORIA_DISENO(categoria_diseno_id),
    INDEX idx_categoria (categoria_diseno_id),
    INDEX idx_aprobado (aprobado),
    INDEX idx_calificacion (calificacion_promedio)
) COMMENT = 'Diseños disponibles públicamente en el marketplace con sistema de calificaciones';


-- Tabla PRODUCTO: Catálogo de productos base para personalizar
CREATE TABLE PRODUCTO (
    producto_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único del producto',
    nombre VARCHAR(200) NOT NULL COMMENT 'Nombre comercial del producto',
    precio_base DECIMAL(10,2) NOT NULL COMMENT 'Precio base antes de personalización',
    categoria VARCHAR(100) NOT NULL COMMENT 'Categoría del producto (Ropa, Accesorios, etc.)',
    tipo ENUM('camiseta', 'hoodie', 'taza', 'poster', 'sticker', 'otro') NOT NULL COMMENT 'Tipo específico de producto',
    descripcion TEXT COMMENT 'Descripción detallada del producto',
    activo BOOLEAN DEFAULT TRUE COMMENT 'Estado activo/inactivo del producto',
    INDEX idx_categoria (categoria),
    INDEX idx_tipo (tipo),
    INDEX idx_precio (precio_base)
) COMMENT = 'Catálogo de productos base disponibles para personalización';

-- Tabla INVENTARIO: Control de stock por producto, talla y color
CREATE TABLE INVENTARIO (
    inventario_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único del registro de inventario',
    producto_id INT NOT NULL COMMENT 'ID del producto',
    talla ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL', 'N/A') DEFAULT 'N/A' COMMENT 'Talla del producto (N/A para productos sin talla)',
    color VARCHAR(50) DEFAULT 'default' COMMENT 'Color del producto',
    stock INT NOT NULL DEFAULT 0 COMMENT 'Cantidad disponible en inventario',
    stock_minimo INT DEFAULT 10 COMMENT 'Stock mínimo antes de alerta de reposición',
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Última actualización del stock',
    FOREIGN KEY (producto_id) REFERENCES PRODUCTO(producto_id) ON DELETE CASCADE,
    UNIQUE KEY unique_producto_variant (producto_id, talla, color),
    INDEX idx_stock (stock),
    INDEX idx_producto_id (producto_id)
) COMMENT = 'Control de inventario por variante de producto (talla y color)';

-- Tabla CARRITO: Carritos de compra de usuarios activos
CREATE TABLE CARRITO (
    carrito_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único del carrito',
    usuario_id INT UNIQUE NOT NULL COMMENT 'ID del usuario propietario (un carrito por usuario)',
    subtotal DECIMAL(12,2) DEFAULT 0.00 COMMENT 'Subtotal calculado automáticamente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del carrito',
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Última modificación del carrito',
    activo BOOLEAN DEFAULT TRUE COMMENT 'Estado activo/inactivo del carrito',
    FOREIGN KEY (usuario_id) REFERENCES USUARIO(usuario_id) ON DELETE CASCADE
) COMMENT = 'Carritos de compra activos de usuarios (uno por usuario)';

-- Tabla PEDIDO: Pedidos realizados por clientes
CREATE TABLE PEDIDO (
    pedido_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único del pedido',
    usuario_id INT NOT NULL COMMENT 'ID del cliente que realizó el pedido',
    codigo_pedido VARCHAR(50) UNIQUE NOT NULL COMMENT 'Código único de pedido para tracking',
    subtotal DECIMAL(12,2) NOT NULL COMMENT 'Subtotal de productos',
    descuento DECIMAL(12,2) DEFAULT 0.00 COMMENT 'Monto total de descuentos aplicados',
    impuestos DECIMAL(12,2) DEFAULT 0.00 COMMENT 'Impuestos calculados',
    costo_envio DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Costo de envío',
    total DECIMAL(12,2) NOT NULL COMMENT 'Total final del pedido',
    metodo_pago ENUM('tarjeta', 'paypal', 'transferencia', 'puntos') NOT NULL COMMENT 'Método de pago utilizado',
    direccion_envio JSON NOT NULL COMMENT 'Dirección de envío en formato JSON',
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora del pedido',
    FOREIGN KEY (usuario_id) REFERENCES USUARIO(usuario_id),
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_codigo (codigo_pedido),
    INDEX idx_fecha (fecha_pedido)
) COMMENT = 'Pedidos realizados por clientes con información completa de pago y envío';

-- Tabla ESTADO_PEDIDO: Historial de estados de pedidos
CREATE TABLE ESTADO_PEDIDO (
    estado_pedido_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único del registro de estado',
    pedido_id INT NOT NULL COMMENT 'ID del pedido',
    estado ENUM('pendiente', 'confirmado', 'procesando', 'enviado', 'entregado', 'cancelado', 'devuelto') NOT NULL COMMENT 'Estado actual del pedido',
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha del cambio de estado',
    usuario_modificacion_id INT NULL COMMENT 'Usuario que realizó el cambio (si aplica)',
    comentarios TEXT COMMENT 'Comentarios adicionales sobre el cambio de estado',
    FOREIGN KEY (pedido_id) REFERENCES PEDIDO(pedido_id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_modificacion_id) REFERENCES USUARIO(usuario_id) ON DELETE SET NULL,
    INDEX idx_pedido_id (pedido_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha (fecha_cambio)
) COMMENT = 'Historial completo de cambios de estado de pedidos';

-- Tabla ENVIO: Información de envío de pedidos
CREATE TABLE ENVIO (
    envio_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único del envío',
    pedido_id INT UNIQUE NOT NULL COMMENT 'ID del pedido (relación 1:1)',
    proveedor VARCHAR(100) NOT NULL COMMENT 'Empresa proveedora del envío',
    costo DECIMAL(10,2) NOT NULL COMMENT 'Costo del envío',
    codigo_seguimiento VARCHAR(100) COMMENT 'Código de seguimiento del paquete',
    estado ENUM('preparando', 'en_transito', 'entregado', 'devuelto', 'perdido') DEFAULT 'preparando' COMMENT 'Estado actual del envío',
    fecha_envio TIMESTAMP NULL COMMENT 'Fecha real de envío',
    fecha_estimada DATE NOT NULL COMMENT 'Fecha estimada de entrega',
    fecha_entrega TIMESTAMP NULL COMMENT 'Fecha real de entrega',
    direccion_envio JSON NOT NULL COMMENT 'Dirección de entrega en formato JSON',
    FOREIGN KEY (pedido_id) REFERENCES PEDIDO(pedido_id) ON DELETE CASCADE,
    INDEX idx_codigo_seguimiento (codigo_seguimiento),
    INDEX idx_estado (estado),
    INDEX idx_proveedor (proveedor)
) COMMENT = 'Información detallada de envíos con tracking y estados';

-- Tabla RECOMPENSA: Sistema de recompensas y promociones
CREATE TABLE RECOMPENSA (
    recompensa_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único de la recompensa',
    usuario_id INT NOT NULL COMMENT 'ID del usuario propietario',
    tipo ENUM('puntos', 'descuento', 'producto_gratis', 'envio_gratis') NOT NULL COMMENT 'Tipo de recompensa',
    valor DECIMAL(10,2) NOT NULL COMMENT 'Valor de la recompensa (puntos, porcentaje, monto)',
    codigo VARCHAR(50) UNIQUE COMMENT 'Código único de la recompensa (si aplica)',
    descripcion VARCHAR(255) COMMENT 'Descripción de la recompensa',
    redimido BOOLEAN DEFAULT FALSE COMMENT 'Estado de redención',
    pedido_redencion_id INT NULL COMMENT 'ID del pedido donde se redimió',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    fecha_vencimiento DATE COMMENT 'Fecha de vencimiento (si aplica)',
    FOREIGN KEY (usuario_id) REFERENCES USUARIO(usuario_id) ON DELETE CASCADE,
    FOREIGN KEY (pedido_redencion_id) REFERENCES PEDIDO(pedido_id) ON DELETE SET NULL,
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_tipo (tipo),
    INDEX idx_codigo (codigo),
    INDEX idx_redimido (redimido)
) COMMENT = 'Sistema de recompensas por fidelidad y promociones especiales';

-- Tabla NOTIFICACION: Sistema de notificaciones para usuarios
CREATE TABLE NOTIFICACION (
    notificacion_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único de la notificación',
    usuario_id INT NOT NULL COMMENT 'ID del usuario destinatario',
    tipo ENUM('pedido', 'diseño', 'promocion', 'sistema', 'recompensa') NOT NULL COMMENT 'Tipo de notificación',
    titulo VARCHAR(255) NOT NULL COMMENT 'Título de la notificación',
    mensaje TEXT NOT NULL COMMENT 'Contenido completo de la notificación',
    leida BOOLEAN DEFAULT FALSE COMMENT 'Estado de lectura',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    fecha_vencimiento TIMESTAMP NULL COMMENT 'Fecha de vencimiento (si aplica)',
    FOREIGN KEY (usuario_id) REFERENCES USUARIO(usuario_id) ON DELETE CASCADE,
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_tipo (tipo),
    INDEX idx_leida (leida),
    INDEX idx_fecha (fecha_creacion)
) COMMENT = 'Sistema de notificaciones push/email para usuarios';

-- Tabla DESCUENTO_GENERAL: Cupones y descuentos generales
CREATE TABLE DESCUENTO_GENERAL (
    descuento_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único del descuento',
    nombre VARCHAR(200) NOT NULL COMMENT 'Nombre descriptivo del descuento',
    codigo VARCHAR(50) UNIQUE NOT NULL COMMENT 'Código único del cupón',
    porcentaje_descuento DECIMAL(5,2) NOT NULL COMMENT 'Porcentaje de descuento (0.00 a 100.00)',
    monto_minimo DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Monto mínimo de compra para aplicar',
    monto_maximo_descuento DECIMAL(10,2) NULL COMMENT 'Descuento máximo permitido',
    usos_maximos INT NULL COMMENT 'Número máximo de usos (NULL = ilimitado)',
    usos_actuales INT DEFAULT 0 COMMENT 'Número actual de usos',
    fecha_inicio DATETIME NOT NULL COMMENT 'Fecha de inicio de vigencia',
    fecha_fin DATETIME NOT NULL COMMENT 'Fecha de fin de vigencia',
    activo BOOLEAN DEFAULT TRUE COMMENT 'Estado activo/inactivo',
    INDEX idx_codigo (codigo),
    INDEX idx_fechas (fecha_inicio, fecha_fin),
    INDEX idx_activo (activo)
) COMMENT = 'Cupones y descuentos generales con control de uso y vigencia';

-- Tabla PARAMETRO_SISTEMA: Configuraciones del sistema
CREATE TABLE PARAMETRO_SISTEMA (
    parametro_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único del parámetro',
    clave VARCHAR(100) UNIQUE NOT NULL COMMENT 'Clave única del parámetro',
    valor TEXT NOT NULL COMMENT 'Valor del parámetro',
    categoria VARCHAR(50) DEFAULT 'general' COMMENT 'Categoría del parámetro',
    descripcion TEXT COMMENT 'Descripción del propósito del parámetro',
    activo BOOLEAN DEFAULT TRUE COMMENT 'Estado activo/inactivo',
    INDEX idx_clave (clave),
    INDEX idx_categoria (categoria)
) COMMENT = 'Parámetros de configuración global del sistema';

-- Tabla PARAMETRO_SISTEMA_HISTORICO: Historial de cambios en parámetros
CREATE TABLE PARAMETRO_SISTEMA_HISTORICO (
    historico_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único del registro histórico',
    parametro_id INT NOT NULL COMMENT 'ID del parámetro modificado',
    valor_anterior TEXT COMMENT 'Valor antes del cambio',
    valor_nuevo TEXT NOT NULL COMMENT 'Nuevo valor',
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha del cambio',
    usuario_modificacion_id INT COMMENT 'Usuario que realizó el cambio',
    motivo VARCHAR(255) COMMENT 'Motivo del cambio',
    FOREIGN KEY (parametro_id) REFERENCES PARAMETRO_SISTEMA(parametro_id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_modificacion_id) REFERENCES USUARIO(usuario_id) ON DELETE SET NULL,
    INDEX idx_parametro_id (parametro_id),
    INDEX idx_fecha (fecha_cambio)
) COMMENT = 'Historial de cambios en parámetros del sistema para auditoría';

-- Tabla EVENTO: Log de eventos del sistema para analytics
CREATE TABLE EVENTO (
    evento_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único del evento',
    usuario_id INT COMMENT 'ID del usuario relacionado (NULL para eventos del sistema)',
    tipo ENUM('registro', 'login', 'compra', 'diseño_subido', 'calificacion', 'recompensa') NOT NULL COMMENT 'Tipo de evento',
    referencia_id INT NULL COMMENT 'ID de referencia según el tipo de evento',
    metadata JSON COMMENT 'Metadatos adicionales en formato JSON',
    fecha_evento TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora del evento',
    procesado BOOLEAN DEFAULT FALSE COMMENT 'Estado de procesamiento para analytics',
    FOREIGN KEY (usuario_id) REFERENCES USUARIO(usuario_id) ON DELETE SET NULL,
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_tipo (tipo),
    INDEX idx_fecha (fecha_evento),
    INDEX idx_procesado (procesado)
) COMMENT = 'Log de eventos del sistema para analytics y business intelligence';

-- Tabla AUDITORIA_SISTEMA: Auditoría completa de operaciones
CREATE TABLE AUDITORIA_SISTEMA (
    audit_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único de auditoría',
    affected_table VARCHAR(100) NOT NULL COMMENT 'Tabla afectada por la operación',
    operation ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL COMMENT 'Tipo de operación',
    record_id INT NOT NULL COMMENT 'ID del registro afectado',
    old_values JSON COMMENT 'Valores anteriores (para UPDATE y DELETE)',
    new_values JSON COMMENT 'Valores nuevos (para INSERT y UPDATE)',
    usuario_id INT COMMENT 'Usuario que realizó la operación',
    operation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora de la operación',
    ip_address VARCHAR(45) COMMENT 'Dirección IP del origen',
    user_agent TEXT COMMENT 'User agent del navegador/aplicación',
    FOREIGN KEY (usuario_id) REFERENCES USUARIO(usuario_id) ON DELETE SET NULL,
    INDEX idx_table_operation (affected_table, operation),
    INDEX idx_fecha (operation_date),
    INDEX idx_usuario_id (usuario_id)
) COMMENT = 'Auditoría completa de todas las operaciones del sistema';

-- Tablas intermedias para relaciones de M:N

-- Tabla intermedia: CALIFICACION_DISENO (USUARIO ↔ DISENO_PUBLICO)
CREATE TABLE CALIFICACION_DISENO (
    calificacion_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único de la calificación',
    usuario_id INT NOT NULL COMMENT 'ID del usuario que califica',
    diseno_publico_id INT NOT NULL COMMENT 'ID del diseño calificado',
    calificacion TINYINT COMMENT 'Calificación de 1 a 5 estrellas' CHECK (calificacion BETWEEN 1 AND 5),
    comentario TEXT COMMENT 'Comentario opcional del usuario',
    fecha_calificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de la calificación',
    FOREIGN KEY (usuario_id) REFERENCES USUARIO(usuario_id) ON DELETE CASCADE,
    FOREIGN KEY (diseno_publico_id) REFERENCES DISENO_PUBLICO(diseno_publico_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_design_rating (usuario_id, diseno_publico_id),
    INDEX idx_diseno_publico (diseno_publico_id),
    INDEX idx_calificacion (calificacion)
) COMMENT = 'Calificaciones de usuarios a diseños públicos (una por usuario/diseño)';

-- Tabla intermedia: ITEM_CARRITO (CARRITO ↔ PRODUCTO)
CREATE TABLE ITEM_CARRITO (
    item_carrito_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único del item en carrito',
    carrito_id INT NOT NULL COMMENT 'ID del carrito',
    producto_id INT NOT NULL COMMENT 'ID del producto',
    inventario_id INT NOT NULL COMMENT 'ID específico de inventario (talla/color)',
    diseno_id INT NULL COMMENT 'ID del diseño aplicado (NULL para producto sin diseño)',
    cantidad INT NOT NULL DEFAULT 1 COMMENT 'Cantidad del producto',
    precio_unitario DECIMAL(10,2) NOT NULL COMMENT 'Precio unitario al momento de agregar',
    subtotal DECIMAL(12,2) NOT NULL COMMENT 'Subtotal calculado (precio_unitario * cantidad)',
    personalizacion JSON COMMENT 'Datos de personalización adicional',
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de agregado al carrito',
    FOREIGN KEY (carrito_id) REFERENCES CARRITO(carrito_id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES PRODUCTO(producto_id) ON DELETE CASCADE,
    FOREIGN KEY (inventario_id) REFERENCES INVENTARIO(inventario_id),
    FOREIGN KEY (diseno_id) REFERENCES DISENO(diseno_id) ON DELETE SET NULL,
    INDEX idx_carrito_id (carrito_id),
    INDEX idx_producto_id (producto_id),
    INDEX idx_diseno_id (diseno_id)
) COMMENT = 'Items individuales en carritos de compra con personalización';

-- Tabla intermedia: ITEM_PEDIDO (PEDIDO ↔ PRODUCTO)
CREATE TABLE ITEM_PEDIDO (
    item_pedido_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único del item en pedido',
    pedido_id INT NOT NULL COMMENT 'ID del pedido',
    producto_id INT NOT NULL COMMENT 'ID del producto',
    inventario_id INT NOT NULL COMMENT 'ID específico de inventario usado',
    diseno_id INT NULL COMMENT 'ID del diseño aplicado',
    cantidad INT NOT NULL COMMENT 'Cantidad ordenada',
    precio_unitario DECIMAL(10,2) NOT NULL COMMENT 'Precio unitario al momento del pedido',
    subtotal DECIMAL(12,2) NOT NULL COMMENT 'Subtotal del item',
    personalizacion JSON COMMENT 'Datos de personalización aplicada',
    estado_item ENUM('pendiente', 'procesando', 'completado', 'cancelado') DEFAULT 'pendiente' COMMENT 'Estado individual del item',
    FOREIGN KEY (pedido_id) REFERENCES PEDIDO(pedido_id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES PRODUCTO(producto_id),
    FOREIGN KEY (inventario_id) REFERENCES INVENTARIO(inventario_id),
    FOREIGN KEY (diseno_id) REFERENCES DISENO(diseno_id) ON DELETE SET NULL,
    INDEX idx_pedido_id (pedido_id),
    INDEX idx_producto_id (producto_id),
    INDEX idx_diseno_id (diseno_id),
    INDEX idx_estado (estado_item)
) COMMENT = 'Items individuales en pedidos finalizados';

-- Tabla intermedia: PRODUCTO_DISENO_COMPATIBLE (PRODUCTO ↔ DISENO)
CREATE TABLE PRODUCTO_DISENO_COMPATIBLE (
    compatibilidad_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único de compatibilidad',
    producto_id INT NOT NULL COMMENT 'ID del producto',
    categoria_diseno_id INT NOT NULL COMMENT 'ID de la categoría de diseño compatible',
    precio_personalizacion DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Precio adicional por personalización',
    activo BOOLEAN DEFAULT TRUE COMMENT 'Estado activo/inactivo de la compatibilidad',
    FOREIGN KEY (producto_id) REFERENCES PRODUCTO(producto_id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_diseno_id) REFERENCES CATEGORIA_DISENO(categoria_diseno_id) ON DELETE CASCADE,
    UNIQUE KEY unique_product_category (producto_id, categoria_diseno_id),
    INDEX idx_producto_id (producto_id),
    INDEX idx_categoria_diseno (categoria_diseno_id)
) COMMENT = 'Define qué categorías de diseño son compatibles con cada producto';

-- Triggers

-- Trigger para actualizar subtotal del carrito automáticamente
DELIMITER //
CREATE TRIGGER tr_update_carrito_subtotal
AFTER INSERT ON ITEM_CARRITO
FOR EACH ROW
BEGIN
    UPDATE CARRITO
    SET subtotal = (
        SELECT COALESCE(SUM(subtotal), 0)
        FROM ITEM_CARRITO
        WHERE carrito_id = NEW.carrito_id
    )
    WHERE carrito_id = NEW.carrito_id;
END//

-- Trigger para actualizar calificación promedio de diseños públicos
CREATE TRIGGER tr_update_calificacion_promedio
AFTER INSERT ON CALIFICACION_DISENO
FOR EACH ROW
BEGIN
    UPDATE DISENO_PUBLICO
    SET
        calificacion_promedio = (
            SELECT AVG(calificacion)
            FROM CALIFICACION_DISENO
            WHERE diseno_publico_id = NEW.diseno_publico_id
        ),
        total_calificaciones = (
            SELECT COUNT(*)
            FROM CALIFICACION_DISENO
            WHERE diseno_publico_id = NEW.diseno_publico_id
        )
    WHERE diseno_publico_id = NEW.diseno_publico_id;
END//

DELIMITER ;


-- Insertar usuarios de ejemplo
INSERT INTO USUARIO (nombre, apellido, email, contrasena, rol, nivel_vip) VALUES
('Admin', 'Sistema', 'admin@reddisenadores.com', SHA2('admin123', 256), 'admin', 'platinum'),
('María', 'González', 'maria.gonzalez@email.com', SHA2('password123', 256), 'diseñador', 'premium'),
('Carlos', 'Rodríguez', 'carlos.rodriguez@email.com', SHA2('password123', 256), 'cliente', 'basico'),
('Ana', 'López', 'ana.lopez@email.com', SHA2('password123', 256), 'diseñador', 'gold'),
('Revisor', 'Principal', 'revisor@reddisenadores.com', SHA2('revisor123', 256), 'revisor', 'premium');

-- Insertar categorías de diseño
INSERT INTO CATEGORIA_DISENO (nombre, descripcion) VALUES
('Abstracto', 'Diseños abstractos y artísticos'),
('Tipografía', 'Diseños basados en texto y tipografía'),
('Naturaleza', 'Diseños inspirados en la naturaleza'),
('Gaming', 'Diseños relacionados con videojuegos'),
('Minimalista', 'Diseños simples y minimalistas'),
('Vintage', 'Diseños con estilo retro y vintage');

-- Insertar productos
INSERT INTO PRODUCTO (nombre, precio_base, categoria, tipo, descripcion) VALUES
('Camiseta Básica', 15.99, 'Ropa', 'camiseta', 'Camiseta 100% algodón, perfecta para personalizar'),
('Hoodie Premium', 39.99, 'Ropa', 'hoodie', 'Sudadera con capucha de alta calidad'),
('Taza Cerámica', 12.99, 'Accesorios', 'taza', 'Taza de cerámica blanca de 11oz'),
('Poster A3', 8.99, 'Decoración', 'poster', 'Poster de alta calidad en papel mate'),
('Sticker Pack', 4.99, 'Accesorios', 'sticker', 'Pack de 5 stickers resistentes al agua');

-- Insertar inventario
INSERT INTO INVENTARIO (producto_id, talla, color, stock) VALUES
(1, 'S', 'blanco', 50), (1, 'M', 'blanco', 75), (1, 'L', 'blanco', 60),
(1, 'S', 'negro', 45), (1, 'M', 'negro', 80), (1, 'L', 'negro', 55),
(2, 'S', 'gris', 30), (2, 'M', 'gris', 45), (2, 'L', 'gris', 35),
(3, 'N/A', 'blanco', 100), (3, 'N/A', 'negro', 80),
(4, 'N/A', 'default', 200),
(5, 'N/A', 'variado', 150);

-- Insertar parámetros del sistema
INSERT INTO PARAMETRO_SISTEMA (clave, valor, categoria, descripcion) VALUES
('puntos_por_compra', '10', 'recompensas', 'Puntos otorgados por cada $10 de compra'),
('envio_gratis_minimo', '50.00', 'envio', 'Monto mínimo para envío gratuito'),
('comision_diseñador', '0.15', 'pagos', 'Comisión del diseñador por uso de su diseño'),
('stock_minimo_alerta', '10', 'inventario', 'Stock mínimo antes de enviar alerta');

-- Insertar algunos descuentos de ejemplo
INSERT INTO DESCUENTO_GENERAL (nombre, codigo, porcentaje_descuento, monto_minimo, fecha_inicio, fecha_fin) VALUES
('Descuento Bienvenida', 'BIENVENIDO20', 20.00, 25.00, '2025-01-01 00:00:00', '2025-12-31 23:59:59'),
('Black Friday', 'BLACKFRIDAY50', 50.00, 50.00, '2025-11-25 00:00:00', '2025-11-30 23:59:59'),
('Envío Gratis', 'ENVIOGRATIS', 100.00, 30.00, '2025-01-01 00:00:00', '2025-12-31 23:59:59');

SET FOREIGN_KEY_CHECKS = 1;