// checkout.js
// NOTAS: Este JS valida campos, construye payload y llama al backend para crear la orden/pago.
// Endpoints esperados (REEMPLAZAR por los tuyos):
// POST /api/create-payment  -> body: { customer, shipping, items }  RESPUESTA: { orderId, amount_cents, payment_url }
// GET  /api/order-total?cartId=... -> opcional para pedir total calculado en backend
// GET  /api/order-status?orderId=... -> para verificar estado tras pago (usado en success page)

// --- Helper: seleccionar elementos
const form = document.getElementById("shipping-form");
const payBtn = document.getElementById("pay-btn");
const totalServerEl = document.getElementById("total-server");

// Demo: items (en realidad deben venir del carrito real)
const items = [
  { sku: "CAMS-001", name: "Camiseta Oversize RED", qty: 1, unit_price: 95000 },
  { sku: "JKT-002", name: "Chaqueta Deportiva RED", qty: 2, unit_price: 150000 }
];

// Mostrar subtotal cliente (solo visual)
function calcSubtotalClient() {
  const s = items.reduce((a, it) => a + it.qty * it.unit_price, 0);
  document.getElementById("subtotal-client").textContent = "$" + s.toLocaleString();
}
calcSubtotalClient();

// Inicial: pedir al backend el total real del pedido (recomendado)
// Para demo, mostramos "Pendiente" hasta que backend retorne el monto
async function fetchServerTotalPreview() {
  // Opcional: si tu backend ofrece endpoint que calcule total antes de crear la orden, llámalo.
  // Ejemplo (comentado): const res = await fetch("/api/order-total", {method:"POST", body: JSON.stringify({ items })});
  // Si no tienes backend aun, mostramos el subtotal client-side con nota.
  totalServerEl.textContent = "Pendiente (calculado por servidor)";
}
fetchServerTotalPreview();

// Validar formulario (RN-059: todos obligatorios)
function validarFormulario() {
  const requiredIds = ["ship-name","ship-email","ship-phone","ship-address","ship-city","ship-postal"];
  let ok = true;
  requiredIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el.value || el.value.trim() === "") {
      el.style.borderColor = "#dc143c";
      ok = false;
    } else {
      el.style.borderColor = "#ddd";
    }
  });
  return ok;
}

// Construir payload
function buildPayload() {
  const customer = {
    name: document.getElementById("ship-name").value.trim(),
    email: document.getElementById("ship-email").value.trim(),
    phone: document.getElementById("ship-phone").value.trim()
  };
  const shipping = {
    address: document.getElementById("ship-address").value.trim(),
    city: document.getElementById("ship-city").value.trim(),
    postal_code: document.getElementById("ship-postal").value.trim()
  };

  return { customer, shipping, items };
}

// CLICK -> Ir al pago
payBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  payBtn.disabled = true;
  payBtn.textContent = "Validando...";

  // Validación local (RN-059)
  if (!validarFormulario()) {
    alert("Por favor completa todos los campos de envío.");
    payBtn.disabled = false;
    payBtn.textContent = "Ir al pago (Wompi)";
    return;
  }

  // RN-061: Solo Wompi disponible -> no hay selección
  // Build payload
  const payload = buildPayload();

  try {
    // Llamar a tu backend para crear la orden / sesión de pago
    // IMPORTANTE: el backend debe:
    //  - calcular el total (RN-060)
    //  - generar un orderId incremental único (RN-064)
    //  - devolver payment_url (Wompi) y el monto exacto enviado
    //
    // Ejemplo (AJAX):
    const res = await fetch("/api/create-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error("Error del servidor: " + text);
    }

    const data = await res.json();
    // data = { orderId, amount_cents, payment_url }
    if (!data || !data.payment_url || !data.orderId) {
      throw new Error("Respuesta inválida del servidor al crear pago.");
    }

    // Mostrar monto confirmado por backend
    const amount = (data.amount_cents / 100).toLocaleString();
    totalServerEl.textContent = "$" + amount;

    // RN-062: el frontend redirige al payment_url devuelto por backend (Wompi)
    // Guarda orderId localmente (opcional)
    localStorage.setItem("pending_order_id", data.orderId);

    // Redirigir al checkout de Wompi (backend debe devolver payment_url ya con parámetros correctos)
    window.location.href = data.payment_url;

  } catch (err) {
    console.error(err);
    alert("No se pudo iniciar el pago. " + err.message);
    payBtn.disabled = false;
    payBtn.textContent = "Ir al pago (Wompi)";
  }
});
