import { getAllProducts } from "./json.js";
import { contarProductosAgregados } from "./productos/counterProducts.js";

export const allProducts = await getAllProducts();

// 3.5 Ubicacion donde se inyecta el js con la card dinamica
const cards = document.querySelector("#catalogCard2");
const modal = document.querySelector("#modal-info");
const contentDiv = modal.querySelector(".content");



// 4. Función para renderizar la card usando la plantilla nativa de tu catálogo
export const renderizarProductos = (producto) => {
    //const renderizarProductos = (producto) => {
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
                
                <div class="catalog-img-box info-modal-trigger" data-sku="${producto.sku}" role="button">
                    <img src="${imagenUrl}" class="catalog-img" alt="${producto.Nombre}">
                </div>

                <p class="catalog-title">${producto.Nombre} ${pesoValor}${pesoUnidad}</p>
            </div>

            <div>
                <div class="price-box">
                    <span class="price-current">$${producto.Precio_Base}</span>
                </div>

                <button class="btn-catalog-select info-modal-trigger" data-sku="${producto.sku}">
                    Ver para agregar al carrito
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

if (allProducts.length === 0) {
    cards.innerHTML = '<p class="text-center text-muted py-5">No se pudieron cargar los productos.</p>';
}

cards.addEventListener("click", (e) => {
    // target.closest busca en el DOM la clase indicada
    const trigger = e.target.closest(".info-modal-trigger");

    // Si el clic fue en un lugar vacío de la tarjeta, lo ignora
    if (!trigger) return;

    // Prevenir cierre y obtener el SKU
    e.preventDefault();
    const productSku = trigger.dataset.sku;
    const product = allProducts.find(
        (item) => String(item.sku) === productSku
    );

    if (!product) {
        console.error(`No se encontró el producto con SKU "${productSku}".`);
        return;
    }

    showInfo(product);

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
                            <img src="${product.Imagen_URL}" class="img-fluid drop-shadow-modal" alt="Producto ${product.sku}">
                        </div>
                        <div class="col-12 col-md-6">
                            <span class="micro-category">${product.Categoria}</span>
                            <h2 class="fw-bold text-dark mt-1 mb-2">${product.Nombre}</h2>
                            <p class="text-muted small">${product.Descripcion_Producto}</p>

                            <div class="my-3">
                                <span class="fs-3 fw-bold text-dark">$${product.Precio_Base}</span>
                            </div>

                            <button id="btnAddToCart" class="btn btn-dark w-100 rounded-pill py-3 fw-semibold" data-id="${product.id}">
                                Añadir al carrito
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

    // Captura del clic en el botón "Añadir al carrito"
    const btnAddToCart = document.getElementById("btnAddToCart");
    btnAddToCart.addEventListener("click", () => {
        // const producto = product;
        // console.log("ID del producto añadido al carrito:", producto);
        addToCart(product);
        // Cierra el modal y quita el foco del botón
        btnAddToCart.blur();
        // Oculta el modal de Bootstrap
        bootstrapModal.hide();
    });
};

let cart = leerCarrito();

//Toast para mostrar cuando se agreguen productos al carrito
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    customClass: {
        popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 3000,
});

function addToCart(product) {
    cart = leerCarrito();
    // Verificar si el producto ya existe en el carrito
    const productId = product.id || product.sku;
    const existingProductIndex = cart.findIndex(
        (item) => (item.id || item.sku) === productId
    );

    if (existingProductIndex !== -1) {
        // Si ya existe, incrementamos la cantidad
        cart[existingProductIndex].quantity += 1;
    } else {
        // Si es un producto nuevo, lo agregamos con cantidad inicial = 1
        cart.push({
            ...product,
            quantity: 1
        });
    }

    // Guardar el estado actualizado en localStorage
    saveCartToLocalStorage();

    //Muestro la alerta en pantalla
    Toast.fire({
        iconHtml: '<img src="https://www.gifsanimados.org/data/media/218/pinguino-imagen-animada-0082.gif" style="width: 40px; height: 40px; border: none;" alt="pinguino" />',
        title: 'Producto agregado al carrito',
        customClass: {
            icon: 'border-0' // Quito los bordes circulares por defecto del icono de SweetAlert 
        }
    });
}

function saveCartToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
    contarProductosAgregados();
}

const skuSolicitado = new URLSearchParams(window.location.search).get("sku");
const productoSolicitado = allProducts.find((item) => String(item.sku) === skuSolicitado);
if (productoSolicitado) showInfo(productoSolicitado);
