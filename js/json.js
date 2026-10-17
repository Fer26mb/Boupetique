const resolveImage = (url) => url?.startsWith("/")
    ? new URL(`..${url}`, import.meta.url).href
    : url;

export const mapProduct = (product) => ({
    id: product.productId,
    sku: product.sku,
    Nombre: product.title,
    Descripcion_Producto: product.description,
    Especie: product.species,
    Categoria: product.categoryId?.categoryName,
    Subcategoria: product.subcategory,
    Marca: product.brandId?.brandName,
    Etapa_Vida: product.lifeStage,
    Tamano_Raza: product.breedSize,
    Precio_Base: Number(product.price),
    Stock: product.stock,
    Peso_Valor: Number(product.weight),
    Peso_Unidad: product.unit,
    Requiere_Receta: product.prescription ? 1 : 0,
    Imagen_URL: resolveImage(product.urlImg)
});

export async function getAllProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const products = await response.json();
        return products.map(mapProduct);
    } catch (error) {
        console.error("No se pudieron cargar los productos.", error);
        return [];
    }
}

export async function getProductOptions() {
    return getAllProducts();
}
