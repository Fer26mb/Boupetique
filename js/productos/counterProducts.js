export function contarProductosAgregados (){
    const contado = document.getElementById("contado");
    
    if (!contado) {
        setTimeout(contarProductosAgregados, 100);
        return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if(cart.length == 0){
        contado.innerHTML = ``;
    }else{
        contado.innerHTML = 
        `<span class="position-absolute start-50 translate-middle badge rounded-pill" style="top: 30%; font-size: 1rem;">
            ${cart.length}
        </span>`;
    }

    console.log(cart.length);
}

contarProductosAgregados();

// document.addEventListener("DOMContentLoaded", contarProductosAgregados);