let productosArray = [];

function showProductsList(){
    let htmlContentToAppend = "";

    for(let product of productosArray){ 
        // console.log(product);
         htmlContentToAppend += `
        <div class="list-group-item list-group-item-action">
            <div class="row">
                <div class="col-3">
                    <img src="${product.image}" alt="product image" class="img-thumbnail">
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <div class="mb-1">
                        <h4>${product.name} ${product.currency} ${product.cost}</h4> 
                        <p> ${product.description}</p> 
                        </div>
                        <small class="text-muted">${product.soldCount} vendidos</small> 
                    </div>

                </div>
            </div>
        </div>
        ` 
     document.getElementById("prod-list-container").innerHTML = htmlContentToAppend; 
    }
}

document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(CATS_PRODUCTS).then(function(resultObj){
        if (resultObj.status === "ok")
        {
            producto = resultObj.data;
            productosArray = producto.products;
           // console.log(productosArray)
            showProductsList();
        }
    });
});