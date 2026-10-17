// ============================================================
//Script de validacion de formulario contacto , PIWIBABIS EAA 
//ESPERAMOS A QUE TODO EL HTML CARGUE - SE RE UTILIZA CODIGO DE CONTACTO
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    //
    // SE REUTILIZA PARTE DEL CODIGO REALIZADO EN LA PAGINA DE CONTACTO.HTML PARA ADECUARLO A REGISTROS.HTML (REGISTROS.JS)
    //
    // id
    const formulario = document.getElementById("formulario");

    const nombre = document.getElementById("nombre");
    const correo = document.getElementById("correo");
    const telefono = document.getElementById("telefono");
    //const mensaje = document.getElementById("mensaje");

    const btnEnviar = document.getElementById("btnEnviar");



    // se agregan estos nuevos elementos html vía ID como parte de los campos de la pagina Registro agregar las variables de acuerdo
    // a l id en el html, utilzando document.getEelemenByID.--- (1)
    const contador = document.getElementById("contador");
    const repcontador = document.getElementById("repcontador");



    const contrasena = document.getElementById("contrasena");

    const repcontrasena = document.getElementById("repcontrasena");


    const mascota = document.getElementById("mascota");
    const apellido = document.getElementById("apellido");
    const tipomascota = document.getElementById("tipomascota");
    const anio = document.getElementById("anio");
    const mes = document.getElementById("mes");
    const dia = document.getElementById("dia");
    const edadm = document.getElementById("edadm");
    const tamano = document.getElementById("tamano");
    const peso = document.getElementById("peso");

    const exampleCheck1 = document.getElementById("exampleCheck1");



    //validar los select que se encuentran en el formulario de registro o pagina de registro
    // usando elemento.value !== que revisa que si o si el  usuario eliga algo de las opciones
    //  (2)
    function validarSelect(elemento) {
        const valido = elemento.value !== "";
        if (valido) {
            //classlist son herramientas de bootstrap si es correto se pone verde (is-valid) si no rojo
            elemento.classList.add("is-valid");
            elemento.classList.remove("is-invalid");
        } else {
            elemento.classList.add("is-invalid");
            elemento.classList.remove("is-valid");
        }
        return valido; //devuelve si pasa o no
    }










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
        // Toma lo que el usuario escribió en el cuadro de nombre y le borra los espacios vacíos sobrantes al principio y al final por seguridad.
        // test es una expresion que ayuda como filtro para comprobar que lo se escribe sigue las reglas.
        if (nombreCorrecto) {

            // Bootstrap lo pinta verde, exactamente igual que en select
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


    //se agregan apellido con su expresiones permitidas (3)
    function validarApellido() {

        /*
            Esta expresión permite:

            A-Z       → letras mayúsculas
            a-z       → letras minúsculas
            ÁÉÍÓÚ     → letras con acento
            Ñ         → ñ
            \s        → espacios
        */

        const ApellidoC =
            /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]{3,}$/.test(apellido.value.trim());


        if (ApellidoC) {

            // Bootstrap lo pinta verde
            apellido.classList.add("is-valid");
            apellido.classList.remove("is-invalid");

            // Nuestra clase para mostrar ✓
            apellido.classList.add("campo-valido");

        } else {

            // Bootstrap lo pinta rojo
            apellido.classList.add("is-invalid");
            apellido.classList.remove("is-valid");

            apellido.classList.remove("campo-valido");
        }

        return ApellidoC;
    }

    //se agregan nombre de mascota con su expresiones permitidas (4)

    function validarmascotaname() {

        /*
            Esta expresión permite:

            A-Z       → letras mayúsculas
            a-z       → letras minúsculas
            ÁÉÍÓÚ     → letras con acento
            Ñ         → ñ
            \s        → espacios
        */
        const namemascota =
            /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]{3,}$/.test(mascota.value.trim());


        if (namemascota) {

            // Bootstrap lo pinta verde
            mascota.classList.add("is-valid");
            mascota.classList.remove("is-invalid");

            // Nuestra clase para mostrar ✓
            mascota.classList.add("campo-valido");

        } else {

            // Bootstrap lo pinta rojo
            mascota.classList.add("is-invalid");
            mascota.classList.remove("is-valid");

            mascota.classList.remove("campo-valido");
        }

        return namemascota;
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
    // FUNCIÓN PARA VALIDAR contraseñas!!!!
    // ========================================================

    // se validan contraseñas (5)

    function validarContrasena() {
        const passValida = contrasena.value.trim().length >= 8;
        if (passValida) {
            contrasena.classList.add("is-valid");
            contrasena.classList.remove("is-invalid");

        } else {
            contrasena.classList.add("is-invalid");
            contrasena.classList.remove("is-valid");
        }
        return passValida;
    }

    // se valida repetir contraseña!!!! (6)

    function validarReiterarContrasena() {
        // Debe tener al menos 8 caracteres y coincidir exactamente con la contraseña principal
        const rep = repcontrasena.value.trim().length >= 8 &&  // que sea igual o mayor a 8 y si o si la contraseña puesta anteriormente (5)
            repcontrasena.value.trim() === contrasena.value.trim();
        if (rep) {
            repcontrasena.classList.add("is-valid");
            repcontrasena.classList.remove("is-invalid");
        } else { //si no invalido!!! 
            repcontrasena.classList.add("is-invalid");
            repcontrasena.classList.remove("is-valid");
        }
        return rep;
    }





















    // ========================================================
    // ACTUALIZAR CONTADOR DEL MENSAJE
    // ========================================================

    // Se actualizan los contadores (PASO 7) tanto de contador (contraseña) coomo del contador cuando se repite la contraseña 
    function actualizarContadores() {
        if (contador) {
            contador.textContent = contrasena.value.length + " / mínimo 8";
        } // Text content ayuda a cambiar lo que el usuario escribe en cantidad 
        if (repcontador) {
            repcontador.textContent = repcontrasena.value.length + " / mínimo 8";
        }
    }
















    // ========================================================
    // VALIDAR TODO EL FORMULARIO
    // ========================================================

    const camposFormulario = [nombre, apellido, mascota, correo, telefono, tipomascota, anio, mes, dia, edadm, tamano, peso, contrasena, repcontrasena];
    const tocados = new Set();

    ["input", "change"].forEach((tipoEvento) => {
        formulario.addEventListener(tipoEvento, (e) => {
            if (camposFormulario.includes(e.target)) tocados.add(e.target);
        }, true);
    });

    function validarFormulario() {

        /*
            Ejecutamos todas las validaciones para formulario (paso 8)
        */

        const nombreValido = validarNombre();

        const vApellido = validarApellido();

        const vamascotaname = validarmascotaname();

        const correoValido = validarCorreo();

        const telefonoValido = validarTelefono();

        const vTipoMascota = validarSelect(tipomascota);
        const vAnio = validarSelect(anio);
        const vMes = validarSelect(mes);
        const vDia = validarSelect(dia);
        const vEdadMascota = validarSelect(edadm);
        const vTamano = validarSelect(tamano);
        const vPeso = validarSelect(peso);


        const vContrasena = validarContrasena();
        const vReiterar = validarReiterarContrasena();
        const vTerminos = exampleCheck1.checked;

        // se agrega validacion contrasena
        //const contrasenaValida = validarcontrasena();


        /*
            Solamente si TODOS son true,
            permitimos enviar. (9))
        */
        // ejecuta todas las variables unidas por&& para que funcione el formulario si osi todos los datos deben estar
        const formularioValido =
            nombreValido &&
            correoValido &&
            telefonoValido &&
            vApellido &&
            vamascotaname &&
            vTipoMascota &&
            vAnio &&
            vMes &&
            vDia &&
            vEdadMascota &&
            vTamano &&
            vPeso &&
            vContrasena &&
            vReiterar &&
            vTerminos;
        //contrasenaValida;
        // se agrega contrasena

        camposFormulario.forEach((campo) => {
            if (!tocados.has(campo)) campo.classList.remove("is-invalid", "is-valid", "campo-valido");
        });

        // Habilitamos o deshabilitamos el botón (paso 10)
        btnEnviar.disabled = !formularioValido;
        // recordar ! si no es valido el boton estará deshabilitado ,si falla algo de arriba.

        return formularioValido;
    }


    // ========================================================
    // EVENTOS DE LOS CAMPOS
    // ========================================================


    // paso 11 Importante habilitar los campos para que salga error o se cumplan en caso de no escribir lo que se necesita
    // en el formulario de cada uno!
    nombre.addEventListener("input", function () {
        // input es un evento que se activa cada que el usuario presiona una tecla en el cuadro de texto (ejemplo nombre) etc
        validarNombre();
        validarFormulario();

    });


    //agregar apellido y nombre de mascota como listener se controla los errores

    apellido.addEventListener("input", function () {

        validarApellido();
        validarFormulario();

    });


    mascota.addEventListener("input", function () {

        validarmascotaname();
        validarFormulario();

    });

    //aqui acaba

    correo.addEventListener("input", function () {

        validarCorreo();
        validarFormulario();

    });


    telefono.addEventListener("input", function () {

        validarTelefono();
        validarFormulario();

    });


    contrasena.addEventListener("input", function () {
        actualizarContadores();
        validarContrasena();
        validarReiterarContrasena();
        validarFormulario();
    });

    repcontrasena.addEventListener("input", function () {
        actualizarContadores();
        validarReiterarContrasena();
        validarFormulario();
    });






    // campos select y checkbox 

    //paso 12 RECORDAR QUE LOS MENUS DESPLEGABLES SE VUELVEN ARRAYS.

    const camposSelect = [tipomascota, anio, mes, dia, edadm, tamano, peso];

    camposSelect.forEach(select => {
        // Solo ejecuta el listener si el elemento realmente existe en el HTML
        //se tienen muchos menus, se crea un array (de todos los datos de la lista)
        // y con for each se recorre uno por uno
        //changue similar a select, debido a las opciones que tiene
        if (select) {
            select.addEventListener("change", function () {
                validarSelect(select);
                validarFormulario();
            });
        }
    });

    exampleCheck1.addEventListener("change", function () {
        validarFormulario();
    });


    /*  se valida contrasena
        contrasena.addEventListener("input", function () {
    
            validarcontrasena();
            validarFormulario();
    
        });
    */



    // ========================================================
    // ========================================================

    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
        "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    async function cargarTiposMascota() {
        try {
            const response = await fetch(`${API_URL}/pet-types`);
            const tipos = await response.json();
            tipos.forEach((tipo) => {
                tipomascota.insertAdjacentHTML("beforeend",
                    `<option value="${tipo.petTypeId}">${tipo.petType}</option>`);
            });
        } catch (error) {
            console.error("No se pudieron cargar los tipos de mascota.", error);
        }
    }

    cargarTiposMascota();

    async function registrarUsuario(datos) {
        const mes = String(meses.indexOf(datos.mes) + 1).padStart(2, "0");

        const responseUsuario = await fetch(`${API_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userName: datos.nombre,
                surNames: datos.apellido,
                phoneNumber: datos.telefono,
                email: datos.correo,
                birthDate: `${datos.anio}-${mes}-${datos.dia}`,
                passwordSite: datos.contrasena
            })
        });
        if (responseUsuario.status === 409) {
            throw new Error("Ya existe una cuenta con ese correo.");
        }
        if (!responseUsuario.ok) {
            throw new Error("Revisa tus datos e intenta de nuevo.");
        }

        const usuario = await responseUsuario.json();

        await fetch(`${API_URL}/users/${usuario.id}/pets`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                petName: datos.mascota,
                petAge: datos.edadm,
                petWeight: datos.peso,
                petSize: datos.tamano,
                petTypeId: Number(datos.tipomascota)
            })
        });

        return usuario;
    }

    // ========================================================
    // ENVIAR FORMULARIO
    // ========================================================

    formulario.addEventListener("submit", async function (evento) {

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

        camposFormulario.forEach((campo) => tocados.add(campo));

        if (!validarFormulario()) {

            alert(
                "Debes completar correctamente todos los campos antes de enviar."
            );

            return;
        }


        // ====================================================
        // TODO OBTENER LOS DATOS JSON PASO 15 - CONTINUACION
        // ====================================================

        const datos = {
            nombre: nombre.value.trim(),
            apellido: apellido.value.trim(),
            correo: correo.value.trim(),
            telefono: telefono.value.trim(),
            mascota: mascota.value.trim(),
            tipomascota: tipomascota.value.trim(),
            anio: anio.value.trim(),
            mes: mes.value.trim(),
            dia: dia.value.trim(),
            edadm: edadm.value.trim(),
            tamano: tamano.value.trim(),
            peso: peso.value.trim(),
            contrasena: contrasena.value.trim(),
            rcontrasena: repcontrasena.value.trim()
        };


        let usuario;
        try {
            usuario = await registrarUsuario(datos);
        } catch (error) {
            Swal.fire({
                title: "No se pudo completar el registro",
                text: error.message,
                icon: "error"
            });
            return;
        }


        // ====================================================
        // ====================================================

        guardarSesion(usuario);

        await Swal.fire({
            title: `¡Bienvenido, ${datos.nombre}!`,
            text: `${datos.nombre} y ${datos.mascota} ya forman parte de Boupetique.`,
            icon: "success",
            timer: 2200,
            showConfirmButton: false
        });

        window.location.href = sitePath(`/${destinoTrasLogin()}`);

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



            document.getElementById("checkMensaje")?.classList.remove("mostrar");

            contador.textContent = "0 / 08";

            tocados.clear();
            camposFormulario.forEach((campo) => campo.classList.remove("is-invalid", "is-valid", "campo-valido"));

            btnEnviar.disabled = true;

        }, 10);

    });

    // =================================
    // MODAL TERMINOS Y CONDICIONES
    // =================================
    const terminosLink = document.getElementById("terminosLink");

    terminosLink.addEventListener("click", function () {

        Swal.fire({
            title: "Términos y condiciones",

            html: `
            <div style="
                max-height: 400px;
                overflow-y: auto;
                text-align: justify;
                padding: 10px;
            ">

                <h5>1. Aceptación de los términos</h5>

                <p>
                    Al registrarte y utilizar Boupetique,
                    aceptas los presentes términos y condiciones.
                </p>

                <h5>2. Registro de usuario</h5>

                <p>
                    Para crear una cuenta, el usuario deberá
                    proporcionar información verídica, completa
                    y actualizada.
                </p>

                <h5>3. Uso de la plataforma</h5>

                <p>
                    Boupetique es una plataforma de comercio
                    electrónico orientada a la venta de productos
                    para perros y gatos.
                </p>

                <h5>4. Productos y disponibilidad</h5>

                <p>
                    Los productos publicados en Boupetique están
                    sujetos a disponibilidad.
                </p>

                <h5>5. Precios y pagos</h5>

                <p>
                    Los precios serán los indicados en la plataforma
                    al momento de realizar la compra.
                </p>

                <h5>6. Pedidos</h5>

                <p>
                    El usuario será responsable de revisar la
                    información proporcionada antes de confirmar
                    un pedido.
                </p>

                <h5>7. Privacidad</h5>

                <p>
                    Boupetique reconoce la importancia de proteger
                    los datos personales de sus usuarios.
                </p>

                <h5>8. Bienestar animal</h5>

                <p>
                    Boupetique busca promover una relación responsable
                    entre las personas y sus animales de compañía.
                </p>

                <h5>9. Consumo responsable</h5>

                <p>
                    Boupetique busca promover prácticas de consumo
                    responsable y desarrollo sustentable.
                </p>

                <h5>10. Modificaciones</h5>

                <p>
                    Boupetique podrá actualizar estos términos y
                    condiciones cuando sea necesario.
                </p>

            </div>
        `,

            width: "700px",

            showCancelButton: true,

            confirmButtonText: "Acepto los términos",

            cancelButtonText: "Cerrar"

        }).then((result) => {

            if (result.isConfirmed) {

                exampleCheck1.checked = true;

            }

        });

    });

});