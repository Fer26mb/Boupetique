// home-productos.js
import { getFavoritos } from './mis-favoritos.js'; 

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('favoritos-container');
    const productos = getFavoritos(); 
    
    container.innerHTML = '';

    if (!productos || productos.length === 0) {
        container.innerHTML = '<p class="text-center text-muted py-5">No hay productos disponibles.</p>';
        return;
    }

    productos.forEach(prod => {
        const imgUrl = prod.Imagen_URL || "../assets/productos-img/default.jpeg";
        
        const precio = new Intl.NumberFormat('es-MX', { 
            style: 'currency', currency: 'MXN' 
        }).format(prod.Precio_Base);

        const cardHTML = `
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                <div class="card h-100 fav-card-boupetique" data-sku="${prod.sku}">
                    <img src="${imgUrl}" class="card-img-top" alt="${prod.Nombre}" loading="lazy">
                    
                    <div class="card-body d-flex flex-column p-4">
                        <span class="badge-categoria-boupetique w-fit-content align-self-start">
                            ${prod.Categoria}
                        </span>
                        
                        <h5 class="card-title-fav">
                            ${prod.Nombre}
                        </h5>
                        
                        <p class="desc-truncada flex-grow-1">
                            ${(prod.Descripcion_Producto || '')}
                        </p>
                        
                        <div class="d-flex justify-content-between align-items-center mt-auto pt-3" 
                             style="border-top: 1px dashed var(--boupetique-gris-alabastro);">
                            
                            <span class="precio-boupetique">${precio}</span>
                            
                            <button class="btn-favorito" title="Agregar a favoritos">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.885.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML += cardHTML;
    });

    // Lógica de favoritos
    container.addEventListener('click', (e) => {
        const btnFavorito = e.target.closest('.btn-favorito');
        if (!btnFavorito) return; 

        e.preventDefault();
        const card = btnFavorito.closest('.card');
        const sku = card.dataset.sku;
        const nombre = card.querySelector('.card-title-fav').textContent;
        
        const isLiked = btnFavorito.classList.toggle('liked');
        
        let favoritos = JSON.parse(localStorage.getItem('boupetique_favoritos')) || [];
        
        if (isLiked) {
            if (!favoritos.some(fav => fav.sku === sku)) {
                favoritos.push({ sku, nombre, fecha: new Date().toISOString() });
            }
        } else {
            favoritos = favoritos.filter(fav => fav.sku !== sku);
        }
        
        localStorage.setItem('boupetique_favoritos', JSON.stringify(favoritos));
    });
});