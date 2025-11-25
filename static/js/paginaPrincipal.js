
    // Verificar si hay un usuario autenticado
    document.addEventListener('DOMContentLoaded', function () {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        // Si no hay usuario autenticado, redirigir a la página de login
        window.location.href = 'modulos/usuarios/index.html';
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
