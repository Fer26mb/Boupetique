import { getProductOptions } from "./json.js";

/**
 * Registro local de productos.
 * Por ahora usamos localStorage para poder probar el formulario sin una base de datos.
 */

// 1. Guardamos los elementos que vamos a usar varias veces.
const formEl = document.getElementById("productForm");
const mainEl = document.getElementById("productosContainer");
const formErrorEl = document.getElementById("formError");
const cancelButtonEl = document.getElementById("btnCancel");
let cards = getLocalStorage("cards");

// Si localStorage no tiene una lista válida, comenzamos con una lista vacía.
if (!Array.isArray(cards)) {
    cards = [];
}

// 2. Tomamos las opciones del archivo json.js para no repetirlas a mano en el HTML.
const productsFromJSON = getProductOptions();

const cleanOptions = (values) => {
    const optionsWithoutDuplicates = new Map();

    values.forEach((value) => {
        const cleanValue = String(value ?? "").trim();
        const comparisonValue = cleanValue.toLocaleLowerCase("es-MX");

        if (cleanValue && !optionsWithoutDuplicates.has(comparisonValue)) {
            optionsWithoutDuplicates.set(comparisonValue, cleanValue);
        }
    });

    return [...optionsWithoutDuplicates.values()].sort((a, b) =>
        a.localeCompare(b, "es-MX")
    );
};

const dropdownFields = {
    Especie: {
        datalistId: "listaEspecies",
        options: ["Perro", "Gato"]
    },
    Categoria: {
        datalistId: "listaCategorias",
        options: cleanOptions(productsFromJSON.map((product) => product.Categoria))
    },
    Subcategoria: {
        datalistId: "listaSubcategorias",
        options: cleanOptions(productsFromJSON.map((product) => product.Subcategoria))
    },
    Tamano_Raza: {
        datalistId: "listaTamanos",
        options: cleanOptions(productsFromJSON.map((product) => product.Tamano_Raza))
    },
    Peso_Unidad: {
        datalistId: "listaUnidades",
        options: cleanOptions([
            ...productsFromJSON.map((product) => product.Peso_Unidad),
            "pieza",
            "piezas"
        ])
    }
};

// Cada datalist funciona como un dropdown y el navegador filtra al escribir.
Object.values(dropdownFields).forEach(({ datalistId, options }) => {
    const datalistEl = document.getElementById(datalistId);

    options.forEach((optionText) => {
        const optionEl = document.createElement("option");
        optionEl.value = optionText;
        datalistEl.appendChild(optionEl);
    });
});

// 3. Dejamos pasar solamente números en precio, stock y peso.
document.querySelectorAll(".campo-decimal").forEach((inputEl) => {
    inputEl.dataset.previousValue = "";

    inputEl.addEventListener("input", () => {
        if (/^\d*(\.\d{0,2})?$/.test(inputEl.value)) {
            inputEl.dataset.previousValue = inputEl.value;
        } else {
            inputEl.value = inputEl.dataset.previousValue;
        }
    });
});

document.querySelectorAll(".campo-entero").forEach((inputEl) => {
    inputEl.dataset.previousValue = "";

    inputEl.addEventListener("input", () => {
        if (/^\d*$/.test(inputEl.value)) {
            inputEl.dataset.previousValue = inputEl.value;
        } else {
            inputEl.value = inputEl.dataset.previousValue;
        }
    });
});

// 4. Revisamos que el valor escrito sí exista dentro de su dropdown.
const findOption = (value, options) => {
    const comparisonValue = value.trim().toLocaleLowerCase("es-MX");
    return options.find(
        (option) => option.toLocaleLowerCase("es-MX") === comparisonValue
    );
};

const validateDropdown = (fieldId) => {
    const inputEl = document.getElementById(fieldId);
    const validOption = findOption(inputEl.value, dropdownFields[fieldId].options);

    inputEl.setCustomValidity(validOption ? "" : "Selecciona una opción de la lista.");

    // También corregimos mayúsculas o espacios para guardar el mismo texto del JSON.
    if (validOption) {
        inputEl.value = validOption;
    }
};

Object.keys(dropdownFields).forEach((fieldId) => {
    const inputEl = document.getElementById(fieldId);
    inputEl.addEventListener("input", () => validateDropdown(fieldId));
    inputEl.addEventListener("change", () => validateDropdown(fieldId));
});

// 5. Aplicamos los rangos de los campos numéricos y evitamos IDs repetidos.
const validateNumbers = () => {
    const priceEl = document.getElementById("Precio_Base");
    const stockEl = document.getElementById("Stock");
    const weightEl = document.getElementById("Peso_Valor");
    const price = Number(priceEl.value);
    const stock = Number(stockEl.value);
    const weight = Number(weightEl.value);

    priceEl.setCustomValidity(
        priceEl.value !== "" && Number.isFinite(price) && price >= 0 ? "" : "Precio no válido."
    );
    stockEl.setCustomValidity(
        stockEl.value !== "" && Number.isInteger(stock) && stock >= 0 ? "" : "Stock no válido."
    );
    weightEl.setCustomValidity(
        weightEl.value !== "" && Number.isFinite(weight) && weight > 0 ? "" : "Peso no válido."
    );
};

const validateProductId = () => {
    const idEl = document.getElementById("ID");
    const allRegisteredProducts = [...productsFromJSON, ...cards];
    const repeatedId = allRegisteredProducts.some(
        (card) => String(card.ID ?? card.id).toLocaleLowerCase("es-MX") ===
            idEl.value.trim().toLocaleLowerCase("es-MX")
    );

    idEl.setCustomValidity(repeatedId ? "Ya existe un producto con este ID." : "");

    const feedbackEl = idEl.nextElementSibling;
    feedbackEl.textContent = repeatedId
        ? "Ya existe un producto con este ID."
        : "Escribe un ID usando letras, números, guion o guion bajo.";
};

document.getElementById("ID").addEventListener("input", validateProductId);
["Precio_Base", "Stock", "Peso_Valor"].forEach((fieldId) => {
    document.getElementById(fieldId).addEventListener("input", validateNumbers);
});

// Quitamos la marca roja de una casilla tan pronto como ya tenga un valor válido.
formEl.querySelectorAll("input, textarea, select").forEach((fieldEl) => {
    fieldEl.addEventListener("input", () => {
        if (fieldEl.checkValidity()) {
            fieldEl.classList.remove("is-invalid");
        }
    });
});

// 6. Validamos todo antes de guardar. Si algo falla, marcamos cada casilla incorrecta.
formEl.addEventListener("submit", (event) => {
    event.preventDefault();

    formEl.querySelectorAll("input:not([type='hidden']), textarea").forEach((fieldEl) => {
        fieldEl.value = fieldEl.value.trim();
    });

    Object.keys(dropdownFields).forEach(validateDropdown);
    validateNumbers();
    validateProductId();

    if (!formEl.checkValidity()) {
        formEl.classList.add("was-validated");
        formErrorEl.classList.remove("d-none");
        formErrorEl.focus();
        return;
    }

    formErrorEl.classList.add("d-none");

    // Conservamos los mismos nombres del JSON para que el catálogo pueda leerlos.
    const cardData = {
        ID: document.getElementById("ID").value,
        Nombre: document.getElementById("Nombre").value,
        Descripcion_Producto: document.getElementById("Descripcion_Producto").value,
        Especie: document.getElementById("Especie").value,
        Categoria: document.getElementById("Categoria").value,
        Subcategoria: document.getElementById("Subcategoria").value,
        Marca: document.getElementById("Marca").value,
        Etapa_Vida: document.getElementById("Etapa_Vida").value,
        Tamano_Raza: document.getElementById("Tamano_Raza").value,
        Precio_Base: Number(document.getElementById("Precio_Base").value),
        Stock: Number(document.getElementById("Stock").value),
        Peso_Valor: Number(document.getElementById("Peso_Valor").value),
        Peso_Unidad: document.getElementById("Peso_Unidad").value,
        Requiere_Receta: Number(document.getElementById("Requiere_Receta").value),
        Imagen_URL: document.getElementById("Imagen_URL").value,
        product_URL: document.getElementById("product_URL").value
    };

    cards.push(cardData);
    setLocalStorage("cards", cards);
    renderCards();
    resetForm();
});

// 7. Estas funciones se encargan de guardar y leer los productos locales.
function setLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : [];
    } catch (error) {
        console.error("No fue posible leer los productos guardados.", error);
        return [];
    }
}

// 8. Limpiamos el formulario y sus mensajes sin borrar los productos guardados.
function resetForm() {
    formEl.reset();
    formEl.classList.remove("was-validated");
    formErrorEl.classList.add("d-none");
    formEl.querySelectorAll("input, textarea, select").forEach((fieldEl) => {
        fieldEl.classList.remove("is-invalid");
        fieldEl.setCustomValidity("");

        if (fieldEl.matches(".campo-decimal, .campo-entero")) {
            fieldEl.dataset.previousValue = "";
        }
    });
}

cancelButtonEl.addEventListener("click", resetForm);

// 9. Mostramos una vista previa sencilla de lo que ya se registró.
const escapeHTML = (value) => {
    const temporaryEl = document.createElement("div");
    temporaryEl.textContent = String(value ?? "");
    return temporaryEl.innerHTML;
};

const renderCards = () => {
    mainEl.innerHTML = "";
    cards.forEach((product) => addProductCard(product, mainEl));
};

const addProductCard = (product, htmlElement) => {
    const productCard = `
        <div class="col-md-12 mb-3">
            <div class="card card-producto shadow-sm border">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <h5 class="card-title text-black">${escapeHTML(product.Nombre)}</h5>
                        <span class="badge bg-secondary">${escapeHTML(product.ID ?? product.id)}</span>
                    </div>
                    <h6 class="card-subtitle mb-2 text-muted">${escapeHTML(product.Marca)} | ${escapeHTML(product.Categoria)} &gt; ${escapeHTML(product.Subcategoria)}</h6>
                    <p class="card-text small mb-1">${escapeHTML(product.Descripcion_Producto)}</p>
                    <ul class="list-inline small text-muted mb-2">
                        <li class="list-inline-item"><strong>Precio:</strong> $${escapeHTML(product.Precio_Base)}</li>
                        <li class="list-inline-item"><strong>Stock:</strong> ${escapeHTML(product.Stock)}</li>
                        <li class="list-inline-item"><strong>Peso:</strong> ${escapeHTML(product.Peso_Valor)} ${escapeHTML(product.Peso_Unidad)}</li>
                        <li class="list-inline-item"><strong>Especie:</strong> ${escapeHTML(product.Especie)}</li>
                    </ul>
                </div>
            </div>
        </div>
    `;

    htmlElement.insertAdjacentHTML("beforeend", productCard);
};

renderCards();
