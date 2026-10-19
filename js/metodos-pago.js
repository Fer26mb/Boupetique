
export const TIPOS_METODO = ["Tarjeta", "PayPal", "OXXO"];

export function detectarMarca(numero) {
    const digitos = String(numero).replace(/\D/g, "");
    if (/^4/.test(digitos)) return "Visa";
    if (/^(5[1-5]|2[2-7])/.test(digitos)) return "Mastercard";
    if (/^3[47]/.test(digitos)) return "Amex";
    return null;
}

export function luhnValido(numero) {
    const digitos = String(numero).replace(/\D/g, "");
    if (digitos.length < 13 || digitos.length > 19) return false;
    let suma = 0;
    digitos.split("").reverse().forEach((caracter, index) => {
        let valor = Number(caracter);
        if (index % 2 === 1) {
            valor *= 2;
            if (valor > 9) valor -= 9;
        }
        suma += valor;
    });
    return suma % 10 === 0;
}

export function vencimientoValido(vencimiento) {
    const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(String(vencimiento).trim());
    if (!match) return false;
    const fin = new Date(2000 + Number(match[2]), Number(match[1]), 1);
    return fin > new Date();
}

export function formatearNumeroTarjeta(valor) {
    return String(valor).replace(/\D/g, "").slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function formatearVencimiento(valor) {
    const digitos = String(valor).replace(/\D/g, "").slice(0, 4);
    return digitos.length > 2 ? `${digitos.slice(0, 2)}/${digitos.slice(2)}` : digitos;
}

export function describirMetodo(metodo) {
    if (metodo.type === "Tarjeta") return `${metodo.brand} •••• ${metodo.last4}`;
    if (metodo.type === "PayPal") return `PayPal (${metodo.paypalEmail})`;
    return "OXXO";
}

export function iconoMetodo(metodo) {
    if (metodo.type === "Tarjeta") return "bi-credit-card-2-front";
    if (metodo.type === "PayPal") return "bi-paypal";
    return "bi-shop";
}

export async function leerErrorApi(response, mensaje = "Ocurrió un error, intenta de nuevo.") {
    try {
        const data = await response.json();
        return data.detail || mensaje;
    } catch {
        return mensaje;
    }
}

export async function obtenerMetodosPago(userId) {
    const response = await fetch(`${API_URL}/users/${userId}/payment-methods`);
    if (!response.ok) throw new Error(await leerErrorApi(response, "No se pudieron cargar tus métodos de pago."));
    return response.json();
}

export async function guardarMetodoPago(userId, datos) {
    const response = await fetch(`${API_URL}/users/${userId}/payment-methods`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    });
    if (!response.ok) throw new Error(await leerErrorApi(response, "No se pudo guardar el método de pago."));
    return response.json();
}
