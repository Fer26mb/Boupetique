// Referencias a los elementos del DOM
const cartItemsContainer = document.getElementById("cartItemsContainer");
const cartTotalElement = document.getElementById("cartTotal");
const payContainer = document.getElementById("submit-btns");
const userForm = document.getElementById('user-form');
const shippingContainer = document.getElementById('shipping-btns')

// Función principal para renderizar el carrito
function renderCart() {
    // Obtener los productos actualizados de localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Si el carrito está vacío, mostrar un mensaje informativo
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="fs-4 text-muted">Tu carrito está vacío 🛒</p>
            </div>
        `;
        if (cartTotalElement) cartTotalElement.textContent = "0.00";
        renderTicket();
        return;
    }

    // Generar el HTML para cada producto en el carrito
    const cartHTML = cart.map((product) => {
        const id = product.id || product.sku;
        const subtotal = product.Precio_Base * product.quantity;

        return `
        <div class="col-12">
            <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
                <div class="row align-items-center g-3">
                    <!-- Imagen del producto -->
                    <div class="col-3 col-md-2 text-center">
                        <img src="${product.Imagen_URL}" class="img-fluid rounded-3" alt="${product.Nombre}">
                    </div>

                    <!-- Detalles del producto -->
                    <div class="col-9 col-md-4">
                        <span class="micro-category text-muted small">${product.Categoria}</span>
                        <h5 class="fw-bold text-dark mb-1">${product.Nombre}</h5>
                        <p class="text-muted small mb-0">$${product.Precio_Base} c/u</p>
                    </div>

                    <!-- Control de cantidad -->
                    <div class="col-6 col-md-3 d-flex align-items-center justify-content-center">
                        <button class="btn btn-outline-secondary btn-sm rounded-circle px-2 btn-change-qty" data-id="${id}" data-action="decrease">-</button>
                        <span class="mx-3 fw-bold">${product.quantity}</span>
                        <button class="btn btn-outline-secondary btn-sm rounded-circle px-2 btn-change-qty" data-id="${id}" data-action="increase">+</button>
                    </div>

                    <!-- Subtotal y botón eliminar -->
                    <div class="col-6 col-md-3 text-end">
                        <span class="fs-5 fw-bold text-dark d-block">$${subtotal.toFixed(2)}</span>
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

    // Calcular y mostrar el precio total
    calculateTotal(cart);
}

// Funcion para renderizar datos del ticket
function renderTicket() {
    // Obtiene los productos guardados en localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const ticketItemsContainer = document.getElementById("ticketItemsContainer");

    if (!ticketItemsContainer) return;

    // Si el carrito está vacío, mostrar una fila indicándolo
    if (cart.length === 0) {
        ticketItemsContainer.innerHTML = `
            <tr>
                <td colspan="3" class="text-center text-muted">Sin productos</td>
            </tr>
        `;
        payContainer.classList.add('hide');
        return;
    }
    payContainer.classList.remove('hide');
    // Genera las filas <tr> para cada producto
    const ticketHTML = cart.map((product) => {
        const price = Number(product.Precio_Base ?? product.precio ?? 0);
        const qty = Number(product.quantity ?? 1);
        const subtotal = price * qty;

        return `
            <tr>
                <td><p class="text-truncate" style="max-width: 199px;">${product.Nombre}</p></td>
                <td>${qty}</td>
                <td>$${subtotal.toFixed(2)} MXN</td>
            </tr>
        `;
    }).join("");

    // Inyecta las filas en el tbody
    ticketItemsContainer.innerHTML = ticketHTML;
}

// Función auxiliar para calcular el total
function calculateTotal(cart) {
    const total = cart.reduce((sum, item) => sum + (item.Precio_Base * item.quantity), 0);
    if (cartTotalElement) {
        cartTotalElement.textContent = total.toFixed(2);
    }
}


cartItemsContainer.addEventListener("click", (e) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

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
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
            renderTicket();
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

        localStorage.setItem("cart", JSON.stringify(updatedCart));
        renderCart();
    }
});

payContainer.addEventListener("click", (e) => {
    const optionBtn = e.target.closest(".btn-change-option");
    if(optionBtn){
        const action = optionBtn.dataset.action;
        switch(action){
            case "Pagar":
                userForm.classList.toggle('hide');
                break;
            case "Cancelar":
                userForm.classList.toggle('hide');
                break;
        }
    }
});

shippingContainer.addEventListener("click", (e) => {
    const optionBtn = e.target.closest(".btn-change-option");
    if(optionBtn){
        const action = optionBtn.dataset.action;
        switch(action){
            case "Enviar":
                alert("Tus productos seran enviados, gracias por comprar con nosotros");
                localStorage.setItem("cart", JSON.stringify([]));
                userForm.classList.toggle('hide');
                renderCart();
                renderTicket(); 
                break;
            case "Cancelar":
                userForm.classList.toggle('hide');
                break;
        }
    }
});

// Inicializar la vista cuando se cargue la página
document.addEventListener("DOMContentLoaded", renderCart);