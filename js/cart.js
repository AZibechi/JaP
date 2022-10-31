document.addEventListener("DOMContentLoaded", function(e){

    let idUser = "25801";

    getJSONData(CART_INFO_URL+idUser+EXT_TYPE).then(function(resultObj){
        if (resultObj.status === "ok"){
            userCart = resultObj.data
            articlesArray = userCart.articles
            miStorage = window.localStorage;
            let otrosProductos = JSON.parse(localStorage.getItem("carrito"));
            for (otroProd of otrosProductos) {
                articlesArray.push(otroProd);
            }
            showArticles(articlesArray);            
        }
    });
});



function showArticles() {
    let htmlContentToAppend = "";
    let subtotalGeneral = 0;
    if(articlesArray == "") {
        htmlContentToAppend == `No tienes ningún producto en el carrito`
    } else {
        let unitCost = ""
        for (articulo of articlesArray) {
            let subtotal = articulo.currency + " " + articulo.count * articulo.unitCost;
            let idArticulo = articlesArray.indexOf(articulo); 
            unitCost = articulo.unitCost;
            htmlContentToAppend += `
            <tr>
                <td><img src="${articulo.image}" class="img-fluid"></td>
                <td>${articulo.name}</td>
                <td> <span id="unitCost${idArticulo}">${articulo.unitCost}</span> <span id="currency${idArticulo}">${articulo.currency}</span></td>
                <td class="w-10"><div>
                <input name="cantidad" value="${articulo.count}" size="1" oninput="subtotal()" class="form-control w-25" type="number" min="1" required>
                <div class="invalid-feedback">Seleccione una cantidad válida</div>
                </div>
                </td>
                <td id="subtotal${idArticulo}" name="subtotal">${subtotal}</td>
            </tr>`
            if(articulo.currency === "UYU") {
                subtotalGeneral +=  Math.round((articulo.count * articulo.unitCost) / 41,2);
            } else {
            subtotalGeneral += articulo.count * articulo.unitCost;
            }
        }
        document.getElementById('subtotalProductos').innerHTML = subtotalGeneral;
        costoEnvio()
    }
    document.getElementById('carritoContent').innerHTML = htmlContentToAppend;
}

/* Habilitaciones del Modal */

let numTarjeta = document.getElementById("numTarjeta");
let codigo = document.getElementById("codigo");
let vencimiento = document.getElementById("vencimiento");
let numCuenta = document.getElementById("numCuenta");
let credito = document.getElementById('credito');
let transferencia = document.getElementById('transferencia')

credito.addEventListener("change", function(){
    numTarjeta.disabled = false
    codigo.disabled = false
    vencimiento.disabled = false
    numCuenta.disabled = true
    numCuenta.value = ""
})

transferencia.addEventListener("change", function(){
    numCuenta.disabled = false
    numTarjeta.disabled = true
    codigo.disabled = true
    vencimiento.disabled = true
    numTarjeta.value = ""
    codigo.value = ""
    vencimiento.value = ""
})


/* Cambiar el Subtotal */

/* Tipo de Envío */

let tipoEnvio = "";

document.getElementById('premium').addEventListener("click", function(){
    tipoEnvio = 0.15
    costoEnvio()
})

document.getElementById('express').addEventListener("click", function(){
    tipoEnvio = 0.07
    costoEnvio()
})

document.getElementById('standard').addEventListener("click", function(){
    tipoEnvio = 0.05
    costoEnvio()
})

function costoEnvio() {
    let costoTotal = Math.round(tipoEnvio * document.getElementById('subtotalProductos').innerHTML);
    let subtotalProductos = document.getElementById('subtotalProductos').innerHTML
  document.getElementById('costoTotal').innerHTML = costoTotal
  document.getElementById('subtotalGeneral').innerHTML = costoTotal * 1 + subtotalProductos * 1;
}

function subtotal() {
    cantidades = Array.from(document.getElementsByName('cantidad'))
    let subtotalGeneral = 0;

 for (elemento of cantidades) {
    let id = cantidades.indexOf(elemento);
    let unitCost = document.getElementById('unitCost' + id).innerHTML;
    let currency = document.getElementById('currency' + id).innerHTML;
        let subtotalValue = elemento.value * unitCost;
        let subtotal = currency + " " + subtotalValue;
        document.getElementById('subtotal' + id).innerHTML = subtotal;
        if(currency === "UYU") {
            subtotalValue = Math.round(subtotalValue / 41,2)
        }

    subtotalGeneral += subtotalValue;
    document.getElementById('subtotalProductos').innerHTML = subtotalGeneral;
    costoEnvio()
} 
} 

/* Validación del Form */

 let formulario = document.getElementById("formCompra");
let premium = document.getElementById("premium");
let express = document.getElementById("express");
let standard = document.getElementById("standard");
let formaEnvio = premium.checked || express.checked || standard.checked
let formaPago = credito.checked || transferencia.checked

formulario.addEventListener("submit", function (e) {
    validaciones(formulario, e); 
});
function validaciones(form, event) {  
    if (!form.checkValidity()) {
      event.preventDefault()
      event.stopPropagation()
    } else {
        event.preventDefault()
        event.stopPropagation()
        document.getElementById('alertSuccess').classList.add('show');
    }
    form.classList.add('was-validated');
  } 

  