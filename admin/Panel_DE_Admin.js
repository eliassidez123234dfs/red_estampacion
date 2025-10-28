// Global variables and data
let currentTheme = localStorage.getItem('theme') || 'light';
let salesChart = null;
let productsChart = null;

// Sample data
let ordersData = [
    {
        id: 1,
        cliente: 'Ana María López',
        producto: 'Polo Empresarial',
        diseño: 'Logo corporativo',
        cantidad: 30,
        estado: 'produccion',
        fecha: '2024-09-17',
        total: 450
    },
    {
        id: 2,
        cliente: 'Carlos Rodríguez',
        producto: 'Camiseta Básica',
        diseño: 'Diseño personalizado',
        cantidad: 50,
        estado: 'completado',
        fecha: '2024-09-16',
        total: 750
    },
    {
        id: 3,
        cliente: 'Empresa Tech Solutions',
        producto: 'Polo Corporativo',
        diseño: 'Logo empresa',
        cantidad: 100,
        estado: 'pendiente',
        fecha: '2024-09-17',
        total: 2500
    },
    {
        id: 4,
        cliente: 'María González',
        producto: 'Camiseta Básica',
        diseño: 'Arte personalizado',
        cantidad: 25,
        estado: 'produccion',
        fecha: '2024-09-15',
        total: 375
    },
    {
        id: 5,
        cliente: 'Fundación Esperanza',
        producto: 'Polo',
        diseño: 'Logo fundación',
        cantidad: 75,
        estado: 'completado',
        fecha: '2024-09-14',
        total: 1125
    }
];

let productsData = [
    {
        id: 1,
        nombre: 'Polo Básico',
        precio: 25,
        stock: 85,
        categoria: 'Polo',
        imagen: '👔'
    },
    {
        id: 2,
        nombre: 'Camiseta Básica',
        precio: 15,
        stock: 156,
        categoria: 'Camiseta',
        imagen: '👕'
    },
    {
        id: 3,
        nombre: 'Polo Premium',
        precio: 35,
        stock: 42,
        categoria: 'Polo',
        imagen: '👔'
    },
    {
        id: 4,
        nombre: 'Camiseta Premium',
        precio: 20,
        stock: 89,
        categoria: 'Camiseta',
        imagen: '👕'
    }
];

let clientsData = [
    {
        id: 1,
        nombre: 'Ana María López',
        email: 'ana.lopez@email.com',
        tipo: 'particular',
        pedidos: 3,
        totalGastado: 1200
    },
    {
        id: 2,
        nombre: 'Empresa Tech Solutions',
        email: 'contacto@techsolutions.com',
        tipo: 'empresa',
        pedidos: 8,
        totalGastado: 15750
    },
    {
        id: 3,
        nombre: 'Carlos Rodríguez',
        email: 'carlos.r@email.com',
        tipo: 'particular',
        pedidos: 2,
        totalGastado: 850
    },
    {
        id: 4,
        nombre: 'Fundación Esperanza',
        email: 'info@fundacionesperanza.org',
        tipo: 'empresa',
        pedidos: 5,
        totalGastado: 4200
    }
];

let designsData = [
    {
        id: 1,
        nombre: 'Logo Corporativo Clásico',
        categoria: 'Empresarial',
        usos: 45,
        fecha: '2024-09-10'
    },
    {
        id: 2,
        nombre: 'Design Deportivo Moderno',
        categoria: 'Deportes',
        usos: 32,
        fecha: '2024-09-12'
    },
    {
        id: 3,
        nombre: 'Arte Abstracto Creativo',
        categoria: 'Artístico',
        usos: 18,
        fecha: '2024-09-14'
    },
    {
        id: 4,
        nombre: 'Logo Minimalista',
        categoria: 'Empresarial',
        usos: 28,
        fecha: '2024-09-16'
    }
];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupTheme();
    setupNavigation();
    setupEventListeners();
    loadDashboardData();
    loadOrdersData();
    loadProductsData();
    loadClientsData();
    loadDesignsData();
    loadInventoryData();
    loadReportsData();
    loadSupportData();
    feather.replace();
}

// Theme Management
function setupTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeToggle();
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeToggle();
    
    // Update charts with new theme
    if (salesChart) {
        updateChartTheme(salesChart);
    }
    if (productsChart) {
        updateChartTheme(productsChart);
    }
}

function updateThemeToggle() {
    const themeText = document.getElementById('theme-text');
    themeText.textContent = currentTheme === 'light' ? 'Modo Oscuro' : 'Modo Claro';
}

// Navigation
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const section = button.getAttribute('data-section');
            showSection(section);
        });
    });

    const quickActionCards = document.querySelectorAll('.quick-action-card');
    quickActionCards.forEach(card => {
        card.addEventListener('click', () => {
            const action = card.getAttribute('data-action');
            showSection(action);
        });
    });
}

function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));

    // Show selected section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update navigation buttons
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-section') === sectionName) {
            button.classList.add('active');
        }
    });

    feather.replace();
}

// Event Listeners
function setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Search and filters
    setupSearchAndFilters();

    // Form submissions
    setupForms();

    // Action buttons
    setupActionButtons();

    // Modal handling
    setupModal();
}

function setupSearchAndFilters() {
    // Orders search and filter
    const orderSearch = document.getElementById('orderSearch');
    const statusFilter = document.getElementById('statusFilter');
    const productFilter = document.getElementById('productFilter');

    if (orderSearch) {
        orderSearch.addEventListener('input', filterOrders);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', filterOrders);
    }
    if (productFilter) {
        productFilter.addEventListener('change', filterOrders);
    }

    // Clients search
    const clientSearch = document.getElementById('clientSearch');
    const clientTypeFilter = document.getElementById('clientTypeFilter');

    if (clientSearch) {
        clientSearch.addEventListener('input', filterClients);
    }
    if (clientTypeFilter) {
        clientTypeFilter.addEventListener('change', filterClients);
    }
}

function setupForms() {
    // General settings form
    const generalForm = document.getElementById('generalSettingsForm');
    if (generalForm) {
        generalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveGeneralSettings();
        });
    }

    // Pricing form
    const pricingForm = document.getElementById('pricingForm');
    if (pricingForm) {
        pricingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            savePricingSettings();
        });
    }

    // Support form
    const supportForm = document.getElementById('supportForm');
    if (supportForm) {
        supportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitSupportTicket();
        });
    }
}

function setupActionButtons() {
    // New order buttons
    const newOrderBtns = document.querySelectorAll('#newOrderBtn, #addOrderBtn');
    newOrderBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => showOrderModal());
        }
    });

    // Add product button
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => showProductModal());
    }

    // Add design button
    const addDesignBtn = document.getElementById('addDesignBtn');
    if (addDesignBtn) {
        addDesignBtn.addEventListener('click', () => showDesignModal());
    }

    // Add client button
    const addClientBtn = document.getElementById('addClientBtn');
    if (addClientBtn) {
        addClientBtn.addEventListener('click', () => showClientModal());
    }

    // Generate report button
    const generateReportBtn = document.getElementById('generateReportBtn');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', generateReport);
    }

    // Add stock button
    const addStockBtn = document.getElementById('addStockBtn');
    if (addStockBtn) {
        addStockBtn.addEventListener('click', () => showStockModal());
    }
}

function setupModal() {
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modalClose');

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}

// Dashboard Data Loading
function loadDashboardData() {
    updateDashboardStats();
    loadRecentOrders();
    createSalesChart();
}

function updateDashboardStats() {
    // Calculate real-time stats
    const completedOrders = ordersData.filter(order => order.estado === 'completado');
    const activeOrders = ordersData.filter(order => order.estado !== 'completado');
    const dailySales = completedOrders.reduce((sum, order) => sum + order.total, 0);
    const totalPolos = productsData.filter(p => p.categoria === 'Polo').reduce((sum, p) => sum + p.stock, 0);
    const totalShirts = productsData.filter(p => p.categoria === 'Camiseta').reduce((sum, p) => sum + p.stock, 0);

    // Update UI
    document.getElementById('dailySales').textContent = `$${dailySales.toLocaleString()}`;
    document.getElementById('activeOrders').textContent = activeOrders.length;
    document.getElementById('poloStock').textContent = totalPolos;
    document.getElementById('shirtStock').textContent = totalShirts;
}

function loadRecentOrders() {
    const container = document.getElementById('recentOrders');
    if (!container) return;

    const recentOrders = ordersData.slice(0, 3);
    container.innerHTML = recentOrders.map(order => `
        <div class="item">
            <div class="item-info">
                <h4>${order.cliente}</h4>
                <p>${order.producto} - ${order.cantidad} uds.</p>
            </div>
            <span class="status-badge status-${order.estado}">${getStatusText(order.estado)}</span>
        </div>
    `).join('');
}

function getStatusText(status) {
    const statusMap = {
        'pendiente': 'Pendiente',
        'produccion': 'En producción',
        'completado': 'Completado'
    };
    return statusMap[status] || status;
}

function createSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;

    const data = {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        datasets: [{
            label: 'Ventas ($)',
            data: [1200, 1900, 800, 1500, 2400, 1800, 2200],
            borderColor: '#dc2626',
            backgroundColor: 'rgba(220, 38, 38, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: currentTheme === 'dark' ? '#374151' : '#e5e7eb'
                    },
                    ticks: {
                        color: currentTheme === 'dark' ? '#d1d5db' : '#6b7280'
                    }
                },
                x: {
                    grid: {
                        color: currentTheme === 'dark' ? '#374151' : '#e5e7eb'
                    },
                    ticks: {
                        color: currentTheme === 'dark' ? '#d1d5db' : '#6b7280'
                    }
                }
            }
        }
    };

    salesChart = new Chart(ctx, config);
}

function updateChartTheme(chart) {
    const gridColor = currentTheme === 'dark' ? '#374151' : '#e5e7eb';
    const textColor = currentTheme === 'dark' ? '#d1d5db' : '#6b7280';
    
    chart.options.scales.y.grid.color = gridColor;
    chart.options.scales.x.grid.color = gridColor;
    chart.options.scales.y.ticks.color = textColor;
    chart.options.scales.x.ticks.color = textColor;
    
    chart.update();
}

// Orders Management
function loadOrdersData() {
    renderOrdersTable(ordersData);
}

function renderOrdersTable(orders) {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;

    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>
                <div>
                    <div style="font-weight: 600;">${order.cliente}</div>
                    <div style="font-size: 14px; color: var(--text-secondary);">${order.fecha}</div>
                </div>
            </td>
            <td>
                <div>
                    <div style="font-weight: 500;">${order.producto}</div>
                    <div style="font-size: 14px; color: var(--text-secondary);">${order.diseño}</div>
                </div>
            </td>
            <td>${order.cantidad}</td>
            <td><span class="status-badge status-${order.estado}">${getStatusText(order.estado)}</span></td>
            <td style="font-weight: 600; color: var(--success-color);">${order.total}</td>
            <td>
                <div class="actions">
                    <button class="action-btn" onclick="viewOrder(${order.id})" title="Ver detalles">
                        <i data-feather="eye"></i>
                    </button>
                    <button class="action-btn" onclick="editOrder(${order.id})" title="Editar">
                        <i data-feather="edit"></i>
                    </button>
                    <button class="action-btn" onclick="deleteOrder(${order.id})" title="Eliminar">
                        <i data-feather="trash-2"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    feather.replace();
}

function filterOrders() {
    const searchTerm = document.getElementById('orderSearch').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const productFilter = document.getElementById('productFilter').value.toLowerCase();

    const filteredOrders = ordersData.filter(order => {
        const matchesSearch = order.cliente.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || order.estado === statusFilter;
        const matchesProduct = !productFilter || order.producto.toLowerCase().includes(productFilter);
        
        return matchesSearch && matchesStatus && matchesProduct;
    });

    renderOrdersTable(filteredOrders);
}

function viewOrder(id) {
    const order = ordersData.find(o => o.id === id);
    if (!order) return;

    showModal(`
        <h3>Detalles del Pedido #${order.id}</h3>
        <div style="margin-top: 20px;">
            <p><strong>Cliente:</strong> ${order.cliente}</p>
            <p><strong>Producto:</strong> ${order.producto}</p>
            <p><strong>Diseño:</strong> ${order.diseño}</p>
            <p><strong>Cantidad:</strong> ${order.cantidad} unidades</p>
            <p><strong>Estado:</strong> <span class="status-badge status-${order.estado}">${getStatusText(order.estado)}</span></p>
            <p><strong>Fecha:</strong> ${order.fecha}</p>
            <p><strong>Total:</strong> ${order.total}</p>
        </div>
    `);
}

function editOrder(id) {
    const order = ordersData.find(o => o.id === id);
    if (!order) return;

    showModal(`
        <h3>Editar Pedido #${order.id}</h3>
        <form id="editOrderForm" style="margin-top: 20px;">
            <div class="form-group">
                <label class="form-label">Cliente</label>
                <input type="text" class="form-input" value="${order.cliente}" id="editCliente" required>
            </div>
            <div class="form-group">
                <label class="form-label">Producto</label>
                <select class="form-input" id="editProducto" required>
                    <option value="Polo" ${order.producto.includes('Polo') ? 'selected' : ''}>Polo</option>
                    <option value="Camiseta Básica" ${order.producto.includes('Camiseta') ? 'selected' : ''}>Camiseta Básica</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Cantidad</label>
                <input type="number" class="form-input" value="${order.cantidad}" id="editCantidad" required>
            </div>
            <div class="form-group">
                <label class="form-label">Estado</label>
                <select class="form-input" id="editEstado" required>
                    <option value="pendiente" ${order.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                    <option value="produccion" ${order.estado === 'produccion' ? 'selected' : ''}>En producción</option>
                    <option value="completado" ${order.estado === 'completado' ? 'selected' : ''}>Completado</option>
                </select>
            </div>
            <button type="submit" class="btn-primary">
                <i data-feather="save"></i> Guardar Cambios
            </button>
        </form>
    `);

    document.getElementById('editOrderForm').addEventListener('submit', function(e) {
        e.preventDefault();
        updateOrder(id);
    });
}

function updateOrder(id) {
    const orderIndex = ordersData.findIndex(o => o.id === id);
    if (orderIndex === -1) return;

    ordersData[orderIndex] = {
        ...ordersData[orderIndex],
        cliente: document.getElementById('editCliente').value,
        producto: document.getElementById('editProducto').value,
        cantidad: parseInt(document.getElementById('editCantidad').value),
        estado: document.getElementById('editEstado').value
    };

    closeModal();
    loadOrdersData();
    updateDashboardStats();
    showAlert('Pedido actualizado correctamente', 'success');
}

function deleteOrder(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este pedido?')) {
        ordersData = ordersData.filter(o => o.id !== id);
        loadOrdersData();
        updateDashboardStats();
        showAlert('Pedido eliminado correctamente', 'success');
    }
}

function showOrderModal() {
    showModal(`
        <h3>Nuevo Pedido</h3>
        <form id="newOrderForm" style="margin-top: 20px;">
            <div class="form-group">
                <label class="form-label">Cliente</label>
                <input type="text" class="form-input" id="newCliente" required>
            </div>
            <div class="form-group">
                <label class="form-label">Producto</label>
                <select class="form-input" id="newProducto" required>
                    <option value="">Seleccionar producto</option>
                    <option value="Polo">Polo</option>
                    <option value="Camiseta Básica">Camiseta Básica</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Diseño</label>
                <input type="text" class="form-input" id="newDiseño" required>
            </div>
            <div class="form-group">
                <label class="form-label">Cantidad</label>
                <input type="number" class="form-input" id="newCantidad" min="1" required>
            </div>
            <button type="submit" class="btn-primary">
                <i data-feather="plus"></i> Crear Pedido
            </button>
        </form>
    `);

    document.getElementById('newOrderForm').addEventListener('submit', function(e) {
        e.preventDefault();
        createNewOrder();
    });
}

function createNewOrder() {
    const newOrder = {
        id: Math.max(...ordersData.map(o => o.id)) + 1,
        cliente: document.getElementById('newCliente').value,
        producto: document.getElementById('newProducto').value,
        diseño: document.getElementById('newDiseño').value,
        cantidad: parseInt(document.getElementById('newCantidad').value),
        estado: 'pendiente',
        fecha: new Date().toISOString().split('T')[0],
        total: calculateOrderTotal()
    };

    ordersData.unshift(newOrder);
    closeModal();
    loadOrdersData();
    updateDashboardStats();
    showAlert('Pedido creado correctamente', 'success');
}

function calculateOrderTotal() {
    const producto = document.getElementById('newProducto').value;
    const cantidad = parseInt(document.getElementById('newCantidad').value);
    const precio = producto === 'Polo' ? 25 : 15;
    return precio * cantidad;
}

// Products Management
function loadProductsData() {
    renderProductsGrid(productsData);
}

function renderProductsGrid(products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">${product.imagen}</div>
            <div class="product-info">
                <h4>${product.nombre}</h4>
                <p class="product-category">${product.categoria}</p>
                <div class="product-details">
                    <span class="product-price">${product.precio}</span>
                    <span class="stock-badge ${getStockClass(product.stock)}">Stock: ${product.stock}</span>
                </div>
                <div class="product-actions">
                    <button class="btn-edit" onclick="editProduct(${product.id})">Editar</button>
                    <button class="btn-delete" onclick="deleteProduct(${product.id})">
                        <i data-feather="trash-2"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    feather.replace();
}

function getStockClass(stock) {
    if (stock > 100) return 'stock-high';
    if (stock > 50) return 'stock-medium';
    return 'stock-low';
}

function editProduct(id) {
    const product = productsData.find(p => p.id === id);
    if (!product) return;

    showModal(`
        <h3>Editar Producto</h3>
        <form id="editProductForm" style="margin-top: 20px;">
            <div class="form-group">
                <label class="form-label">Nombre</label>
                <input type="text" class="form-input" value="${product.nombre}" id="editProductName" required>
            </div>
            <div class="form-group">
                <label class="form-label">Precio</label>
                <input type="number" class="form-input" value="${product.precio}" id="editProductPrice" min="0" step="0.01" required>
            </div>
            <div class="form-group">
                <label class="form-label">Stock</label>
                <input type="number" class="form-input" value="${product.stock}" id="editProductStock" min="0" required>
            </div>
            <div class="form-group">
                <label class="form-label">Categoría</label>
                <select class="form-input" id="editProductCategory" required>
                    <option value="Polo" ${product.categoria === 'Polo' ? 'selected' : ''}>Polo</option>
                    <option value="Camiseta" ${product.categoria === 'Camiseta' ? 'selected' : ''}>Camiseta</option>
                </select>
            </div>
            <button type="submit" class="btn-primary">
                <i data-feather="save"></i> Guardar Cambios
            </button>
        </form>
    `);

    document.getElementById('editProductForm').addEventListener('submit', function(e) {
        e.preventDefault();
        updateProduct(id);
    });
}

function updateProduct(id) {
    const productIndex = productsData.findIndex(p => p.id === id);
    if (productIndex === -1) return;

    productsData[productIndex] = {
        ...productsData[productIndex],
        nombre: document.getElementById('editProductName').value,
        precio: parseFloat(document.getElementById('editProductPrice').value),
        stock: parseInt(document.getElementById('editProductStock').value),
        categoria: document.getElementById('editProductCategory').value
    };

    closeModal();
    loadProductsData();
    updateDashboardStats();
    showAlert('Producto actualizado correctamente', 'success');
}

function deleteProduct(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        productsData = productsData.filter(p => p.id !== id);
        loadProductsData();
        updateDashboardStats();
        showAlert('Producto eliminado correctamente', 'success');
    }
}

function showProductModal() {
    showModal(`
        <h3>Nuevo Producto</h3>
        <form id="newProductForm" style="margin-top: 20px;">
            <div class="form-group">
                <label class="form-label">Nombre</label>
                <input type="text" class="form-input" id="newProductName" required>
            </div>
            <div class="form-group">
                <label class="form-label">Precio</label>
                <input type="number" class="form-input" id="newProductPrice" min="0" step="0.01" required>
            </div>
            <div class="form-group">
                <label class="form-label">Stock Inicial</label>
                <input type="number" class="form-input" id="newProductStock" min="0" required>
            </div>
            <div class="form-group">
                <label class="form-label">Categoría</label>
                <select class="form-input" id="newProductCategory" required>
                    <option value="">Seleccionar categoría</option>
                    <option value="Polo">Polo</option>
                    <option value="Camiseta">Camiseta</option>
                </select>
            </div>
            <button type="submit" class="btn-primary">
                <i data-feather="plus"></i> Crear Producto
            </button>
        </form>
    `);

    document.getElementById('newProductForm').addEventListener('submit', function(e) {
        e.preventDefault();
        createNewProduct();
    });
}

function createNewProduct() {
    const newProduct = {
        id: Math.max(...productsData.map(p => p.id)) + 1,
        nombre: document.getElementById('newProductName').value,
        precio: parseFloat(document.getElementById('newProductPrice').value),
        stock: parseInt(document.getElementById('newProductStock').value),
        categoria: document.getElementById('newProductCategory').value,
        imagen: document.getElementById('newProductCategory').value === 'Polo' ? '👔' : '👕'
    };

    productsData.unshift(newProduct);
    closeModal();
    loadProductsData();
    updateDashboardStats();
    showAlert('Producto creado correctamente', 'success');
}

// Clients Management
function loadClientsData() {
    renderClientsTable(clientsData);
}

function renderClientsTable(clients) {
    const tbody = document.getElementById('clientsTableBody');
    if (!tbody) return;

    tbody.innerHTML = clients.map(client => `
        <tr>
            <td style="font-weight: 600;">${client.nombre}</td>
            <td>${client.email}</td>
            <td>
                <span class="status-badge ${client.tipo === 'empresa' ? 'status-production' : 'status-completed'}">
                    ${client.tipo === 'empresa' ? 'Empresa' : 'Particular'}
                </span>
            </td>
            <td>${client.pedidos}</td>
            <td style="font-weight: 600; color: var(--success-color);">${client.totalGastado.toLocaleString()}</td>
            <td>
                <div class="actions">
                    <button class="action-btn" onclick="viewClient(${client.id})" title="Ver detalles">
                        <i data-feather="eye"></i>
                    </button>
                    <button class="action-btn" onclick="editClient(${client.id})" title="Editar">
                        <i data-feather="edit"></i>
                    </button>
                    <button class="action-btn" onclick="deleteClient(${client.id})" title="Eliminar">
                        <i data-feather="trash-2"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    feather.replace();
}

function filterClients() {
    const searchTerm = document.getElementById('clientSearch').value.toLowerCase();
    const typeFilter = document.getElementById('clientTypeFilter').value;

    const filteredClients = clientsData.filter(client => {
        const matchesSearch = client.nombre.toLowerCase().includes(searchTerm) || 
                            client.email.toLowerCase().includes(searchTerm);
        const matchesType = !typeFilter || client.tipo === typeFilter;
        
        return matchesSearch && matchesType;
    });

    renderClientsTable(filteredClients);
}

function viewClient(id) {
    const client = clientsData.find(c => c.id === id);
    if (!client) return;

    showModal(`
        <h3>Detalles del Cliente</h3>
        <div style="margin-top: 20px;">
            <p><strong>Nombre:</strong> ${client.nombre}</p>
            <p><strong>Email:</strong> ${client.email}</p>
            <p><strong>Tipo:</strong> ${client.tipo === 'empresa' ? 'Empresa' : 'Particular'}</p>
            <p><strong>Pedidos:</strong> ${client.pedidos}</p>
            <p><strong>Total Gastado:</strong> ${client.totalGastado.toLocaleString()}</p>
        </div>
    `);
}

function editClient(id) {
    const client = clientsData.find(c => c.id === id);
    if (!client) return;

    showModal(`
        <h3>Editar Cliente</h3>
        <form id="editClientForm" style="margin-top: 20px;">
            <div class="form-group">
                <label class="form-label">Nombre</label>
                <input type="text" class="form-input" value="${client.nombre}" id="editClientName" required>
            </div>
            <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" class="form-input" value="${client.email}" id="editClientEmail" required>
            </div>
            <div class="form-group">
                <label class="form-label">Tipo</label>
                <select class="form-input" id="editClientType" required>
                    <option value="particular" ${client.tipo === 'particular' ? 'selected' : ''}>Particular</option>
                    <option value="empresa" ${client.tipo === 'empresa' ? 'selected' : ''}>Empresa</option>
                </select>
            </div>
            <button type="submit" class="btn-primary">
                <i data-feather="save"></i> Guardar Cambios
            </button>
        </form>
    `);

    document.getElementById('editClientForm').addEventListener('submit', function(e) {
        e.preventDefault();
        updateClient(id);
    });
}

function updateClient(id) {
    const clientIndex = clientsData.findIndex(c => c.id === id);
    if (clientIndex === -1) return;

    clientsData[clientIndex] = {
        ...clientsData[clientIndex],
        nombre: document.getElementById('editClientName').value,
        email: document.getElementById('editClientEmail').value,
        tipo: document.getElementById('editClientType').value
    };

    closeModal();
    loadClientsData();
    showAlert('Cliente actualizado correctamente', 'success');
}

function deleteClient(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
        clientsData = clientsData.filter(c => c.id !== id);
        loadClientsData();
        showAlert('Cliente eliminado correctamente', 'success');
    }
}

// Designs Management
function loadDesignsData() {
    renderDesignsGrid(designsData);
}

function renderDesignsGrid(designs) {
    const grid = document.getElementById('designsGrid');
    if (!grid) return;

    grid.innerHTML = designs.map(design => `
        <div class="product-card">
            <div class="product-image">🎨</div>
            <div class="product-info">
                <h4>${design.nombre}</h4>
                <p class="product-category">${design.categoria}</p>
                <div class="product-details">
                    <span>Usos: ${design.usos}</span>
                    <span>Fecha: ${design.fecha}</span>
                </div>
                <div class="product-actions">
                    <button class="btn-edit" onclick="editDesign(${design.id})">Editar</button>
                    <button class="btn-delete" onclick="deleteDesign(${design.id})">
                        <i data-feather="trash-2"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    feather.replace();
}

function editDesign(id) {
    const design = designsData.find(d => d.id === id);
    if (!design) return;

      showModal(`
        <h3>Editar Diseño</h3>
        <form id="editDesignForm" style="margin-top: 20px;">
            <div class="form-group">
                <label class="form-label">Nombre</label>
                <input type="text" class="form-input" value="${design.nombre}" id="editDesignName" required>
            </div>
            <div class="form-group">
                <label class="form-label">Categoría</label>
                <input type="text" class="form-input" value="${design.categoria}" id="editDesignCategory" required>
            </div>
            <div class="form-group">
                <label class="form-label">Usos</label>
                <input type="number" class="form-input" value="${design.usos}" id="editDesignUsos" required>
            </div>
            <div class="form-group">
                <label class="form-label">Fecha</label>
                <input type="date" class="form-input" value="${design.fecha}" id="editDesignFecha" required>
            </div>
            <button type="submit" class="btn-primary">
                <i data-feather="save"></i> Guardar Cambios
            </button>
        </form>
    `);

    document.getElementById('editDesignForm').addEventListener('submit', function(e) {
        e.preventDefault();
        updateDesign(id);
    });
}

function updateDesign(id) {
    const index = designsData.findIndex(d => d.id === id);
    if (index === -1) return;

    designsData[index].nombre = document.getElementById('editDesignName').value;
    designsData[index].categoria = document.getElementById('editDesignCategory').value;
    designsData[index].usos = parseInt(document.getElementById('editDesignUsos').value);
    designsData[index].fecha = document.getElementById('editDesignFecha').value;

    closeModal();
    loadDesignsData();
    showAlert('Diseño actualizado correctamente', 'success');
}

function deleteDesign(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este diseño?')) return;
    designsData = designsData.filter(d => d.id !== id);
    loadDesignsData();
    showAlert('Diseño eliminado', 'success');
}

function showDesignModal() {
    showModal(`
        <h3>Nuevo Diseño</h3>
        <form id="newDesignForm" style="margin-top: 20px;">
            <div class="form-group">
                <label class="form-label">Nombre</label>
                <input type="text" class="form-input" id="newDesignName" required>
            </div>
            <div class="form-group">
                <label class="form-label">Categoría</label>
                <input type="text" class="form-input" id="newDesignCategory" required>
            </div>
            <div class="form-group">
                <label class="form-label">Fecha</label>
                <input type="date" class="form-input" id="newDesignFecha" required>
            </div>
            <button type="submit" class="btn-primary">
                <i data-feather="plus"></i> Crear Diseño
            </button>
        </form>
    `);

    document.getElementById('newDesignForm').addEventListener('submit', function(e) {
        e.preventDefault();
        createNewDesign();
    });
}

function createNewDesign() {
    const nuevo = {
        id: Date.now(),
        nombre: document.getElementById('newDesignName').value,
        categoria: document.getElementById('newDesignCategory').value,
        usos: 0,
        fecha: document.getElementById('newDesignFecha').value
    };

    designsData.push(nuevo);
    closeModal();
    loadDesignsData();
    showAlert('Diseño creado correctamente', 'success');
}

// Inventario
function loadInventoryData() {
    const grid = document.getElementById('inventoryGrid');
    if (!grid) return;

    grid.innerHTML = productsData.map(product => `
        <div class="product-card">
            <div class="product-image">${product.imagen}</div>
            <div class="product-info">
                <h4>${product.nombre}</h4>
                <div class="product-details">
                    <span>Stock: ${product.stock}</span>
                </div>
                <div class="product-actions">
                    <button class="btn-edit" onclick="addStock(${product.id})">Añadir Stock</button>
                </div>
            </div>
        </div>
    `).join('');

    checkLowStock();
}

function addStock(id) {
    const product = productsData.find(p => p.id === id);
    if (!product) return;

    showModal(`
        <h3>Añadir Stock a ${product.nombre}</h3>
        <form id="addStockForm" style="margin-top: 20px;">
            <div class="form-group">
                <label class="form-label">Cantidad</label>
                <input type="number" class="form-input" id="stockAmount" min="1" required>
            </div>
            <button type="submit" class="btn-primary">
                <i data-feather="plus"></i> Añadir
            </button>
        </form>
    `);

    document.getElementById('addStockForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const amount = parseInt(document.getElementById('stockAmount').value);
        product.stock += amount;
        closeModal();
        loadInventoryData();
        loadProductsData();
        updateDashboardStats();
        showAlert('Stock añadido correctamente', 'success');
    });
}

function checkLowStock() {
    const lowStockProducts = productsData.filter(p => p.stock < 20);
    const alert = document.getElementById('lowStockAlert');
    if (alert) {
        alert.style.display = lowStockProducts.length > 0 ? 'block' : 'none';
    }
}

// Reportes
function loadReportsData() {
    createProductsChart();
}

function createProductsChart() {
    const ctx = document.getElementById('productsChart');
    if (!ctx) return;

    const productNames = productsData.map(p => p.nombre);
    const productSales = productsData.map(p => Math.floor(Math.random() * 1000));

    const data = {
        labels: productNames,
        datasets: [{
            label: 'Ventas por Producto',
            data: productSales,
            backgroundColor: ['#dc2626', '#2563eb', '#059669', '#d97706'],
            borderWidth: 0
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: currentTheme === 'dark' ? '#374151' : '#e5e7eb' },
                    ticks: { color: currentTheme === 'dark' ? '#d1d5db' : '#6b7280' }
                },
                x: {
                    grid: { color: currentTheme === 'dark' ? '#374151' : '#e5e7eb' },
                    ticks: { color: currentTheme === 'dark' ? '#d1d5db' : '#6b7280' }
                }
            }
        }
    };

    productsChart = new Chart(ctx, config);
}

// Ajustes
function saveGeneralSettings() {
    showAlert('Configuración general guardada correctamente', 'success');
}

function savePricingSettings() {
    showAlert('Precios actualizados correctamente', 'success');
}

// Soporte
function loadSupportData() {
    const faqList = document.getElementById('faqList');
    if (!faqList) return;

    const faqs = [
        { question: '¿Cómo puedo crear un nuevo pedido?', answer: 'Para crear un nuevo pedido, ve a la sección de Pedidos y haz clic en "Nuevo Pedido".' },
        { question: '¿Cómo puedo cambiar el tema del panel?', answer: 'Haz clic en el botón de modo oscuro/claro en la barra lateral.' },
        { question: '¿Puedo exportar reportes?', answer: 'Sí, en la sección de Reportes puedes generar y descargar reportes en formato PDF.' }
    ];

    faqList.innerHTML = faqs.map(faq => `
        <div class="faq-item">
            <div class="faq-question">${faq.question}</div>
            <div class="faq-answer">${faq.answer}</div>
        </div>
    `).join('');

    faqList.querySelectorAll('.faq-item').forEach(item => {
        item.addEventListener('click', () => item.classList.toggle('active'));
    });
}

function submitSupportTicket() {
    showAlert('Tu solicitud de soporte ha sido enviada', 'success');
    closeModal();
}

// Generar Reporte
function generateReport() {
    showAlert('Reporte generado correctamente', 'success');
}

// Modal
function showModal(content) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    if (modal && modalBody) {
        modalBody.innerHTML = content;
        modal.style.display = 'block';
        feather.replace();
    }
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) modal.style.display = 'none';
}

// Alertas
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = message;
    
    const container = document.querySelector('.main-content');
    if (container) {
        container.insertBefore(alert, container.firstChild);
        setTimeout(() => alert.remove(), 3000);
    }
}

// Navegación entre secciones
function setupNavigation() {
    const buttons = document.querySelectorAll(".nav-button");
    const sections = document.querySelectorAll(".section");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Quitar clase activa a todos los botones
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // Ocultar todas las secciones
            sections.forEach(sec => sec.classList.remove("active"));

            // Mostrar la sección seleccionada
            const target = btn.dataset.section;
            document.getElementById(target).classList.add("active");
        });
    });
}

// Llamamos a esta función cuando carga la página
document.addEventListener("DOMContentLoaded", () => {
    setupNavigation();
});
