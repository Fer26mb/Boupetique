import { allProducts, renderizarProductos } from "../productos.js";


// Obtener filtros
const filterPerro = document.getElementById("filterPerro");
const filterGato = document.getElementById("filterGato");
const catAlimentos = document.getElementById("catCroquetas");
const catSnacks = document.getElementById("catSnacks");
const catCuidados = document.getElementById("catCuidados");
const btnClear = document.querySelector(".btn-clear-filters");
const catalogo = document.getElementById("catalogCard2");


// Función para aplicar filtros
function aplicarFiltros() {

    const productosFiltrados = allProducts.filter(producto => {

        //filtro de especie
        let especieCorrecta = true;
        if (filterPerro.checked || filterGato.checked) {
            especieCorrecta = (filterPerro.checked && producto.Especie === "Perro") || (filterGato.checked && producto.Especie === "Gato");
        }
        //filtro de categoria
        let categoriaCorrecta = true;
        if (catAlimentos.checked || catSnacks.checked || catCuidados.checked) {
            categoriaCorrecta = (catAlimentos.checked && producto.Categoria === "Alimentos") || (catSnacks.checked && producto.Categoria === "Snacks") || (catCuidados.checked && producto.Categoria === "Salud & Bienestar");
        }
        return especieCorrecta && categoriaCorrecta;
    });

    // Limpiar catalogo
    catalogo.innerHTML = "";


    // Mostrar productos filtrados
    productosFiltrados.forEach(producto => {
        renderizarProductos(producto);
    });
}

// Escuchar cambios en los filtros
document.querySelectorAll("aside input[type='checkbox']").forEach(input => {
    input.addEventListener("change", aplicarFiltros);
});

// Eliminar todos
btnClear.addEventListener("click", () => {
    filterPerro.checked = false;
    filterGato.checked = false;
    catAlimentos.checked = false;
    catSnacks.checked = false;
    catCuidados.checked = false;
    aplicarFiltros();
});

// Botones perro y gato (pág. Próximamente)
// Detectar especie seleccionada desde la URL
const parametros = new URLSearchParams(window.location.search);
const especieSeleccionada = parametros.get("especie");

if (especieSeleccionada === "Perro") {
    filterPerro.checked = true;
    filterGato.checked = false;
    aplicarFiltros();
}

if (especieSeleccionada === "Gato") {
    filterPerro.checked = false;
    filterGato.checked = true;
    aplicarFiltros();
}