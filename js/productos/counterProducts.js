export function contarProductosAgregados (){
    const contador = document.getElementById("contador");
    
    if (!contador) {
        setTimeout(contarProductosAgregados, 100);
        return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if(cart.length == 0){
        contador.innerHTML = ``;
    }else{
        contador.innerHTML = 
        `<span class="position-absolute start-100 translate-middle badge rounded-pill" style="top: 18%; font-size: 0.5em;">
            ${cart.length}
        </span>`;
    }

    console.log(cart.length);
}

contarProductosAgregados();
// document.addEventListener("DOMContentLoaded", contarProductosAgregados);