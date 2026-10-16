// variables donde se capturan los datos del usuario.
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signInForm");
    const emailInput = document.getElementById("emailInput");
    const passwordInput = document.getElementById("passwordInput");
    const alertContainer = document.getElementById("alertContainer");

    // expresion regular para validar formato estándar de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // funcion para mostrar alertas de Bootstrap
    const showAlert = (message, type = "danger") => {
        alertContainer.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show text-start" role="alert">
                <i class="fa-solid ${type === 'danger' ? 'fa-circle-exclamation' : 'fa-circle-check'} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    };
    // extraemos datos del formulario y los validamos, si son correctos los guardamos en el localStorage y redirigimos al index.html
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // validaciones de campos
        if (!email || !password) {
            showAlert("Por favor, completa todos los campos del formulario.", "danger");
            return;
        }
        if (!emailRegex.test(email)) {
            showAlert("Por favor, ingresa un correo electrónico válido.", "warning");
            return;
        }
        if (password.length < 8) {
            showAlert("La contraseña debe tener al menos 8 caracteres.", "warning");
            return;
        }

        // NUEVO OBJETO: guarda la contraseña directamente en el objeto
        const sessionData = {
            email: email,
            password: password
        };

        // Este bloque oculta la contraseña en el objeto sessionData antes de guardarlo en el LocalStorage.
        /*
        const sessionData = {
            email: email,
            loginTime: new Date().toISOString(),
            isLoggedIn: true
        };
        */

        // guardar en el LocalStorage convertida a texto JSON
        localStorage.setItem("userSession", JSON.stringify(sessionData));

        showAlert("¡Bienvenido a Boupetique!", "success");

        setTimeout(() => {
            window.location.href = "../index.html";
            }, 3000); // tiempo de espera antes de redirigir al index.html  (3seg)
    });
});