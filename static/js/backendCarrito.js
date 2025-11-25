// Actualizar totales
function actualizarTotales() {
    let subtotales = document.querySelectorAll(".subtotal");
    let total = 0;

    subtotales.forEach(sub => {
        let valor = parseInt(sub.textContent.replace(/\D/g, ""));
        total += valor;
    });

    const msg = document.getElementById("msg-vacio");
    const lista = document.getElementById("carrito-lista");

    // Mostrar mensaje vacío
    msg.style.display = lista.children.length === 0 ? "block" : "none";

    // Actualizar total en la caja derecha
    document.querySelector(".checkout-total").textContent = "Total: $" + total.toLocaleString();
}

// Cambios de cantidad
document.querySelectorAll(".item").forEach(item => {

    const priceElement = item.querySelector(".price");
    const unidad = parseInt(priceElement.dataset.price);

    const qtyInput = item.querySelector(".qty");
    const btnPlus = item.querySelector(".plus");
    const btnMinus = item.querySelector(".minus");
    const subtotalText = item.querySelector(".subtotal");

    function updateSubtotal() {
        let cant = parseInt(qtyInput.value);
        if (cant < 1) cant = 1;
        qtyInput.value = cant;

        subtotalText.textContent = `Subtotal: $${(unidad * cant).toLocaleString()}`;

        actualizarTotales();
    }

    btnPlus.addEventListener("click", () => {
        qtyInput.value = parseInt(qtyInput.value) + 1;
        updateSubtotal();
    });

    btnMinus.addEventListener("click", () => {
        qtyInput.value = Math.max(1, parseInt(qtyInput.value) - 1);
        updateSubtotal();
    });

    qtyInput.addEventListener("input", updateSubtotal);
});

// Eliminar producto
document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        btn.parentElement.remove();
        actualizarTotales();
    });
});

// Eliminar todo
document.getElementById("btn-borrar-todo").addEventListener("click", () => {
    document.getElementById("carrito-lista").innerHTML = "";
    actualizarTotales();
});

// Regresar
function volverAlEditor() {
    window.location.href = "index.html";
}

// Inicializar
actualizarTotales();
