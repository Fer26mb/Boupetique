/**
 * Backend local (localStorage) para registro y lectura de productos
 */

// 1. Selección de elementos (Asegurando coincidencia exacta de IDs con el HTML)
const formEl = document.getElementById("productForm"); 
const mainEl = document.querySelector("#productosContainer");
let cards = [];

/**
 * Evento de Carga Inicial
 */
window.addEventListener("load", () => {
    const storedCards = getLocalStorage("cards");

    // Si existen productos guardados, inicializamos el array y los mostramos
    if (storedCards && Array.isArray(storedCards)) {
        cards = storedCards;
        renderCards();
    } else {
        console.log("No hay Productos almacenados en el localStorage");
    }
});

/**
 * Evento Submit del Formulario
 */
formEl.addEventListener("submit", (event) => {
    event.preventDefault();

    // Extraer valores de los inputs usando sus IDs
    const cardData = {
        ID: document.getElementById("ID").value,
        Nombre: document.getElementById("Nombre").value,
        Descripcion_Producto: document.getElementById("Descripcion_Producto").value,
        Especie: document.getElementById("Especie").value,
        Categoria: document.getElementById("Categoria").value,
        Subcategoria: document.getElementById("Subcategoria").value,
        Marca: document.getElementById("Marca").value,
        Precio_Base: document.getElementById("Precio_Base").value,
        Stock: document.getElementById("Stock").value,
        Peso_Valor: document.getElementById("Peso_Valor").value,
        Peso_Unidad: document.getElementById("Peso_Unidad").value
    };

    // Guardar en array y sincronizar con localStorage
    cards.push(cardData);
    setLocalStorage("cards", cards);

    // Re-renderizar la vista y limpiar campos
    renderCards();
    formEl.reset();
});

/**
 * Funciones Auxiliares para LocalStorage
 */
const setLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

const getLocalStorage = (key) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : undefined;
};

/**
 * Renderizado de Cards en el DOM
 */
const renderCards = () => {
    mainEl.innerHTML = ""; // Limpiar contenedor
    cards.forEach((producto) => addRegistroCard(producto, mainEl));
};

const addRegistroCard = (productoDataObject, htmlElement) => {
    const registroCard = `
        <div class="col-md-12 mb-3">
            <div class="card card-producto shadow-sm border">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <h5 class="card-title text-black">${productoDataObject.Nombre}</h5>
                        <span class="badge bg-secondary">${productoDataObject.ID}</span>
                    </div>
                    <h6 class="card-subtitle mb-2 text-muted">${productoDataObject.Marca} | ${productoDataObject.Categoria} > ${productoDataObject.Subcategoria}</h6>
                    <p class="card-text small mb-1">${productoDataObject.Descripcion_Producto}</p>
                    <ul class="list-inline small text-muted mb-2">
                        <li class="list-inline-item"><strong>Precio:</strong> $${productoDataObject.Precio_Base}</li>
                        <li class="list-inline-item"><strong>Stock:</strong> ${productoDataObject.Stock}</li>
                        <li class="list-inline-item"><strong>Peso:</strong> ${productoDataObject.Peso_Valor} ${productoDataObject.Peso_Unidad}</li>
                        <li class="list-inline-item"><strong>Especie:</strong> ${productoDataObject.Especie}</li>
                    </ul>
                </div>
            </div>
        </div>
    `;

    htmlElement.insertAdjacentHTML("beforeend", registroCard);
};