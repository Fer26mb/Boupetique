import { contarProductosAgregados } from "./productos/counterProducts.js";
import {
    describirMetodo, iconoMetodo, detectarMarca, luhnValido, vencimientoValido,
    formatearNumeroTarjeta, formatearVencimiento, obtenerMetodosPago, guardarMetodoPago
} from "./metodos-pago.js";

// Referencias a los elementos del DOM
const cartItemsContainer = document.getElementById("cartItemsContainer");
const cartTotalElement = document.getElementById("cartTotal");
const payContainer = document.getElementById("submit-btns");
const userForm = document.getElementById('user-form');
const shippingContainer = document.getElementById('shipping-btns');
const btnClearCart = document.getElementById("btnClearCart");
const checkoutForm = document.getElementById("checkoutForm");
const metodosPagoCheckout = document.getElementById("metodosPagoCheckout");
const nuevoMetodo = document.getElementById("nuevoMetodo");
const nmTipo = document.getElementById("nmTipo");
const nmNumero = document.getElementById("nmNumero");
const nmVencimiento = document.getElementById("nmVencimiento");

const COSTO_ENVIO = 99;
let metodosGuardados = [];

function calcularTotales(cart) {
    const subtotal = cart.reduce((sum, item) => sum + (item.Precio_Base * item.quantity), 0);
    const envio = subtotal === 0 || subtotal >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO;
    return { subtotal, envio, total: subtotal + envio };
}

function guardarCarrito(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    contarProductosAgregados();
}

// Función principal para renderizar el carrito
function renderCart() {
    // Obtener los productos actualizados de localStorage
    const cart = leerCarrito();
    btnClearCart.classList.toggle("d-none", cart.length === 0);

    // Si el carrito está vacío, mostrar un mensaje informativo
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="fs-4 text-muted">Tu carrito está vacío 🛒</p>
                <a href="productos.html" class="btn btn-boupetique">Ver productos</a>
            </div>
        `;
        renderTicket();
        return;
    }

    // Generar el HTML para cada producto en el carrito
    const cartHTML = cart.map((product) => {
        const imagenUrl = product.Imagen_URL || "../assets/productos-img/default.jpeg";
        const id = product.id || product.sku;
        const subtotal = product.Precio_Base * product.quantity;

        return `
        <div class="col-12">
            <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
                <div class="row align-items-center g-3">
                    <!-- Imagen del producto -->
                    <div class="col-3 col-md-2 text-center">
                        <img src="${imagenUrl}" class="img-fluid rounded-3" alt="${product.Nombre}">
                    </div>

                    <!-- Detalles del producto -->
                    <div class="col-9 col-md-4">
                        <span class="micro-category text-muted small">${product.Categoria}</span>
                        <h5 class="fw-bold text-dark mb-1">${product.Nombre}</h5>
                        <p class="text-muted small mb-0">${formatoMXN(product.Precio_Base)} c/u</p>
                    </div>

                    <!-- Control de cantidad -->
                    <div class="col-6 col-md-3 d-flex align-items-center justify-content-center">
                        <button class="btn btn-outline-secondary btn-sm rounded-circle px-2 btn-change-qty" data-id="${id}" data-action="decrease">-</button>
                        <span class="mx-3 fw-bold">${product.quantity}</span>
                        <button class="btn btn-outline-secondary btn-sm rounded-circle px-2 btn-change-qty" data-id="${id}" data-action="increase">+</button>
                    </div>

                    <!-- Subtotal y botón eliminar -->
                    <div class="col-6 col-md-3 text-end">
                        <span class="fs-5 fw-bold text-dark d-block">${formatoMXN(subtotal)}</span>
                        <button class="btn btn-link text-danger p-0 mt-1 btn-delete" data-id="${id}">
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join("");

    // Esta funcion muestra los datos del carrito en el ticket
    renderTicket();

    // Insertar el HTML generado en el DOM
    cartItemsContainer.innerHTML = cartHTML;
}

// Funcion para renderizar datos del ticket
function renderTicket() {
    // Obtiene los productos guardados en localStorage
    const cart = leerCarrito();
    const ticketItemsContainer = document.getElementById("ticketItemsContainer");
    const { subtotal, envio, total } = calcularTotales(cart);

    document.getElementById("ticketSubtotal").textContent = formatoMXN(subtotal);
    document.getElementById("ticketEnvio").textContent = envio === 0 && subtotal > 0 ? "Gratis" : formatoMXN(envio);
    document.getElementById("ticketEnvioNota").textContent = subtotal > 0 && subtotal < ENVIO_GRATIS_DESDE
        ? `Agrega ${formatoMXN(ENVIO_GRATIS_DESDE - subtotal)} más para obtener envío gratis`
        : "";
    cartTotalElement.textContent = formatoMXN(total);

    // Si el carrito está vacío, mostrar una fila indicándolo
    if (cart.length === 0) {
        ticketItemsContainer.innerHTML = `
            <tr>
                <td colspan="3" class="text-center text-muted">Sin productos</td>
            </tr>
        `;
        payContainer.classList.add('hide');
        cerrarFormulario();
        return;
    }
    payContainer.classList.remove('hide');
    // Genera las filas <tr> para cada producto
    const ticketHTML = cart.map((product) => {
        const price = Number(product.Precio_Base ?? product.precio ?? 0);
        const qty = Number(product.quantity ?? 1);
        const subtotalProducto = price * qty;

        return `
            <tr>
                <td><p class="text-truncate" style="max-width: 199px;">${product.Nombre}</p></td>
                <td>${qty}</td>
                <td>${formatoMXN(subtotalProducto)}</td>
            </tr>
        `;
    }).join("");

    // Inyecta las filas en el tbody
    ticketItemsContainer.innerHTML = ticketHTML;
}


cartItemsContainer.addEventListener("click", (e) => {
    const cart = leerCarrito();

    // Manejo de botones para Aumentar / Disminuir
    const qtyBtn = e.target.closest(".btn-change-qty");
    if (qtyBtn) {
        const targetId = String(qtyBtn.dataset.id); // Convertimos el dataset id a String
        const action = qtyBtn.dataset.action;

        // Buscamos el producto convirtiendo ambos id a String para asegurar la coincidencia
        const product = cart.find(
            (item) => String(item.id ?? item.sku) === targetId
        );

        if (product) {
            if (action === "increase") {
                product.quantity += 1;
            } else if (action === "decrease" && product.quantity > 1) {
                product.quantity -= 1;
            }

            // Guardamos cambios y actualizamos la interfaz
            guardarCarrito(cart);
            renderCart();
        }
        return;
    }

    // Manejo del botón Eliminar
    const deleteBtn = e.target.closest(".btn-delete");
    if (deleteBtn) {
        const targetId = String(deleteBtn.dataset.id);

        const updatedCart = cart.filter(
            (item) => String(item.id ?? item.sku) !== targetId
        );

        guardarCarrito(updatedCart);
        renderCart();
    }
});

btnClearCart.addEventListener("click", async () => {
    const resultado = await Swal.fire({
        title: "¿Vaciar el carrito?",
        text: "Se quitarán todos los productos.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, vaciar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#d96b27"
    });
    if (!resultado.isConfirmed) return;
    guardarCarrito([]);
    renderCart();
});

const btnPagar = document.getElementById("btn-pagar");
const btnCancelar = document.getElementById("btn-cancelar");

function cerrarFormulario() {
    userForm.classList.add('hide');
    btnPagar.classList.remove('d-none');
    btnCancelar.classList.add('d-none');
}

payContainer.addEventListener("click", async (e) => {
    const optionBtn = e.target.closest(".btn-change-option");
    if (!optionBtn) return;

    if (optionBtn.dataset.action === "Cancelar") {
        cerrarFormulario();
        return;
    }

    const session = getSession();
    if (!session?.id) {
        const resultado = await Swal.fire({
            title: "Inicia sesión para pagar",
            text: "Así guardamos tu pedido y puedes seguirlo desde tu cuenta.",
            icon: "info",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Iniciar sesión",
            denyButtonText: "Crear cuenta",
            cancelButtonText: "Seguir viendo",
            confirmButtonColor: "#0b3c26",
            denyButtonColor: "#d96b27"
        });
        if (resultado.isConfirmed) window.location.href = loginUrl();
        if (resultado.isDenied) window.location.href = loginUrl("registro");
        return;
    }

    userForm.classList.remove('hide');
    btnPagar.classList.add('d-none');
    btnCancelar.classList.remove('d-none');
    await prepararCheckout(session);
});

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  customClass:{
    popup:'colored-toast',
  },
  showConfirmButton: false,
  timer: 3000,
});

async function prepararCheckout(session) {
    const email = document.getElementById("email");
    const nombre = document.getElementById("name");
    if (!email.value) email.value = session.email ?? "";

    try {
        const response = await fetch(`${API_URL}/users/${session.id}`);
        if (response.ok && !nombre.value) {
            const usuario = await response.json();
            nombre.value = `${usuario.userName} ${usuario.surNames}`;
        }
    } catch {
    }

    try {
        metodosGuardados = await obtenerMetodosPago(session.id);
    } catch {
        metodosGuardados = [];
    }
    renderMetodosCheckout();
}

function renderMetodosCheckout() {
    const opciones = metodosGuardados.map((metodo) => `
        <label class="metodo-checkout">
            <input class="form-check-input mt-0" type="radio" name="metodoPago" value="guardado-${metodo.id}" ${metodo.isDefault ? "checked" : ""}>
            <i class="bi ${iconoMetodo(metodo)}"></i>
            <span class="flex-grow-1">
                <span class="d-block fw-semibold">${escaparHTML(describirMetodo(metodo))}</span>
                ${metodo.alias ? `<small class="text-muted">${escaparHTML(metodo.alias)}</small>` : ""}
            </span>
        </label>
    `).join("");

    metodosPagoCheckout.innerHTML = `
        ${opciones}
        <label class="metodo-checkout">
            <input class="form-check-input mt-0" type="radio" name="metodoPago" value="nuevo" ${metodosGuardados.length === 0 ? "checked" : ""}>
            <i class="bi bi-plus-circle"></i>
            <span class="fw-semibold">${metodosGuardados.length ? "Usar otro método" : "Agregar método de pago"}</span>
        </label>
    `;
    actualizarNuevoMetodo();
}

function metodoSeleccionado() {
    return metodosPagoCheckout.querySelector("input[name='metodoPago']:checked")?.value ?? "nuevo";
}

function actualizarNuevoMetodo() {
    const esNuevo = metodoSeleccionado() === "nuevo";
    nuevoMetodo.classList.toggle("d-none", !esNuevo);
    document.querySelectorAll("[data-nm-tipo]").forEach((grupo) => {
        grupo.hidden = grupo.dataset.nmTipo !== nmTipo.value;
    });
    document.getElementById("guardarMetodoGrupo").hidden = nmTipo.value === "OXXO";
}

metodosPagoCheckout.addEventListener("change", actualizarNuevoMetodo);
nmTipo.addEventListener("change", actualizarNuevoMetodo);
nmNumero.addEventListener("input", () => {
    nmNumero.value = formatearNumeroTarjeta(nmNumero.value);
});
nmVencimiento.addEventListener("input", () => {
    nmVencimiento.value = formatearVencimiento(nmVencimiento.value);
});

function validarCheckout() {
    const titular = document.getElementById("nmTitular");
    const cvv = document.getElementById("nmCvv");
    const paypal = document.getElementById("nmPaypalEmail");
    [titular, nmNumero, nmVencimiento, cvv, paypal].forEach((campo) => campo.setCustomValidity(""));

    if (metodoSeleccionado() === "nuevo") {
        if (nmTipo.value === "Tarjeta") {
            if (titular.value.trim().length < 3) titular.setCustomValidity("Titular requerido");
            if (!luhnValido(nmNumero.value) || !detectarMarca(nmNumero.value)) nmNumero.setCustomValidity("Tarjeta no válida");
            if (!vencimientoValido(nmVencimiento.value)) nmVencimiento.setCustomValidity("Vencimiento no válido");
            if (!/^\d{3,4}$/.test(cvv.value)) cvv.setCustomValidity("CVV no válido");
        }
        if (nmTipo.value === "PayPal" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paypal.value.trim())) {
            paypal.setCustomValidity("Correo no válido");
        }
    }

    checkoutForm.classList.add("was-validated");
    return checkoutForm.checkValidity();
}

function construirMetodo() {
    const seleccion = metodoSeleccionado();
    if (seleccion !== "nuevo") {
        return { metodo: metodosGuardados.find((metodo) => `guardado-${metodo.id}` === seleccion), guardar: false };
    }

    const tipo = nmTipo.value;
    const digitos = nmNumero.value.replace(/\D/g, "");
    const metodo = {
        type: tipo,
        holderName: tipo === "Tarjeta" ? document.getElementById("nmTitular").value.trim() : null,
        brand: tipo === "Tarjeta" ? detectarMarca(digitos) : null,
        last4: tipo === "Tarjeta" ? digitos.slice(-4) : null,
        expiry: tipo === "Tarjeta" ? nmVencimiento.value.trim() : null,
        paypalEmail: tipo === "PayPal" ? document.getElementById("nmPaypalEmail").value.trim() : null
    };
    return { metodo, guardar: tipo !== "OXXO" && document.getElementById("guardarMetodo").checked };
}

async function crearOrden(cart, session, descripcionPago) {
    const headers = { "Content-Type": "application/json" };
    const total = Number(calcularTotales(cart).total.toFixed(2));

    const orderResponse = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers,
        body: JSON.stringify({ totalAmount: total, userId: session.id })
    });
    if (!orderResponse.ok) throw new Error(`HTTP ${orderResponse.status}`);
    const orden = await orderResponse.json();

    for (const product of cart) {
        const detalle = await fetch(`${API_URL}/product_detail/${orden.id}`, {
            method: "POST",
            headers,
            body: JSON.stringify({ quantity: product.quantity, product_id: product.id })
        });
        if (!detalle.ok) throw new Error(`HTTP ${detalle.status}`);
    }

    const paymentResponse = await fetch(`${API_URL}/payments`, {
        method: "POST",
        headers,
        body: JSON.stringify({
            orderId: orden.id,
            paymentMethod: descripcionPago.slice(0, 50),
            amount: total
        })
    });
    if (!paymentResponse.ok) throw new Error(`HTTP ${paymentResponse.status}`);
    const pago = await paymentResponse.json();

    await fetch(`${API_URL}/orders/${orden.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ totalAmount: total, userId: session.id, paymentId: pago.id, statusO: "PAGADO" })
    });
    return orden;
}

shippingContainer.addEventListener("click", async (e) => {
    const optionBtn = e.target.closest(".btn-change-option");
    if (!optionBtn || optionBtn.dataset.action !== "Enviar") return;

    const session = getSession();
    if (!session?.id) {
        window.location.href = loginUrl();
        return;
    }
    if (!validarCheckout()) return;

    const { metodo, guardar } = construirMetodo();
    optionBtn.disabled = true;

    let orden;
    try {
        orden = await crearOrden(leerCarrito(), session, describirMetodo(metodo));
    } catch (error) {
        console.error("No se pudo crear la orden.", error);
        Toast.fire({ icon: "error", title: "No se pudo completar tu compra, intenta de nuevo" });
        optionBtn.disabled = false;
        return;
    }

    if (guardar) {
        try {
            await guardarMetodoPago(session.id, metodo);
        } catch (error) {
            console.error("No se pudo guardar el método de pago.", error);
        }
    }

    optionBtn.disabled = false;
    guardarCarrito([]);
    checkoutForm.reset();
    checkoutForm.classList.remove("was-validated");
    renderCart();

    const resultado = await Swal.fire({
        title: "¡Gracias por tu compra!",
        text: `Tu pedido #${orden.id} quedó registrado.`,
        iconHtml: '<img src="https://www.gifsanimados.org/data/media/218/pinguino-imagen-animada-0082.gif" style="width: 70px; height: 70px;" alt="pinguino" />',
        customClass: { icon: 'border-0' },
        showCancelButton: true,
        confirmButtonText: "Ver mis pedidos",
        cancelButtonText: "Seguir comprando",
        confirmButtonColor: "#0b3c26"
    });
    window.location.href = resultado.isConfirmed ? "cuenta.html#pedidos" : "productos.html";
});

// Inicializar la vista cuando se cargue la página
renderCart();


//Realizamos una funcion que se llame actualizarFechaHora para que cuando uno entre a ver la fecha del ticket


function actualizarFechaHora() {
       const ahora = new Date(); //Date() Obtiene la fehca y hora actual.

    // Formatear fecha en formato DD/MM/YYYY, usamos dos variables constantes, y mediante la siguiente definicion para cada una (fecha y horario)

    const opcionesFecha = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const fecha = ahora.toLocaleDateString('es-MX', opcionesFecha);
//ToLocaleDateString convierte la fehca al formato mexicano (es-MX) de acuerdo a bibliografia.

//Misma lógica y uso para la variable pero con la hora.
    // Formatear hora en formato HH:MM AM/PM
    const opcionesHora = { hour: '2-digit', minute: '2-digit', hour12: true };
    const hora = ahora.toLocaleTimeString('es-MX', opcionesHora);



    // Insertar en el ticket mediante getElementByID
    document.getElementById("ticketFecha").textContent = fecha; //Constantes que usan ToLocal y usamos lo id de span
    document.getElementById("ticketHora").textContent = hora;


} // fin de la funcion actualizarFechaHora

//Cuando veamos el ticket por primera vez se cargará la fecha y hora al entrar.
actualizarFechaHora();


document.querySelectorAll("#user-form .form-control").forEach(input => {
    // Escuchar cada vez que el usuario escribe en los campos de entrega
    input.addEventListener("input", () => {
        if (input.checkValidity()) {
            input.classList.remove("is-invalid");
            input.classList.add("is-valid");
        } else {
            input.classList.remove("is-valid");
            input.classList.add("is-invalid");
        }
    });
});
