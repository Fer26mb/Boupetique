// mis-favoritos.js
import { getAllProducts } from "./json.js";

const skusFavoritos = ["1", "2", "7", "4"];

export const getFavoritos = async () => {
    const productos = await getAllProducts();
    return skusFavoritos
        .map((sku) => productos.find((producto) => producto.sku === sku))
        .filter(Boolean);
};
