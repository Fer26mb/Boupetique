import { mapProduct } from "./json.js";
import {
    describirMetodo, iconoMetodo, detectarMarca, luhnValido, vencimientoValido,
    formatearNumeroTarjeta, formatearVencimiento, leerErrorApi, obtenerMetodosPago, guardarMetodoPago
} from "./metodos-pago.js";

const session = getSession();
if (!session?.id) {
    window.location.replace(`login.html?redirect=${encodeURIComponent(`html/cuenta.html${window.location.hash}`)}`);
    throw new Error("Sesión requerida");
}

const JSON_HEADERS = { "Content-Type": "application/json" };
const EDADES = ["Menos de 1 año", "Entre 1 y 2 años", "Entre 2 y 3 años", "Entre 3 y 4 años", "Entre 4 y 5 años",
    "Entre 5 y 6 años", "Entre 6 y 7 años", "Entre 7 y 8 años", "Entre 8 y 9 años", "Entre 9 y 10 años", "Más de 10 años"];
const TAMANOS = ["Minis", "Pequeña", "Mediana", "Grande"];
const PESOS = ["Entre 1 kg y 3 kg", "Entre 3 kg y 10 kg", "Entre 10 kg y 25 kg", "Entre 25 kg y 45 kg", "Más de 45 kg"];

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2500
});

let usuarioActual = null;
let mascotas = [];
let metodosPago = [];

const confirmar = (titulo, texto) => Swal.fire({
    title: titulo,
    text: texto,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#d96b27"
}).then((resultado) => resultado.isConfirmed);

const llenarSelect = (select, opciones, placeholder) => {
    select.innerHTML = `<option value="" disabled selected>${placeholder}</option>` +
        opciones.map((opcion) => `<option value="${escaparHTML(opcion.valor ?? opcion)}">${escaparHTML(opcion.texto ?? opcion)}</option>`).join("");
};

function mostrarPestanaDesdeHash() {
    const destino = window.location.hash || "#perfil";
    const boton = document.querySelector(`#cuentaTabs [data-bs-target="${destino}"]`);
    if (boton) bootstrap.Tab.getOrCreateInstance(boton).show();
}

document.querySelectorAll("#cuentaTabs [data-bs-toggle='pill']").forEach((boton) => {
    boton.addEventListener("shown.bs.tab", () => {
        history.replaceState(null, "", boton.dataset.bsTarget);
    });
});
window.addEventListener("hashchange", mostrarPestanaDesdeHash);

const perfilForm = document.getElementById("perfilForm");
const btnGuardarPerfil = document.getElementById("btnGuardarPerfil");
const camposPerfil = {
    userName: document.getElementById("perfilNombre"),
    surNames: document.getElementById("perfilApellidos"),
    email: document.getElementById("perfilCorreo"),
    phoneNumber: document.getElementById("perfilTelefono"),
    birthDate: document.getElementById("perfilNacimiento")
};

const valorPerfil = (usuario, campo) => campo === "birthDate"
    ? String(usuario.birthDate ?? "").slice(0, 10)
    : usuario[campo] ?? "";

function pintarResumen(usuario) {
    document.getElementById("cuentaAvatar").textContent = usuario.userName.charAt(0).toUpperCase();
    document.getElementById("cuentaNombre").textContent = `${usuario.userName} ${usuario.surNames}`;
    document.getElementById("cuentaCorreo").textContent = usuario.email;
}

async function cargarPerfil() {
    const response = await fetch(`${API_URL}/users/${session.id}`);
    if (!response.ok) throw new Error(await leerErrorApi(response, "No se pudo cargar tu información."));
    usuarioActual = await response.json();
    Object.entries(camposPerfil).forEach(([campo, input]) => {
        input.value = valorPerfil(usuarioActual, campo);
    });
    pintarResumen(usuarioActual);
    btnGuardarPerfil.disabled = true;
}

const cambiosPerfil = () => Object.fromEntries(
    Object.entries(camposPerfil)
        .filter(([campo, input]) => input.value.trim() !== valorPerfil(usuarioActual, campo))
        .map(([campo, input]) => [campo, input.value.trim()])
);

perfilForm.addEventListener("input", () => {
    btnGuardarPerfil.disabled = Object.keys(cambiosPerfil()).length === 0;
});

perfilForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    perfilForm.classList.add("was-validated");
    if (!perfilForm.checkValidity()) return;

    const cambios = cambiosPerfil();
    if (Object.keys(cambios).length === 0) return;

    const response = await fetch(`${API_URL}/users/${session.id}`, {
        method: "PUT",
        headers: JSON_HEADERS,
        body: JSON.stringify(cambios)
    });
    if (!response.ok) {
        Swal.fire({ icon: "error", title: "No se guardaron los cambios", text: await leerErrorApi(response) });
        return;
    }

    usuarioActual = await response.json();
    guardarSesion(usuarioActual);
    renderUserSession();
    perfilForm.classList.remove("was-validated");
    await cargarPerfil();
    Toast.fire({ icon: "success", title: "Tu información se actualizó" });
});

const passwordForm = document.getElementById("passwordForm");
passwordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const actual = document.getElementById("pwdActual");
    const nueva = document.getElementById("pwdNueva");
    const confirmarPwd = document.getElementById("pwdConfirmar");
    confirmarPwd.setCustomValidity(nueva.value === confirmarPwd.value ? "" : "No coinciden");
    passwordForm.classList.add("was-validated");
    if (!passwordForm.checkValidity()) return;

    const login = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify({ email: usuarioActual.email, passwordSite: actual.value })
    });
    if (!login.ok) {
        Swal.fire({ icon: "error", title: "Contraseña incorrecta", text: "Tu contraseña actual no es correcta." });
        return;
    }

    const response = await fetch(`${API_URL}/users/${session.id}`, {
        method: "PUT",
        headers: JSON_HEADERS,
        body: JSON.stringify({ passwordSite: nueva.value })
    });
    if (!response.ok) {
        Swal.fire({ icon: "error", title: "No se pudo cambiar", text: await leerErrorApi(response) });
        return;
    }
    passwordForm.reset();
    passwordForm.classList.remove("was-validated");
    Toast.fire({ icon: "success", title: "Contraseña actualizada" });
});

const mascotasGrid = document.getElementById("mascotasGrid");
const mascotaForm = document.getElementById("mascotaForm");
const modalMascota = new bootstrap.Modal(document.getElementById("modalMascota"));
const mascotaTipo = document.getElementById("mascotaTipo");

const iconoMascota = (mascota) => {
    const tipo = mascota.petType?.petType;
    if (tipo === "Perro") return "fa-dog";
    if (tipo === "Gato") return "fa-cat";
    return "fa-paw";
};

async function cargarTiposMascota() {
    const response = await fetch(`${API_URL}/pet-types`);
    const tipos = await response.json();
    llenarSelect(mascotaTipo, tipos.map((tipo) => ({ valor: tipo.petTypeId, texto: tipo.petType })), "Selecciona...");
}

function renderMascotas() {
    if (mascotas.length === 0) {
        mascotasGrid.innerHTML = `
            <div class="col-12 cuenta-vacio">
                <i class="fa-solid fa-paw"></i>
                Aún no registras mascotas. ¡Agrega a tu mejor amigo!
            </div>
        `;
        return;
    }

    mascotasGrid.innerHTML = mascotas.map((mascota) => `
        <div class="col-12 col-sm-6 col-xl-4">
            <div class="mascota-card">
                <div class="d-flex align-items-center gap-3 mb-1">
                    <div class="mascota-icono"><i class="fa-solid ${iconoMascota(mascota)}"></i></div>
                    <div>
                        <h3 class="h6 fw-bold mb-0">${escaparHTML(mascota.petName)}</h3>
                        <span class="mascota-dato">${escaparHTML(mascota.petType?.petType ?? "Sin tipo")}</span>
                    </div>
                </div>
                <span class="mascota-dato"><i class="bi bi-calendar-heart"></i> ${escaparHTML(mascota.petAge)}</span>
                <span class="mascota-dato"><i class="bi bi-arrows-angle-expand"></i> ${escaparHTML(mascota.petSize)}</span>
                <span class="mascota-dato"><i class="bi bi-speedometer2"></i> ${escaparHTML(mascota.petWeight)}</span>
                <div class="d-flex gap-2 mt-auto pt-2">
                    <button type="button" class="btn btn-sm btn-outline-secondary flex-fill" data-editar-mascota="${mascota.id}">
                        <i class="bi bi-pencil"></i> Editar
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger flex-fill" data-eliminar-mascota="${mascota.id}">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        </div>
    `).join("");
}

async function cargarMascotas() {
    const response = await fetch(`${API_URL}/users/${session.id}/pets`);
    mascotas = response.ok ? await response.json() : [];
    renderMascotas();
}

function abrirModalMascota(mascota = null) {
    mascotaForm.reset();
    mascotaForm.classList.remove("was-validated");
    document.getElementById("modalMascotaTitulo").textContent = mascota ? `Editar a ${mascota.petName}` : "Agregar mascota";
    document.getElementById("mascotaId").value = mascota?.id ?? "";
    document.getElementById("mascotaNombre").value = mascota?.petName ?? "";
    mascotaTipo.value = mascota?.petType?.petTypeId ?? "";
    document.getElementById("mascotaEdad").value = mascota?.petAge ?? "";
    document.getElementById("mascotaTamano").value = mascota?.petSize ?? "";
    document.getElementById("mascotaPeso").value = mascota?.petWeight ?? "";
    modalMascota.show();
}

document.getElementById("btnAgregarMascota").addEventListener("click", () => abrirModalMascota());

mascotasGrid.addEventListener("click", async (e) => {
    const editar = e.target.closest("[data-editar-mascota]");
    const eliminar = e.target.closest("[data-eliminar-mascota]");

    if (editar) {
        abrirModalMascota(mascotas.find((mascota) => String(mascota.id) === editar.dataset.editarMascota));
        return;
    }

    if (eliminar) {
        const mascota = mascotas.find((item) => String(item.id) === eliminar.dataset.eliminarMascota);
        if (!await confirmar(`¿Eliminar a ${mascota.petName}?`, "Esta acción no se puede deshacer.")) return;
        const response = await fetch(`${API_URL}/pets/${mascota.id}`, { method: "DELETE" });
        if (!response.ok) {
            Swal.fire({ icon: "error", title: "No se pudo eliminar", text: await leerErrorApi(response) });
            return;
        }
        Toast.fire({ icon: "success", title: `${mascota.petName} se eliminó` });
        cargarMascotas();
    }
});

mascotaForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    mascotaForm.classList.add("was-validated");
    if (!mascotaForm.checkValidity()) return;

    const id = document.getElementById("mascotaId").value;
    const datos = {
        petName: document.getElementById("mascotaNombre").value.trim(),
        petTypeId: Number(mascotaTipo.value),
        petAge: document.getElementById("mascotaEdad").value,
        petSize: document.getElementById("mascotaTamano").value,
        petWeight: document.getElementById("mascotaPeso").value
    };

    const response = await fetch(id ? `${API_URL}/pets/${id}` : `${API_URL}/users/${session.id}/pets`, {
        method: id ? "PUT" : "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify(datos)
    });
    if (!response.ok) {
        Swal.fire({ icon: "error", title: "No se pudo guardar", text: await leerErrorApi(response) });
        return;
    }

    modalMascota.hide();
    Toast.fire({ icon: "success", title: id ? "Mascota actualizada" : `¡Bienvenido, ${datos.petName}!` });
    cargarMascotas();
});

const pedidosAccordion = document.getElementById("pedidosAccordion");
const ESTADOS = {
    ENTREGADO: "Entregado",
    ENVIADO: "Enviado",
    PAGADO: "Pagado",
    PENDIENTE: "Pendiente de pago",
    CANCELADO: "Cancelado"
};

const formatoFecha = (fecha) => new Date(fecha).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });

async function cargarPedidos() {
    const response = await fetch(`${API_URL}/users/${session.id}/orders`);
    const pedidos = response.ok ? await response.json() : [];

    if (pedidos.length === 0) {
        pedidosAccordion.innerHTML = `
            <div class="cuenta-vacio">
                <i class="bi bi-bag"></i>
                Aún no tienes pedidos.
                <div class="mt-3"><a href="productos.html" class="btn btn-boupetique">Ir a la tienda</a></div>
            </div>
        `;
        return;
    }

    pedidosAccordion.innerHTML = pedidos.map((pedido, index) => {
        const detalles = [...(pedido.productDetails ?? [])].sort((a, b) => a.products.title.localeCompare(b.products.title, "es-MX"));
        const piezas = detalles.reduce((sum, detalle) => sum + detalle.quantity, 0);
        const items = detalles.map((detalle) => {
            const producto = mapProduct(detalle.products);
            return `
                <div class="pedido-item d-flex align-items-center gap-3 py-2">
                    <img src="${escaparHTML(producto.Imagen_URL || "../assets/productos-img/default.jpeg")}" alt="">
                    <div class="flex-grow-1">
                        <a href="productos.html?sku=${encodeURIComponent(producto.sku)}" class="fw-semibold text-decoration-none text-dark">${escaparHTML(producto.Nombre)}</a>
                        <div class="small text-muted">${detalle.quantity} × ${formatoMXN(detalle.unitPriceHistorical)}</div>
                    </div>
                    <span class="fw-semibold">${formatoMXN(detalle.quantity * detalle.unitPriceHistorical)}</span>
                </div>
            `;
        }).join("");

        return `
            <div class="accordion-item">
                <h3 class="accordion-header">
                    <button class="accordion-button ${index === 0 ? "" : "collapsed"}" type="button" data-bs-toggle="collapse"
                        data-bs-target="#pedido-${pedido.id}">
                        <div class="d-flex flex-wrap align-items-center gap-2 gap-md-4 w-100 me-3">
                            <span class="fw-bold">Pedido #${pedido.id}</span>
                            <span class="small text-muted">${formatoFecha(pedido.orderDate)}</span>
                            <span class="estado-pedido estado-${pedido.statusO}">${ESTADOS[pedido.statusO] ?? pedido.statusO}</span>
                            <span class="ms-md-auto fw-semibold">${formatoMXN(pedido.totalAmount)}</span>
                        </div>
                    </button>
                </h3>
                <div id="pedido-${pedido.id}" class="accordion-collapse collapse ${index === 0 ? "show" : ""}" data-bs-parent="#pedidosAccordion">
                    <div class="accordion-body">
                        ${items}
                        <div class="d-flex flex-wrap justify-content-between border-top pt-2 mt-2 small">
                            <span><i class="bi bi-credit-card"></i> Pagado con: ${escaparHTML(pedido.paymentId?.paymentMethod ?? "Pendiente")}</span>
                            <span>${piezas} pieza${piezas === 1 ? "" : "s"} · Total ${formatoMXN(pedido.totalAmount)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

const metodosPagoList = document.getElementById("metodosPagoList");
const metodoPagoForm = document.getElementById("metodoPagoForm");
const modalMetodoPago = new bootstrap.Modal(document.getElementById("modalMetodoPago"));
const mpTipo = document.getElementById("mpTipo");
const mpNumero = document.getElementById("mpNumero");
const mpVencimiento = document.getElementById("mpVencimiento");

function mostrarCamposMetodo() {
    document.querySelectorAll("[data-mp-tipo]").forEach((grupo) => {
        grupo.hidden = grupo.dataset.mpTipo !== mpTipo.value;
    });
}

function renderMetodos() {
    if (metodosPago.length === 0) {
        metodosPagoList.innerHTML = `
            <div class="cuenta-vacio">
                <i class="bi bi-wallet2"></i>
                No tienes métodos de pago guardados.
            </div>
        `;
        return;
    }

    metodosPagoList.innerHTML = metodosPago.map((metodo) => `
        <div class="metodo-pago">
            <i class="bi ${iconoMetodo(metodo)} metodo-icono"></i>
            <div class="flex-grow-1">
                <div class="fw-semibold">
                    ${escaparHTML(describirMetodo(metodo))}
                    ${metodo.isDefault ? '<span class="badge-predeterminado ms-1">Predeterminado</span>' : ""}
                </div>
                <div class="small text-muted">
                    ${escaparHTML(metodo.alias ?? "")}
                    ${metodo.holderName ? ` · ${escaparHTML(metodo.holderName)}` : ""}
                    ${metodo.expiry ? ` · Vence ${escaparHTML(metodo.expiry)}` : ""}
                </div>
            </div>
            <div class="d-flex flex-wrap gap-2">
                ${metodo.isDefault ? "" : `<button type="button" class="btn btn-sm btn-outline-secondary" data-predeterminar="${metodo.id}">Hacer predeterminado</button>`}
                <button type="button" class="btn btn-sm btn-outline-secondary" data-editar-metodo="${metodo.id}"><i class="bi bi-pencil"></i></button>
                <button type="button" class="btn btn-sm btn-outline-danger" data-eliminar-metodo="${metodo.id}"><i class="bi bi-trash"></i></button>
            </div>
        </div>
    `).join("");
}

async function cargarMetodos() {
    try {
        metodosPago = await obtenerMetodosPago(session.id);
    } catch {
        metodosPago = [];
    }
    renderMetodos();
}

function abrirModalMetodo(metodo = null) {
    metodoPagoForm.reset();
    metodoPagoForm.classList.remove("was-validated");
    document.getElementById("modalMetodoTitulo").textContent = metodo ? "Editar método de pago" : "Agregar método de pago";
    document.getElementById("mpId").value = metodo?.id ?? "";
    mpTipo.value = metodo?.type ?? "Tarjeta";
    mpTipo.disabled = Boolean(metodo);
    mpNumero.disabled = Boolean(metodo);
    mpNumero.value = metodo?.last4 ? `•••• •••• •••• ${metodo.last4}` : "";
    document.getElementById("mpTitular").value = metodo?.holderName ?? "";
    mpVencimiento.value = metodo?.expiry ?? "";
    document.getElementById("mpPaypalEmail").value = metodo?.paypalEmail ?? "";
    document.getElementById("mpAlias").value = metodo?.alias ?? "";
    document.getElementById("mpPredeterminado").checked = Boolean(metodo?.isDefault) || metodosPago.length === 0;
    mostrarCamposMetodo();
    modalMetodoPago.show();
}

mpTipo.addEventListener("change", mostrarCamposMetodo);
mpNumero.addEventListener("input", () => {
    mpNumero.value = formatearNumeroTarjeta(mpNumero.value);
});
mpVencimiento.addEventListener("input", () => {
    mpVencimiento.value = formatearVencimiento(mpVencimiento.value);
});

document.getElementById("btnAgregarMetodo").addEventListener("click", () => abrirModalMetodo());

metodosPagoList.addEventListener("click", async (e) => {
    const predeterminar = e.target.closest("[data-predeterminar]");
    const editar = e.target.closest("[data-editar-metodo]");
    const eliminar = e.target.closest("[data-eliminar-metodo]");

    if (predeterminar) {
        await fetch(`${API_URL}/payment-methods/${predeterminar.dataset.predeterminar}`, {
            method: "PUT",
            headers: JSON_HEADERS,
            body: JSON.stringify({ isDefault: true })
        });
        cargarMetodos();
        return;
    }

    if (editar) {
        abrirModalMetodo(metodosPago.find((metodo) => String(metodo.id) === editar.dataset.editarMetodo));
        return;
    }

    if (eliminar) {
        const metodo = metodosPago.find((item) => String(item.id) === eliminar.dataset.eliminarMetodo);
        if (!await confirmar("¿Eliminar este método de pago?", describirMetodo(metodo))) return;
        await fetch(`${API_URL}/payment-methods/${metodo.id}`, { method: "DELETE" });
        Toast.fire({ icon: "success", title: "Método de pago eliminado" });
        cargarMetodos();
    }
});

function validarMetodo(editando) {
    const tipo = mpTipo.value;
    const titular = document.getElementById("mpTitular");
    const paypal = document.getElementById("mpPaypalEmail");

    [titular, mpNumero, mpVencimiento, paypal].forEach((campo) => campo.setCustomValidity(""));
    if (tipo === "Tarjeta") {
        if (titular.value.trim().length < 3) titular.setCustomValidity("Titular requerido");
        if (!editando && (!luhnValido(mpNumero.value) || !detectarMarca(mpNumero.value))) mpNumero.setCustomValidity("Tarjeta no válida");
        if (!vencimientoValido(mpVencimiento.value)) mpVencimiento.setCustomValidity("Vencimiento no válido");
    }
    if (tipo === "PayPal" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paypal.value.trim())) {
        paypal.setCustomValidity("Correo no válido");
    }
    metodoPagoForm.classList.add("was-validated");
    return metodoPagoForm.checkValidity();
}

metodoPagoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("mpId").value;
    if (!validarMetodo(Boolean(id))) return;

    const tipo = mpTipo.value;
    const datos = {
        alias: document.getElementById("mpAlias").value.trim() || null,
        isDefault: document.getElementById("mpPredeterminado").checked
    };
    if (tipo === "Tarjeta") {
        datos.holderName = document.getElementById("mpTitular").value.trim();
        datos.expiry = mpVencimiento.value.trim();
    }
    if (tipo === "PayPal") datos.paypalEmail = document.getElementById("mpPaypalEmail").value.trim();

    try {
        if (id) {
            const response = await fetch(`${API_URL}/payment-methods/${id}`, {
                method: "PUT",
                headers: JSON_HEADERS,
                body: JSON.stringify(datos)
            });
            if (!response.ok) throw new Error(await leerErrorApi(response));
        } else {
            const digitos = mpNumero.value.replace(/\D/g, "");
            await guardarMetodoPago(session.id, {
                ...datos,
                type: tipo,
                brand: tipo === "Tarjeta" ? detectarMarca(digitos) : null,
                last4: tipo === "Tarjeta" ? digitos.slice(-4) : null
            });
        }
    } catch (error) {
        Swal.fire({ icon: "error", title: "No se pudo guardar", text: error.message });
        return;
    }

    modalMetodoPago.hide();
    Toast.fire({ icon: "success", title: "Método de pago guardado" });
    cargarMetodos();
});

llenarSelect(document.getElementById("mascotaEdad"), EDADES, "Edad...");
llenarSelect(document.getElementById("mascotaTamano"), TAMANOS, "Tamaño...");
llenarSelect(document.getElementById("mascotaPeso"), PESOS, "Peso...");
mostrarPestanaDesdeHash();

try {
    await cargarPerfil();
} catch (error) {
    Swal.fire({ icon: "error", title: "No pudimos cargar tu cuenta", text: error.message });
}
await Promise.all([cargarTiposMascota(), cargarMascotas(), cargarPedidos(), cargarMetodos()]);
