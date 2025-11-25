       // ===== VERIFICACIÓN DE AUTENTICACIÓN =====
        document.addEventListener('DOMContentLoaded', function () {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));

            if (!currentUser || currentUser.rol !== 'Administrador') {
                // Si no hay usuario o no es administrador, redirigir a la página de login
                localStorage.removeItem('currentUser');
                window.location.href = '../usuarios/index.html';
                return;
            }

            // Actualizar la información del usuario en la interfaz
            document.getElementById('userName').textContent = currentUser.nombre;
            document.getElementById('userInitial').textContent = currentUser.nombre.charAt(0);

            // Configurar evento de cierre de sesión
            document.getElementById('logoutBtn').addEventListener('click', function () {
                localStorage.removeItem('currentUser');
                window.location.href = '../usuarios/index.html';
            });

            // Inicializar el módulo de gestión de pedidos
            initPedidos();
        });

        // ===== MÓDULO DE GESTIÓN DE PEDIDOS =====
        function initPedidos() {
            // Simula el rol del usuario (true = es administrador)
            const isAdmin = true;

            // Estados permitidos
            const ESTADOS = ["Pendiente", "Producción", "Enviado", "Cancelado", "Pagado"];

            // Datos de ejemplo (pedidos)
            let orders = [
                {
                    id: 1001,
                    client: "Ana Gómez",
                    date: "2025-10-01",
                    status: "Pendiente",
                    cart: [
                        { sku: "CAMS-001", name: "Camiseta Oversize", size: "M", color: "Negro", qty: 2, price: 50000, img: "https://via.placeholder.com/100" },
                        { sku: "PANT-002", name: "Pantalón Cargo", size: "L", color: "Caqui", qty: 1, price: 80000, img: "https://via.placeholder.com/100" }
                    ]
                },
                {
                    id: 1002,
                    client: "Carlos Ruiz",
                    date: "2025-10-02",
                    status: "Pagado",
                    cart: [
                        { sku: "JKT-003", name: "Chaqueta Deportiva", size: "XL", color: "Rojo", qty: 1, price: 150000, img: "https://via.placeholder.com/100" }
                    ]
                },
                {
                    id: 1003,
                    client: "Laura Méndez",
                    date: "2025-10-03",
                    status: "Producción",
                    cart: [
                        { sku: "TSH-010", name: "Top RED", size: "S", color: "Blanco", qty: 3, price: 30000, img: "https://via.placeholder.com/100" },
                        { sku: "HAT-001", name: "Gorra", size: "Única", color: "Negro", qty: 1, price: 25000, img: "https://via.placeholder.com/100" }
                    ]
                }
            ];

            // Referencias DOM
            const ordersTbody = document.querySelector("#orders-table tbody");
            const noOrdersEl = document.getElementById("no-orders");
            const filterStatus = document.getElementById("filter-status");

            const detailPanel = document.getElementById("detail-panel");
            const detailEmpty = document.getElementById("detail-empty");
            const detailContent = document.getElementById("detail-content");
            const detailId = document.getElementById("detail-id");
            const detailClient = document.getElementById("detail-client");
            const detailDate = document.getElementById("detail-date");
            const detailStatusSel = document.getElementById("detail-status");
            const cartItemsEl = document.getElementById("cart-items");
            const detailTotalEl = document.getElementById("detail-total");
            const statusNote = document.getElementById("status-note");
            const btnBack = document.getElementById("btn-back");
            const saveChangesBtn = document.getElementById("save-changes");
            const cancelChangesBtn = document.getElementById("cancel-changes");

            // Estado local
            let currentOrder = null;
            let editedOrder = null;

            // Funciones utilitarias
            function calcOrderTotal(order) {
                return order.cart.reduce((acc, it) => acc + it.price * it.qty, 0);
            }

            function formatMoney(n) {
                return "$" + n.toLocaleString();
            }

            // Render lista de pedidos
            function renderOrdersList() {
                const statusFilter = filterStatus.value;
                const filtered = orders.filter(o => statusFilter === "all" ? true : o.status === statusFilter);

                ordersTbody.innerHTML = "";
                if (filtered.length === 0) {
                    noOrdersEl.style.display = "block";
                } else {
                    noOrdersEl.style.display = "none";
                    filtered.forEach(o => {
                        const tr = document.createElement("tr");
                        const total = calcOrderTotal(o);
                        tr.innerHTML = `
                            <td>#${o.id}</td>
                            <td>${o.client}</td>
                            <td>${o.date}</td>
                            <td>${formatMoney(total)}</td>
                            <td><span class="status-badge s-${o.status.replace(/\s/g,'-')}">${o.status}</span></td>
                            <td>
                                <button class="action-btn view-btn" data-id="${o.id}">Ver detalle</button>
                            </td>
                        `;
                        ordersTbody.appendChild(tr);
                    });
                }

                document.querySelectorAll(".view-btn").forEach(btn => {
                    btn.addEventListener("click", () => {
                        const id = parseInt(btn.dataset.id, 10);
                        openDetail(id);
                    });
                });
            }

            // Abrir detalle de pedido
            function openDetail(id) {
                const order = orders.find(o => o.id === id);
                if (!order) return;
                currentOrder = order;
                editedOrder = JSON.parse(JSON.stringify(order));
                detailEmpty.style.display = "none";
                detailContent.style.display = "block";
                populateDetail();
            }

            // Poblar contenido del detalle
            function populateDetail() {
                detailId.textContent = `#${editedOrder.id}`;
                detailClient.textContent = editedOrder.client;
                detailDate.textContent = editedOrder.date;

                detailStatusSel.innerHTML = "";
                ESTADOS.forEach(st => {
                    const opt = document.createElement("option");
                    opt.value = st;
                    opt.textContent = st;
                    if (st === editedOrder.status) opt.selected = true;
                    detailStatusSel.appendChild(opt);
                });

                detailStatusSel.disabled = !(isAdmin && editedOrder.status !== "Pagado");
                statusNote.textContent = editedOrder.status === "Pagado" ? " (Pedido pagado — no editable)" : "";

                cartItemsEl.innerHTML = "";
                editedOrder.cart.forEach((it, idx) => {
                    const itemEl = document.createElement("div");
                    itemEl.className = "cart-item";
                    const editable = editedOrder.status !== "Pagado";

                    itemEl.innerHTML = `
                        <img src="${it.img}" alt="${it.name}">
                        <div class="info">
                            <h4>${it.name}</h4>
                            <p>SKU: ${it.sku} — Talla: ${it.size} — Color: ${it.color}</p>
                            <p>Precio unitario: ${formatMoney(it.price)}</p>
                        </div>
                        <div class="qty-controls">
                            <button class="qbtn q-minus" data-idx="${idx}" ${!editable ? "disabled" : ""}>-</button>
                            <div class="qnum">${it.qty}</div>
                            <button class="qbtn q-plus" data-idx="${idx}" ${!editable ? "disabled" : ""}>+</button>
                        </div>
                        <div class="item-subtotal">
                            ${formatMoney(it.price * it.qty)}
                        </div>
                    `;
                    cartItemsEl.appendChild(itemEl);
                });

                detailTotalEl.textContent = formatMoney(calcOrderTotal(editedOrder));
                attachDetailControlListeners();
            }

            // Adjuntar listeners en detalle
            function attachDetailControlListeners() {
                document.querySelectorAll(".q-plus").forEach(btn => {
                    btn.addEventListener("click", () => {
                        const idx = parseInt(btn.dataset.idx, 10);
                        editedOrder.cart[idx].qty += 1;
                        populateDetail();
                    });
                });

                document.querySelectorAll(".q-minus").forEach(btn => {
                    btn.addEventListener("click", () => {
                        const idx = parseInt(btn.dataset.idx, 10);
                        editedOrder.cart[idx].qty = Math.max(1, editedOrder.cart[idx].qty - 1);
                        populateDetail();
                    });
                });

                detailStatusSel.addEventListener("change", () => {
                    editedOrder.status = detailStatusSel.value;
                    populateDetail();
                });
            }

            // Guardar cambios
            saveChangesBtn.addEventListener("click", () => {
                if (!currentOrder || !editedOrder) return;
                if (currentOrder.status === "Pagado") {
                    alert("Este pedido ya está pagado y no puede modificarse.");
                    return;
                }

                if (!isAdmin && currentOrder.status !== editedOrder.status) {
                    alert("Solo administradores pueden cambiar el estado del pedido.");
                    return;
                }

                currentOrder.status = editedOrder.status;
                currentOrder.cart = editedOrder.cart.map(i => ({ ...i }));
                renderOrdersList();
                openDetail(currentOrder.id);
                alert("Cambios guardados.");
            });

            // Cancelar cambios
            cancelChangesBtn.addEventListener("click", () => {
                if (!currentOrder) return;
                openDetail(currentOrder.id);
            });

            // Volver al listado
            btnBack.addEventListener("click", () => {
                detailEmpty.style.display = "block";
                detailContent.style.display = "none";
                currentOrder = null;
                editedOrder = null;
            });

            // Filtrar
            filterStatus.addEventListener("change", renderOrdersList);

            // Inicializar
            renderOrdersList();
        }