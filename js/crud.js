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
const productsFromJSON = getProductOptions();
let cards = getLocalStorage("cards");

// Si localStorage no tiene una lista válida, comenzamos con una lista vacía.
if (!Array.isArray(cards)) {
    cards = [];
} else {
    const highestStaticId = Math.max(0, ...productsFromJSON.map((product) => product.id));
    const reservedStoredIds = cards
        .filter((product) => product.sku != null)
        .map((product) => Number(product.id))
        .filter((id) => Number.isSafeInteger(id) && id > highestStaticId);
    let nextId = Math.max(highestStaticId, ...reservedStoredIds) + 1;
    const usedIds = new Set(productsFromJSON.map((product) => product.id));

    cards = cards.map((product) => {
        const { id: storedId, ...productData } = product;
        const sku = product.sku ?? storedId;
        const existingId = product.sku != null ? Number(storedId) : NaN;

        if (Number.isSafeInteger(existingId) && existingId > highestStaticId && !usedIds.has(existingId)) {
            usedIds.add(existingId);
            return { ...productData, sku, id: existingId };
        }

        while (usedIds.has(nextId)) {
            nextId += 1;
        }

        const id = nextId;
        nextId += 1;
        usedIds.add(id);
        return { ...productData, sku, id };
    });
}

// 2. Tomamos las opciones del archivo json.js para no repetirlas a mano en el HTML.

//Sinonimos

const sinonimosEspecies = {
    "Perro": ["perro", "perro "],
    "Gato": ["gato", "gato ", "gatos"],
    "Perro y Gato": ["perro & gato", "perro y gato", "perro & gato "]
};

const sinonimosCategorias = {
    "Alimentos": ["alimentos", "alimento", "alimento ", "alimento  "],
    "Higiene": ["higiene", "higiene "],
    "Accesorios": ["accesorios", "accesorio", "accesorio "],
    "Juguetes": ["juguetes", "juguete"],
    "Bienestar": ["bienestar", "bienestar "]
};

const sinonimosSubcategorias = {
    "Alimento Seco": ["alimento seco", "seco", " seco ", "alimento  seco", "alimento especializado", "alimento  especializado", "croquetas", "alimento"],
    "Suplementos": ["suplemento", "suplementos", "premio", "premios", "golosina"],
    "Shampoo y Aseo": ["shampoo / limpieza", "shampoo y limpieza", "limpieza", "shampoo", "champú", "baño"],
    "Higiene del Hogar": ["higiene/sanitario", "higiene y sanitario", "sanitario", "arenero", "desinfectante", "limpiador"],
    "Camas y Descanso": ["camas y descanso", "cama y descanso", "cama", "colchón", "cojín"],
    "Juguetes": ["caucho interactivo", "estimulación", "estimulacion", "juguete", "juguetes", "mordedor", "pelota"],
    "Accesorios": ["correa", "correas", "collar", "collares", "bowls", "bowl", "plato", "platos", "comederos", "arnés", "arnes"],
    "Bienestar": ["difusor ambiental", "difusor  ambiental", "feromonas", "calmante", "anti-estrés", "antiestrés"]
};

const sinonimosEtapaVida = {
    "Todas las edades": ["todas las edades", "todas las etapas", "totas las etapas", "todas las edades ", "todas"],
    "Cachorro": ["cachorro", "kitten", "6 meses +", "6 meses+", "cachorro ", "kitten "],
    "Adulto": ["adulto", "adulto/cachorro", "adulto ", "adulto  "],
    "Senior": ["senior", "senior ", "adulto mayor"],
    "Adulto / Senior": ["adulto / senior", "adulto / senior (7+)", "adulto/senior"]
};

const sinonimosUnidades = {
    "g": ["g", "gr", "gramo", "gramos"],
    "kg": ["kg", "kilo", "kilos", "kilogramo", "kilogramos"],
    "ml": ["ml", "mililitro", "mililitros"],
    "pza": ["pza", "pzas", "pieza", "piezas", "unidad", "unidades"]
};

const sinonimosTamano = {
    "Todas las razas": ["todas las razas", "todas", "todas las razas ", " todas las razas"],
    "Pequeña": ["pequeña", "pequeñas", "razas pequeñas y mini", "pequeña "],
    "Mediana": ["mediana", "raza mediana", "raza mediana "],
    "Grande": ["grande", "razas grandes", "raza mediana / grande", "mediana / grande", "grande "]
};

//Funciones normalización

const normalizarValor = (valor, sinonimos) => {
    if (!valor) return valor;
    const valorLower = String(valor).trim().toLocaleLowerCase("es-MX");
    
    for (const [valorEstandar, variantes] of Object.entries(sinonimos)) {
        if (variantes.some(v => valorLower === v.toLocaleLowerCase("es-MX"))) {
            return valorEstandar;
        }
    }
    return valor.trim();
};

const cleanOptions = (values, sinonimos = null) => {
    const optionsWithoutDuplicates = new Map();

    values.forEach((value) => {
        let cleanValue = String(value ?? "").trim();
        
        if (sinonimos) {
            cleanValue = normalizarValor(cleanValue, sinonimos);
        }
        
        const comparisonValue = cleanValue.toLocaleLowerCase("es-MX");

        if (cleanValue && !optionsWithoutDuplicates.has(comparisonValue)) {
            optionsWithoutDuplicates.set(comparisonValue, cleanValue);
        }
    });

    return [...optionsWithoutDuplicates.values()].sort((a, b) =>
        a.localeCompare(b, "es-MX")
    );
};

// SKU

const dropdownFields = {
    Especie: {
        datalistId: "listaEspecies",
        options: cleanOptions(["Perro", "Gato", "Perro & Gato"], sinonimosEspecies),
        sinonimos: sinonimosEspecies
    },
    Categoria: {
        datalistId: "listaCategorias",
        options: cleanOptions(productsFromJSON.map((product) => product.Categoria), sinonimosCategorias),
        sinonimos: sinonimosCategorias
    },
    Subcategoria: {
        datalistId: "listaSubcategorias",
        options: cleanOptions(productsFromJSON.map((product) => product.Subcategoria), sinonimosSubcategorias),
        sinonimos: sinonimosSubcategorias
    },
    Etapa_Vida: {
        datalistId: "listaEtapas",
        options: cleanOptions(productsFromJSON.map((product) => product.Etapa_Vida), sinonimosEtapaVida),
        sinonimos: sinonimosEtapaVida
    },
    Tamano_Raza: {
        datalistId: "listaTamanos", // ✅ Corregido
        options: cleanOptions(productsFromJSON.map((product) => product.Tamano_Raza), sinonimosTamano),
        sinonimos: sinonimosTamano
    },
    Peso_Unidad: {
        datalistId: "listaUnidades", // ✅ Corregido
        options: cleanOptions([
            ...productsFromJSON.map((product) => product.Peso_Unidad),
            "pieza",
            "piezas"
        ], sinonimosUnidades),
        sinonimos: sinonimosUnidades
    }
};

//DATALISTS

Object.values(dropdownFields).forEach(({ datalistId, options }) => {
    const datalistEl = document.getElementById(datalistId);

    if (!datalistEl) {
        console.warn(`⚠️ No se encontró el elemento con ID: ${datalistId}`);
        return;
    }

    options.forEach((optionText) => {
        const optionEl = document.createElement("option");
        optionEl.value = optionText;
        optionEl.textContent = optionText;
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
    if (!inputEl) return;
    
    const validOption = findOption(inputEl.value, dropdownFields[fieldId].options);

    inputEl.setCustomValidity(validOption ? "" : "Selecciona una opción de la lista.");

    if (validOption) {
        inputEl.value = validOption;
    }
};

Object.keys(dropdownFields).forEach((fieldId) => {
    const inputEl = document.getElementById(fieldId);
    if (inputEl) {
        inputEl.addEventListener("input", () => validateDropdown(fieldId));
        inputEl.addEventListener("change", () => validateDropdown(fieldId));
    }
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

const validateProductSku = () => {
    const skuEl = document.getElementById("sku");
    const allRegisteredProducts = [...productsFromJSON, ...cards];
    const repeatedSku = allRegisteredProducts.some(
        (card) => String(card.sku).toLocaleLowerCase("es-MX") ===
            skuEl.value.trim().toLocaleLowerCase("es-MX")
    );

    skuEl.setCustomValidity(repeatedSku ? "Ya existe un producto con este SKU." : "");

    const feedbackEl = skuEl.nextElementSibling;
    feedbackEl.textContent = repeatedSku
        ? "Ya existe un producto con este SKU."
        : "Escribe un SKU usando letras, números, guion o guion bajo.";
};

const getNextProductId = () => {
    const ids = [...productsFromJSON, ...cards]
        .map((product) => Number(product.id))
        .filter((id) => Number.isSafeInteger(id) && id >= 0);
    return Math.max(0, ...ids) + 1;
};

const updateNextProductId = () => {
    document.getElementById("id").value = getNextProductId();
};

updateNextProductId();

document.getElementById("sku").addEventListener("input", validateProductSku);
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
    validateProductSku();

    if (!formEl.checkValidity()) {
        formEl.classList.add("was-validated");
        formErrorEl.classList.remove("d-none");
        formErrorEl.focus();
        return;
    }

    formErrorEl.classList.add("d-none");
    const id = getNextProductId();

    const cardData = {
        id,
        sku: document.getElementById("sku").value,
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
        Imagen_URL: document.getElementById("Imagen_URL").value
    };

    cards.push(cardData);
    setLocalStorage("cards", cards);
    renderCards();

    const modalElement = document.getElementById("successModal");
    if (modalElement && typeof bootstrap !== "undefined") {
        const bootstrapModal = bootstrap.Modal.getOrCreateInstance(modalElement);
        bootstrapModal.show();
    }
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
    updateNextProductId();
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
                        <span class="badge bg-secondary">ID ${escapeHTML(product.id)} | SKU ${escapeHTML(product.sku)}</span>
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

