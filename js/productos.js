// 0. importamos los productos del json
import { getAllProducts } from "./json.js";

// 1. Obtener los productos estáticos del JSON
const productsFromJSON = await getAllProducts();

// 2. Obtener los productos dinámicos del LocalStorage (creados desde el CRUD) [new]
const getLocalStorageProducts = () => {
    const stored = localStorage.getItem("cards");
    return stored ? JSON.parse(stored) : [];  //operador ternario
};
// 2.5 obtenemos los productos del local storage [new]
const productsFromStorage = getLocalStorageProducts();

// 3. Unir ambos arrays en una sola lista [new]
/**(...) Es un operador de propagación (o Spread Operator en inglés). Su función principal es "desempaquetar" o descomponer los elementos de un array (o las propiedades de un objeto) dentro de otro. para fusionar arrays de forma limpia y plana, sin crear arrays dentro de arrays sin romper el cliclo for o map */
const allProducts = [...productsFromJSON, ...productsFromStorage];

// 3.5 Ubicacion donde se inyecta el js con la card dinamica
const cards = document.querySelector("#catalogCard2");
const modal = document.querySelector("#modal-info");
const contentDiv = modal.querySelector(".content");



// 4. Función para renderizar la card usando la plantilla nativa de tu catálogo
const renderizarProductos = (producto) => {
    // 4.3 Si el producto registrado no tiene imagen, colocamos una por defecto
    const imagenUrl = producto.Imagen_URL || "../assets/productos-img/default.jpeg";
    const pesoValor = producto.Peso_Valor || "0.0";
    const pesoUnidad = producto.Peso_Unidad || "?";
    //4.5
    const productCard = `
    <div class="col-12 col-sm-6 col-md-4 col-xl-3">
        <div class="catalog-card text-center">
            <div>
                <span class="brand-subtext">Boupetique Selection</span>
                
                <div class="catalog-img-box info-modal-trigger" data-id="${producto.id}" role="button">
                    <img src="${imagenUrl}" class="catalog-img" alt="${producto.Nombre}">
                </div>

                <p class="catalog-title">${producto.Nombre} ${pesoValor}${pesoUnidad}</p>
            </div>

            <div>
                <div class="price-box">
                    <span class="price-current">$${producto.Precio_Base}</span>
                </div>

                <button class="btn-catalog-select info-modal-trigger" data-id="${producto.id}">
                    Seleccionar opciones ${producto.id}
                </button>
            </div>
        </div>
    </div>
    `;

    // Usamos "Afterend" para que se inyecten una a lado de otra
    cards.insertAdjacentHTML("beforeend", productCard);
};

// 5. Limpiamos el contenedor y mapeamos la lista unificada
cards.innerHTML = "";
allProducts.forEach((product) => renderizarProductos(product));

cards.addEventListener("click", (e) => {
    // target.closest busca en el DOM la clase indicada
    const trigger = e.target.closest(".info-modal-trigger");

    // Si el clic fue en un lugar vacío de la tarjeta, lo ignora
    if (!trigger) return;

    // Prevenir cierre y obtener el ID
    e.preventDefault();
    const productId = trigger.dataset.id;
    
    console.log(productId);
    
    //logica del modal
    showInfo(allProducts[productId-1]);

});


const showInfo = function (product) {
    contentDiv.innerHTML = "";
    const modalHTML = `
    <div class="modal fade" id="modalProducto" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content border-0 rounded-5 p-4 bg-white shadow-lg">
                <button type="button" class="btn-close ms-auto" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                <div class="modal-body">
                    <div class="row align-items-center g-4">
                        <div class="col-12 col-md-6 text-center">
                            <img src="${product.Imagen_URL}" class="img-fluid drop-shadow-modal" alt="Producto ${product.id}">
                        </div>
                        <div class="col-12 col-md-6">
                            <span class="micro-category">${product.Categoria}</span>
                            <h2 class="fw-bold text-dark mt-1 mb-2">${product.Nombre}</h2>
                            <p class="text-muted small">${product.Descripcion_Producto}</p>

                            <div class="my-3">
                                <span class="fs-3 fw-bold text-dark">$${product.Precio_Base}</span>
                                <span class="text-muted text-decoration-line-through ms-2">$1000.00</span> 
                            </div>

                            <button class="btn btn-dark w-100 rounded-pill py-3 fw-semibold">
                                Añadir a la bolsa
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    contentDiv.innerHTML = modalHTML;

    //Creacion de instancia del modal
    const modalElement = document.getElementById("modalProducto");
    const bootstrapModal = new bootstrap.Modal(modalElement);
    bootstrapModal.show();
};

/* ---------------------------------------
//Productos.js de ANDRES sin modificar

import {getAllProducts} from "./json.js";  //0
const products = await getAllProducts();  //1 mod

const cards = document.querySelector("#catalogCard2"); //3.5

//4
const renderizarProductos = ({Nombre,Imagen_URL,Precio_Base,Peso_Valor,Peso_Unidad}) => {
    //4..5
	const productCard = ` 
    <div class="col-12 col-sm-6 col-md-4 col-xl-3">
        <div class="catalog-card text-center">
            <div>
                <span class="brand-subtext">Boupetique Selection</span>
                
                <div class="catalog-img-box" data-bs-toggle="modal" data-bs-target="#modalProducto1">
                    <img src="${Imagen_URL}" 
                            class="catalog-img" alt="Alimento">
                </div>

                <p class="catalog-title">${Nombre}${Peso_Valor}${Peso_Unidad}</p>
            </div>

            <div>
                <div class="price-box">
                    <span class="price-current">$${Precio_Base}</span>
                </div>

                <button class="btn-catalog-select" data-bs-toggle="modal" data-bs-target="#modalProducto1">
                    Seleccionar opciones
                </button>
            </div>
        </div>
    </div>
    `;
    cards.insertAdjacentHTML("afterend", productCard);
}
//5
products.map((product) => renderizarProductos(product))

*/
