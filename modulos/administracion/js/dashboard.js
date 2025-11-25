


// Eventos para los botones de acciones (simulación)
document.querySelectorAll('.btn-edit').forEach(button => {
    button.addEventListener('click', function () {
        const row = this.closest('tr');
        const userName = row.cells[1].textContent;
        alert(`Editando usuario: ${userName}`);
    });
});

document.querySelectorAll('.btn-delete').forEach(button => {
    button.addEventListener('click', function () {
        const row = this.closest('tr');
        const userName = row.cells[1].textContent;
        if (confirm(`¿Estás seguro de eliminar al usuario ${userName}?`)) {
            alert(`Usuario ${userName} eliminado (soft delete)`);
        }
    });
});

document.querySelectorAll('.btn-block').forEach(button => {
    button.addEventListener('click', function () {
        const row = this.closest('tr');
        const userName = row.cells[1].textContent;
        const status = row.querySelector('.status-badge').textContent;

        if (status === 'Bloqueado') {
            alert(`Desbloqueando usuario: ${userName}`);
        } else {
            alert(`Bloqueando usuario: ${userName}`);
        }
    });
});























    // Simulación de datos de usuarios
    let users = [
    {id: 1, nombre: "Admin Principal", correo: "admin@example.com", estado: "Activo", rol: "Administrador", fecha_registro: "2025-11-01", email_verificado: true, fecha_ultima_sesion: "2025-11-25 14:30" },
    {id: 2, nombre: "Juan Pérez", correo: "juan@example.com", estado: "Activo", rol: "Usuario", fecha_registro: "2025-11-15", email_verificado: true, fecha_ultima_sesion: "2025-11-25 10:15" },
    {id: 3, nombre: "María López", correo: "maria@example.com", estado: "Inactivo", rol: "Usuario", fecha_registro: "2025-11-10", email_verificado: false, fecha_ultima_sesion: "-" },
    {id: 4, nombre: "Carlos Ruiz", correo: "carlos@example.com", estado: "Bloqueado", rol: "Usuario", fecha_registro: "2025-11-05", email_verificado: true, fecha_ultima_sesion: "2025-11-20 09:30" }
    ];

    // Función para actualizar la tabla de usuarios
    function updateUsersTable() {
            const tbody = document.querySelector('table tbody');
    tbody.innerHTML = '';

            users.forEach(user => {
                const row = document.createElement('tr');
    row.innerHTML = `
    <td>${user.id}</td>
    <td>${user.nombre}</td>
    <td>${user.correo}</td>
    <td><span class="status-badge status-${user.estado.toLowerCase()}">${user.estado}</span></td>
    <td>${user.rol}</td>
    <td>${user.fecha_registro}</td>
    <td>${user.email_verificado ? '✅' : '❌'}</td>
    <td>${user.fecha_ultima_sesion}</td>
    <td>
        <div class="action-buttons">
            <button class="btn-action btn-edit" data-id="${user.id}">Editar</button>
            <button class="btn-action btn-${user.estado === 'Bloqueado' ? 'activate' : 'block'}" data-id="${user.id}">${user.estado === 'Bloqueado' ? 'Desbloquear' : 'Bloquear'}</button>
            <button class="btn-action btn-delete" data-id="${user.id}">Eliminar</button>
        </div>
    </td>
    `;
    tbody.appendChild(row);
            });

            // Añadir eventos a los botones
            document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => editUser(btn.dataset.id));
            });

            document.querySelectorAll('.btn-block, .btn-activate').forEach(btn => {
        btn.addEventListener('click', () => toggleUserStatus(btn.dataset.id));
            });

            document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => deleteUser(btn.dataset.id));
            });
        }

    // Función para editar usuario
    function editUser(id) {
            const user = users.find(u => u.id == id);
    if (!user) return;

    document.getElementById('modalTitle').textContent = 'Editar Usuario';
    document.getElementById('userName').value = user.nombre;
    document.getElementById('userEmail').value = user.correo;
    document.getElementById('userRole').value = user.rol;
    document.getElementById('userStatus').value = user.estado;

    document.getElementById('userModal').style.display = 'flex';
    document.getElementById('saveUserBtn').dataset.userId = id;
        }

    // Función para cambiar estado del usuario
    function toggleUserStatus(id) {
            const user = users.find(u => u.id == id);
    if (!user) return;

    if (user.estado === 'Bloqueado') {
        user.estado = 'Activo';
    showMessage('Usuario desbloqueado correctamente.', 'success');
            } else {
        user.estado = 'Bloqueado';
    showMessage('Usuario bloqueado correctamente.', 'success');
            }

    updateUsersTable();
    logAuditAction('Cambiar estado', id, user);
        }

    // Función para eliminar usuario (soft delete)
    function deleteUser(id) {
            if (confirm('¿Estás seguro de eliminar este usuario? Esta acción es reversible.')) {
                const user = users.find(u => u.id == id);
    if (!user) return;

    user.eliminado = true;
    user.fecha_eliminacion = new Date().toISOString().split('T')[0];
    showMessage('Usuario eliminado (soft delete).', 'success');
    updateUsersTable();
    logAuditAction('Eliminar usuario', id, user);
            }
        }

        // Función para mostrar modal de nuevo usuario
        document.getElementById('addUserBtn').addEventListener('click', () => {
        document.getElementById('modalTitle').textContent = 'Nuevo Usuario';
    document.getElementById('userName').value = '';
    document.getElementById('userEmail').value = '';
    document.getElementById('userRole').value = 'Usuario';
    document.getElementById('userStatus').value = 'Activo';

    document.getElementById('userModal').style.display = 'flex';
    delete document.getElementById('saveUserBtn').dataset.userId;
        });

        // Función para guardar usuario
        document.getElementById('saveUserBtn').addEventListener('click', () => {
            const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const role = document.getElementById('userRole').value;
    const status = document.getElementById('userStatus').value;

    if (!name || !email) {
        showMessage('Por favor, completa todos los campos obligatorios.', 'error');
    return;
            }

    const userId = document.getElementById('saveUserBtn').dataset.userId;

    if (userId) {
                // Editar usuario existente
                const user = users.find(u => u.id == userId);
    if (user) {
                    const oldData = {...user};
    user.nombre = name;
    user.correo = email;
    user.rol = role;
    user.estado = status;
    showMessage('Usuario actualizado correctamente.', 'success');
    logAuditAction('Editar usuario', userId, user, oldData);
                }
            } else {
                // Crear nuevo usuario
                const newUser = {
        id: users.length + 1,
    nombre: name,
    correo: email,
    estado: status,
    rol: role,
    fecha_registro: new Date().toISOString().split('T')[0],
    email_verificado: false,
    fecha_ultima_sesion: "-",
    eliminado: false
                };
    users.push(newUser);
    showMessage('Usuario creado correctamente.', 'success');
    logAuditAction('Crear usuario', newUser.id, newUser);
            }

    document.getElementById('userModal').style.display = 'none';
    updateUsersTable();
        });

        // Cerrar modal
        document.querySelector('.close-modal').addEventListener('click', () => {
        document.getElementById('userModal').style.display = 'none';
        });

        document.getElementById('cancelModal').addEventListener('click', () => {
        document.getElementById('userModal').style.display = 'none';
        });

    // Función para mostrar mensajes
    function showMessage(text, type) {
            const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    document.body.prepend(messageDiv);

            setTimeout(() => {
        messageDiv.remove();
            }, 3000);
        }

    // Función para registrar acciones en el log de auditoría
    function logAuditAction(action, userId, userData, oldData = null) {
        console.log('Log de Auditoría:', {
            admin_id: 1, // ID del administrador actual
            usuario_afectado_id: userId,
            accion: action,
            datos_anteriores: oldData,
            datos_nuevos: userData,
            fecha_accion: new Date().toISOString()
        });
            // En una aplicación real, esto se enviaría a un servidor
        }

    // Inicializar la tabla
    updateUsersTable();

        // Simular búsqueda
        document.querySelector('.search-input').addEventListener('keyup', (e) => {
            const term = e.target.value.toLowerCase();
    if (!term) {
        updateUsersTable();
    return;
            }

            const filteredUsers = users.filter(user =>
    user.nombre.toLowerCase().includes(term) ||
    user.correo.toLowerCase().includes(term) ||
    user.id.toString().includes(term)
    );

    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = '';

            filteredUsers.forEach(user => {
                const row = document.createElement('tr');
    row.innerHTML = `
    <td>${user.id}</td>
    <td>${user.nombre}</td>
    <td>${user.correo}</td>
    <td><span class="status-badge status-${user.estado.toLowerCase()}">${user.estado}</span></td>
    <td>${user.rol}</td>
    <td>${user.fecha_registro}</td>
    <td>${user.email_verificado ? '✅' : '❌'}</td>
    <td>${user.fecha_ultima_sesion}</td>
    <td>
        <div class="action-buttons">
            <button class="btn-action btn-edit" data-id="${user.id}">Editar</button>
            <button class="btn-action btn-${user.estado === 'Bloqueado' ? 'activate' : 'block'}" data-id="${user.id}">${user.estado === 'Bloqueado' ? 'Desbloquear' : 'Bloquear'}</button>
            <button class="btn-action btn-delete" data-id="${user.id}">Eliminar</button>
        </div>
    </td>
    `;
    tbody.appendChild(row);
            });
        });

        // Simular filtros
        document.querySelectorAll('.filter-input').forEach(input => {
            if (input.tagName === 'SELECT') {
        input.addEventListener('change', applyFilters);
            }
        });

    function applyFilters() {
            const searchTerm = document.querySelector('.search-input').value.toLowerCase();
    const estadoFilter = document.querySelectorAll('.filter-input')[1].value;
    const rolFilter = document.querySelectorAll('.filter-input')[2].value;
    const verificadoFilter = document.querySelectorAll('.filter-input')[3].value;

    let filteredUsers = users;

    if (searchTerm) {
        filteredUsers = filteredUsers.filter(user =>
            user.nombre.toLowerCase().includes(searchTerm) ||
            user.correo.toLowerCase().includes(searchTerm) ||
            user.id.toString().includes(searchTerm)
        );
            }

    if (estadoFilter) {
        filteredUsers = filteredUsers.filter(user => user.estado === estadoFilter);
            }

    if (rolFilter) {
        filteredUsers = filteredUsers.filter(user => user.rol === rolFilter);
            }

    if (verificadoFilter) {
                const isVerified = verificadoFilter === 'si';
                filteredUsers = filteredUsers.filter(user => user.email_verificado === isVerified);
            }

    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = '';

            filteredUsers.forEach(user => {
                const row = document.createElement('tr');
    row.innerHTML = `
    <td>${user.id}</td>
    <td>${user.nombre}</td>
    <td>${user.correo}</td>
    <td><span class="status-badge status-${user.estado.toLowerCase()}">${user.estado}</span></td>
    <td>${user.rol}</td>
    <td>${user.fecha_registro}</td>
    <td>${user.email_verificado ? '✅' : '❌'}</td>
    <td>${user.fecha_ultima_sesion}</td>
    <td>
        <div class="action-buttons">
            <button class="btn-action btn-edit" data-id="${user.id}">Editar</button>
            <button class="btn-action btn-${user.estado === 'Bloqueado' ? 'activate' : 'block'}" data-id="${user.id}">${user.estado === 'Bloqueado' ? 'Desbloquear' : 'Bloquear'}</button>
            <button class="btn-action btn-delete" data-id="${user.id}">Eliminar</button>
        </div>
    </td>
    `;
    tbody.appendChild(row);
            });
        }

        // Eventos de navegación
        document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            // En una aplicación real, esto cargaría diferentes vistas
            showMessage(`Navegando a ${item.textContent.trim()}`, 'success');
        });
        });
