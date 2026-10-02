// ============================================================
//Script de validacion de formulario contacto , PIWIBABIS EAA 
//ESPERAMOS A QUE TODO EL HTML CARGUE
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    // ========================================================
    // OBTENEMOS LOS ELEMENTOS DEL HTML
    // ========================================================

    const formulario = document.getElementById("formulario");

    const nombre = document.getElementById("nombre");
    const correo = document.getElementById("correo");
    const telefono = document.getElementById("telefono");
    const mensaje = document.getElementById("mensaje");

    const btnEnviar = document.getElementById("btnEnviar");

    const contador = document.getElementById("contador");

    const checkMensaje = document.getElementById("checkMensaje");


    // ========================================================
    // FUNCIÓN PARA VALIDAR NOMBRE
    // ========================================================

    function validarNombre() {

        /*
            Esta expresión permite:

            A-Z       → letras mayúsculas
            a-z       → letras minúsculas
            ÁÉÍÓÚ     → letras con acento
            Ñ         → ñ
            \s        → espacios
        */

        const nombreCorrecto =
            /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]{3,}$/.test(nombre.value.trim());


        if (nombreCorrecto) {

            // Bootstrap lo pinta verde
            nombre.classList.add("is-valid");
            nombre.classList.remove("is-invalid");

            // Nuestra clase para mostrar ✓
            nombre.classList.add("campo-valido");

        } else {

            // Bootstrap lo pinta rojo
            nombre.classList.add("is-invalid");
            nombre.classList.remove("is-valid");

            nombre.classList.remove("campo-valido");
        }

        return nombreCorrecto;
    }


    // ========================================================
    // FUNCIÓN PARA VALIDAR CORREO
    // ========================================================

    function validarCorreo() {

        /*
            Una validación sencilla de correo.

            Ejemplo válido:
            usuario@correo.com
        */

        const correoCorrecto =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim());


        if (correoCorrecto) {

            correo.classList.add("is-valid");
            correo.classList.remove("is-invalid");

            correo.classList.add("campo-valido");

        } else {

            correo.classList.add("is-invalid");
            correo.classList.remove("is-valid");

            correo.classList.remove("campo-valido");
        }

        return correoCorrecto;
    }


    // ========================================================
    // FUNCIÓN PARA VALIDAR TELÉFONO
    // ========================================================

    function validarTelefono() {

        /*
            \d significa número.

            {10} significa exactamente 10 números.
        */

        const telefonoCorrecto =
            /^\d{10}$/.test(telefono.value.trim());


        if (telefonoCorrecto) {

            telefono.classList.add("is-valid");
            telefono.classList.remove("is-invalid");

            telefono.classList.add("campo-valido");

        } else {

            telefono.classList.add("is-invalid");
            telefono.classList.remove("is-valid");

            telefono.classList.remove("campo-valido");
        }

        return telefonoCorrecto;
    }


    // ========================================================
    // FUNCIÓN PARA VALIDAR MENSAJE
    // ========================================================

    function validarMensaje() {

        const mensajeCorrecto =
            mensaje.value.trim().length >= 30;


        if (mensajeCorrecto) {

            mensaje.classList.add("is-valid");
            mensaje.classList.remove("is-invalid");

            checkMensaje.classList.add("mostrar");

        } else {

            mensaje.classList.add("is-invalid");
            mensaje.classList.remove("is-valid");

            checkMensaje.classList.remove("mostrar");
        }

        return mensajeCorrecto;
    }


    // ========================================================
    // ACTUALIZAR CONTADOR DEL MENSAJE
    // ========================================================

    function actualizarContador() {

        const cantidad = mensaje.value.length;

        contador.textContent = cantidad + " / 30";

    }



    // ========================================================
    // VALIDAR TODO EL FORMULARIO
    // ========================================================

    function validarFormulario() {

        /*
            Ejecutamos todas las validaciones.
        */

        const nombreValido = validarNombre();

        const correoValido = validarCorreo();

        const telefonoValido = validarTelefono();

        const mensajeValido = validarMensaje();


        /*
            Solamente si TODOS son true,
            permitimos enviar.
        */

        const formularioValido =
            nombreValido &&
            correoValido &&
            telefonoValido &&
            mensajeValido;


        // Habilitamos o deshabilitamos el botón
        btnEnviar.disabled = !formularioValido;


        return formularioValido;
    }


    // ========================================================
    // EVENTOS DE LOS CAMPOS
    // ========================================================

/*
!REFACTORIZANDO, codigo de Eduardo Alvarez. Dejo el equipo.*/      
    nombre.addEventListener("input", function () {

        validarNombre();
        validarFormulario();

    });


    correo.addEventListener("input", function () {

        validarCorreo();
        validarFormulario();

    });


    telefono.addEventListener("input", function () {

        validarTelefono();
        validarFormulario();

    });


    mensaje.addEventListener("input", function () {

        actualizarContador();
        validarMensaje();
        validarFormulario();

    });


    // ========================================================
    // FUNCIÓN PARA VERIFICAR TIEMPO ENTRE ENVÍOS
    // ========================================================

    function puedeEnviar() {

        /*
            Buscamos en localStorage
            cuándo fue el último envío.
        */

        const ultimoEnvio =
            localStorage.getItem("ultimoEnvio");


        /*
            Si nunca ha enviado,
            puede hacerlo.
        */

        if (!ultimoEnvio) {
            return true;
        }


        // Tiempo actual
        const ahora = Date.now();


        // Convertimos el valor guardado a número
        const tiempoAnterior = Number(ultimoEnvio);


        /*
            Diferencia entre el envío actual
            y el envío anterior.
        */

        const diferencia =
            ahora - tiempoAnterior;


        /*
            60 segundos = 60 * 1000 milisegundos

            Aquí podemos cambiar el tiempo.
        */

        const tiempoEspera = 60 * 1000;


        return diferencia >= tiempoEspera;
    }


    // ========================================================
    // BLOQUEAR FORMULARIO
    // ========================================================

    function bloquearFormulario() {

        // TODO . verificar
       /*
        nombre.disabled = true;
        correo.disabled = true;
        telefono.disabled = true;
        mensaje.disabled = true;
*/
        //btnEnviar.disabled = true;

    }


    // ========================================================
    // ENVIAR FORMULARIO
    // ========================================================

    formulario.addEventListener("submit", function (evento) {

        /*
            MUY IMPORTANTE:

            Evitamos que el navegador mande
            el formulario automáticamente.
        */

        evento.preventDefault();


        // ====================================================
        // SEGUNDA CAPA DE SEGURIDAD
        // ====================================================

        /*
            Aunque alguien quite "disabled"
            desde las herramientas del navegador,
            volvemos a validar aquí.
        */

        if (!validarFormulario()) {

            alert(
                "Debes completar correctamente todos los campos antes de enviar."
            );

            return;
        }


        // ====================================================
        // VERIFICAR TIEMPO DE ESPERA
        // ====================================================

        if (!puedeEnviar()) {

            alert(
                "Ya enviaste el formulario recientemente. " +
                "Espera un momento antes de volver a enviarlo.\n"+
                "Tiempo de espera restante "+revisarTiempoEspera()+" segundos!"
            );

            bloquearFormulario();

            return;
        }


        // ====================================================
        // OBTENER LOS DATOS
        // ====================================================

        const datos = {

            nombre: nombre.value.trim(),

            correo: correo.value.trim(),

            telefono: telefono.value.trim(),

            mensaje: mensaje.value.trim()
        };


        // ====================================================
        // GUARDAR HORA DEL ENVÍO
        // ====================================================

        localStorage.setItem(
            "ultimoEnvio",
            Date.now()
        );


        // ====================================================
        // MOSTRAR DATOS
        // ====================================================
        const resumenTexto = document.getElementById("modalResumenTexto");

        resumenTexto.textContent = 
    "¡Gracias por tu mensaje!\nUno de nuestros asesores se pondrá en contacto contigo pronto.\n\n";
   
        const modalElement = document.getElementById("successModal");
        const bootstrapModal = bootstrap.Modal.getOrCreateInstance(modalElement);
        bootstrapModal.show();
        // ====================================================
        // LIMPIAR FORMULARIO
        // ====================================================

       // alert("hoa");
        formulario.reset();


        // Quitamos las clases visuales
        nombre.classList.remove("is-valid", "campo-valido");

        correo.classList.remove("is-valid", "campo-valido");

        telefono.classList.remove("is-valid", "campo-valido");

        mensaje.classList.remove("is-valid");

        checkMensaje.classList.remove("mostrar");


        // Reiniciamos contador
        contador.textContent = "0 / 30";


        // Deshabilitamos nuevamente el botón
        btnEnviar.disabled = true;


        /*
            Opcionalmente bloqueamos el formulario
            durante el tiempo de espera.
        */

        bloquearFormulario();

    });


    // ========================================================
    // EVENTO DEL BOTÓN RESET
    // ========================================================

    formulario.addEventListener("reset", function () {

        /*
            Esperamos un momento para que el navegador
            termine de limpiar los campos.
        */

        setTimeout(function () {

            nombre.classList.remove("is-valid", "is-invalid", "campo-valido");

            correo.classList.remove("is-valid", "is-invalid", "campo-valido");

            telefono.classList.remove("is-valid", "is-invalid", "campo-valido");

            mensaje.classList.remove("is-valid", "is-invalid");

            checkMensaje.classList.remove("mostrar");

            contador.textContent = "0 / 30";

            btnEnviar.disabled = true;

        }, 10);

    });

    function revisarTiempoEspera() {

    const ultimoEnvio = localStorage.getItem("ultimoEnvio");

    // Si nunca ha enviado, no hay nada que bloquear
    if (!ultimoEnvio) {
        return;
    }

    const ahora = Date.now();

    const tiempoAnterior = Number(ultimoEnvio);

    // 60 segundos
    const tiempoEspera = 60 * 1000;

    const diferencia = ahora - tiempoAnterior;


    // Si ya pasó el tiempo
    if (diferencia >= tiempoEspera) {

        // Volvemos a validar
        validarFormulario();

    } else {

        // Todavía no puede enviar
       // btnEnviar.disabled = true;
    }
    const tiempoRestante = tiempoEspera - diferencia;
    const segundosRestantes = Math.ceil(tiempoRestante / 1000);
    return segundosRestantes;
}

revisarTiempoEspera();

});