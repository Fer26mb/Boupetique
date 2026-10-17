import { allProducts, renderizarProductos } from "../productos.js";


// Obtener filtros
const filterPerro = document.getElementById("filterPerro");
const filterGato = document.getElementById("filterGato");
const categoryFilters = document.getElementById("categoryFilters");
const btnClear = document.querySelector(".btn-clear-filters");
const catalogo = document.getElementById("catalogCard2");
const filtrosAside = document.querySelector("aside");
const searchInput = document.getElementById("searchInput");
const activeFilters = document.getElementById("activeFilters");
const catalogTitle = document.getElementById("catalogTitle");
const catalogSummary = document.getElementById("catalogSummary");

const PROMOS = {
    halloween: {
        filtros: { q: "halloween" },
        titulo: "Juguetes de Halloween",
        subtitulo: "Diversión de miedo para tu mascota esta temporada."
    },
    disfraces: {
        filtros: { subcategoria: "Accesorios" },
        titulo: "Disfraces y accesorios",
        subtitulo: "Muy pronto más disfraces; mientras, arma su look con estos accesorios."
    },
    descuentos: {
        filtros: { marca: "Churu" },
        titulo: "Descuentos de miedo",
        subtitulo: "Los premios Churu favoritos de perros y gatos."
    },
    nuevos: {
        filtros: { nuevos: "1" },
        titulo: "Nuevos productos",
        subtitulo: "Lo más reciente que llegó a Boupetique."
    },
    ofertas: {
        filtros: { marca: "Royal Canin" },
        titulo: "Ofertas del mes",
        subtitulo: "Nutrición especializada Royal Canin para perros y gatos."
    }
};

const ETIQUETAS = { q: "Búsqueda", marca: "Marca", subcategoria: "Subcategoría", nuevos: "Nuevos" };

const parametros = new URLSearchParams(window.location.search);
let promoActiva = PROMOS[parametros.get("promo")] ? parametros.get("promo") : null;
const filtros = { q: "", marca: "", subcategoria: "", nuevos: "", ...(promoActiva ? PROMOS[promoActiva].filtros : {}) };
Object.keys(ETIQUETAS).forEach((clave) => {
    if (parametros.get(clave)) filtros[clave] = parametros.get(clave);
});

const normalizar = (texto) => String(texto ?? "")
    .toLocaleLowerCase("es-MX")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();


async function cargarCategorias() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        const categorias = await response.json();

        categoryFilters.innerHTML = categorias.map((categoria) => `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="cat-${categoria.id}" value="${categoria.categoryName}">
                <label class="form-check-label d-flex justify-content-between" for="cat-${categoria.id}">
                    <span>${categoria.categoryName}</span> <span class="text-muted"></span>
                </label>
            </div>
        `).join("");
    } catch (error) {
        console.error("No se pudieron cargar las categorias.", error);
    }
}

const especiesMarcadas = () => [filterPerro.checked && "Perro", filterGato.checked && "Gato"].filter(Boolean);
const categoriasMarcadas = () => [...categoryFilters.querySelectorAll("input:checked")].map((input) => input.value);


// Función para aplicar filtros
function aplicarFiltros() {

    const especies = especiesMarcadas();
    const categorias = categoriasMarcadas();
    const busqueda = normalizar(filtros.q);

    let productosFiltrados = allProducts.filter(producto => {

        //filtro de especie
        const especieCorrecta = especies.length === 0
            || especies.some((especie) => producto.Especie === especie || producto.Especie === "Perro y Gato");

        //filtro de categoria
        const categoriaCorrecta = categorias.length === 0 || categorias.includes(producto.Categoria);

        const marcaCorrecta = !filtros.marca || normalizar(producto.Marca) === normalizar(filtros.marca);
        const subcategoriaCorrecta = !filtros.subcategoria || normalizar(producto.Subcategoria) === normalizar(filtros.subcategoria);
        const busquedaCorrecta = !busqueda || [producto.Nombre, producto.Descripcion_Producto, producto.Marca, producto.Subcategoria, producto.Categoria]
            .some((campo) => normalizar(campo).includes(busqueda));

        return especieCorrecta && categoriaCorrecta && marcaCorrecta && subcategoriaCorrecta && busquedaCorrecta;
    });

    if (filtros.nuevos) {
        productosFiltrados = [...productosFiltrados].sort((a, b) => Number(b.sku) - Number(a.sku)).slice(0, 12);
    }

    // Limpiar catalogo
    catalogo.innerHTML = "";


    // Mostrar productos filtrados
    productosFiltrados.forEach(producto => {
        renderizarProductos(producto);
    });

    if (productosFiltrados.length === 0) {
        catalogo.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="fs-5 text-muted">No encontramos productos con esos filtros.</p>
                <button type="button" class="btn btn-boupetique" id="btnVerTodo">Ver todos los productos</button>
            </div>
        `;
    }

    actualizarEncabezado(productosFiltrados.length);
    renderizarEtiquetas(especies, categorias);
    actualizarURL(especies, categorias);
}

function actualizarEncabezado(total) {
    const promo = promoActiva ? PROMOS[promoActiva] : null;
    catalogTitle.textContent = promo
        ? promo.titulo
        : filtros.q ? `Resultados para “${filtros.q}”` : "Todos los productos";
    const conteo = `${total} producto${total === 1 ? "" : "s"}`;
    catalogSummary.textContent = promo ? `${promo.subtitulo} · ${conteo}` : conteo;
}

function renderizarEtiquetas(especies, categorias) {
    const etiquetas = [
        ...especies.map((especie) => ({ tipo: "especie", valor: especie, texto: especie })),
        ...categorias.map((categoria) => ({ tipo: "categoria", valor: categoria, texto: categoria })),
        ...Object.keys(ETIQUETAS)
            .filter((clave) => filtros[clave])
            .map((clave) => ({
                tipo: clave,
                valor: filtros[clave],
                texto: clave === "nuevos" ? "Lo más nuevo" : `${ETIQUETAS[clave]}: ${filtros[clave]}`
            }))
    ];

    activeFilters.innerHTML = etiquetas.map((etiqueta) => `
        <button type="button" class="active-filter-tag" data-tipo="${etiqueta.tipo}" data-valor="${etiqueta.valor}">
            ${etiqueta.texto} <i class="fa-solid fa-xmark ms-1"></i>
        </button>
    `).join("");
}

function actualizarURL(especies, categorias) {
    const nuevos = new URLSearchParams();
    if (promoActiva) {
        nuevos.set("promo", promoActiva);
    } else {
        Object.keys(ETIQUETAS).forEach((clave) => {
            if (filtros[clave]) nuevos.set(clave, filtros[clave]);
        });
    }
    especies.forEach((especie) => nuevos.append("especie", especie));
    categorias.forEach((categoria) => nuevos.append("categoria", categoria));

    const query = nuevos.toString();
    history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
}

function limpiarTodo() {
    filtrosAside.querySelectorAll("input[type='checkbox']").forEach((input) => {
        input.checked = false;
    });
    Object.keys(filtros).forEach((clave) => {
        filtros[clave] = "";
    });
    promoActiva = null;
    searchInput.value = "";
    aplicarFiltros();
}

await cargarCategorias();

parametros.getAll("especie").forEach((especie) => {
    if (especie === "Perro") filterPerro.checked = true;
    if (especie === "Gato") filterGato.checked = true;
});
parametros.getAll("categoria").forEach((categoria) => {
    const input = [...categoryFilters.querySelectorAll("input")].find((item) => normalizar(item.value) === normalizar(categoria));
    if (input) input.checked = true;
});
searchInput.value = filtros.q;

// Escuchar cambios en los filtros
filtrosAside.addEventListener("change", (e) => {
    if (e.target.matches("input[type='checkbox']")) aplicarFiltros();
});

let temporizadorBusqueda;
searchInput.addEventListener("input", () => {
    clearTimeout(temporizadorBusqueda);
    temporizadorBusqueda = setTimeout(() => {
        filtros.q = searchInput.value.trim();
        promoActiva = null;
        aplicarFiltros();
    }, 250);
});

activeFilters.addEventListener("click", (e) => {
    const etiqueta = e.target.closest(".active-filter-tag");
    if (!etiqueta) return;
    const { tipo, valor } = etiqueta.dataset;

    if (tipo === "especie") {
        (valor === "Perro" ? filterPerro : filterGato).checked = false;
    } else if (tipo === "categoria") {
        const input = [...categoryFilters.querySelectorAll("input")].find((item) => item.value === valor);
        if (input) input.checked = false;
    } else {
        filtros[tipo] = "";
        if (tipo === "q") searchInput.value = "";
        if (promoActiva && PROMOS[promoActiva].filtros[tipo]) promoActiva = null;
    }
    aplicarFiltros();
});

catalogo.addEventListener("click", (e) => {
    if (e.target.closest("#btnVerTodo")) limpiarTodo();
});

btnClear.addEventListener("click", limpiarTodo);

aplicarFiltros();
