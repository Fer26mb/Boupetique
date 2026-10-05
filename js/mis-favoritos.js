// mis-favoritos.js
const favoritosData = [
    {
        sku: "1",
        Nombre: "Open Farm Grain-Free Dry Dog Food",
        Descripcion_Producto: "Alimento seco para perros sin cereales, diseñado para ofrecer una nutrición completa y equilibrada a partir de proteínas de origen ético.",
        Categoria: "Alimentos",
        Precio_Base: 650.28,
        Imagen_URL: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSKLNItS0THGAYp_jniqS5gsVP7ACnwBEp4IDM7P3m8POIJfFNC5cxMYzCMw48zbAABI7dKgwuvt-Xh3vK7xRhCfGb-rDDyJA"
    },
    {
        sku: "2",
        Nombre: "Pet Magic Shampoo Blueberry",
        Descripcion_Producto: "Champú orgánico certificado y no tóxico para mascotas, formulado especialmente con un suave aroma a arándano.",
        Categoria: "Higiene",
        Precio_Base: 346.70,
        Imagen_URL: "https://liveinthelight.co.uk/cdn/shop/files/Pet-Magic-Shampoo-by-Vermont-Soap_2_580x@2x.jpg?v=1778675960"
    },
    {
        sku: "7",
        Nombre: "Mueble rascador para gato",
        Descripcion_Producto: "Rascador multifuncional tipo árbol con 3 plataformas, 2 cuevas acogedoras y rampa de acceso.",
        Categoria: "Accesorios",
        Precio_Base: 1299.00,
        Imagen_URL: "https://sp345.liverpool.com.mx/i/1184392042_4p.jpg"
    },
    {
        sku: "4",
        Nombre: "Juguete Kong Llanta (Traxx)",
        Descripcion_Producto: "Juguete resistente de caucho natural diseñado para satisfacer el impulso de masticación de los perros.",
        Categoria: "Juguetes",
        Precio_Base: 425.00,
        Imagen_URL: "https://m.media-amazon.com/images/I/718fOhQbuOL._AC_SY300_SX300_QL70_ML2_.jpg"
    }
];

export const getFavoritos = () => favoritosData;