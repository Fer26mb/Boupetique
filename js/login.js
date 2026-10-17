// variables donde se capturan los datos del usuario.
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signInForm");
    const emailInput = document.getElementById("emailInput");
    const passwordInput = document.getElementById("passwordInput");
    const alertContainer = document.getElementById("alertContainer");
    const paneles = {
        login: document.getElementById("panelLogin"),
        registro: document.getElementById("panelRegistro")
    };

    // expresion regular para validar formato estándar de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const mostrarPanel = (modo, enfocar = true) => {
        const activo = paneles[modo] ? modo : "login";

        Object.entries(paneles).forEach(([nombre, panel]) => {
            panel.hidden = nombre !== activo;
        });
        document.querySelectorAll("[data-auth-tab]").forEach((tab) => {
            const seleccionado = tab.dataset.authTab === activo;
            tab.classList.toggle("active", seleccionado);
            tab.setAttribute("aria-selected", String(seleccionado));
        });
        document.title = activo === "registro" ? "Boupetique - Crear cuenta" : "Boupetique - Iniciar sesión";

        const params = new URLSearchParams(window.location.search);
        if (activo === "registro") params.set("modo", "registro");
        else params.delete("modo");
        const query = params.toString();
        history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);

        if (enfocar) paneles[activo].querySelector("input")?.focus();
    };

    document.addEventListener("click", (e) => {
        const control = e.target.closest("[data-auth-tab], [data-auth-switch]");
        if (!control) return;
        e.preventDefault();
        mostrarPanel(control.dataset.authTab || control.dataset.authSwitch);
    });

    mostrarPanel(new URLSearchParams(window.location.search).get("modo"), false);

    if (getSession()?.id) {
        window.location.replace(sitePath(`/${destinoTrasLogin()}`));
        return;
    }

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
    form.addEventListener("submit", async (e) => {
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

        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email, passwordSite: password })
            });
            if (!response.ok) {
                showAlert("Correo o contraseña incorrectos.", "danger");
                return;
            }

            guardarSesion(await response.json());
        } catch (error) {
            showAlert("No se pudo conectar con el servidor.", "danger");
            return;
        }

        showAlert("¡Bienvenido a Boupetique!", "success");

        setTimeout(() => {
            window.location.href = sitePath(`/${destinoTrasLogin()}`);
        }, 1200);
    });
});
