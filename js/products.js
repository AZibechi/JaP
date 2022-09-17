const ORDER_ASC_BY_PRICE = "Asc";
const ORDER_DESC_BY_PRICE = "Desc";
const ORDER_BY_REL = "Rel.";
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;
let productosArray = [];

    // Ordena productos según el criterio que le pases y los almacena en "result"
function sortProducts(criteria, array){
    let result = [];
    if (criteria === ORDER_DESC_BY_PRICE)
    {
        result = array.sort(function(a, b) {
            if ( a.cost < b.cost ){ return -1; }
            if ( a.cost > b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_ASC_BY_PRICE){
        result = array.sort(function(a, b) {
            if ( a.cost > b.cost ){ return -1; }
            if ( a.cost < b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_REL){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }

    return result;
}


// Muestra los productos, si min y max están indefinidos o si están adentro del rango que le pusimos
function showProductsList(){
    let htmlContentToAppend = "";

    for(let product of productosArray){ 
        
        if (((minCount == undefined) || parseInt(product.cost) >= minCount) &&
            ((maxCount == undefined) || parseInt(product.cost) <= maxCount)){
        
         htmlContentToAppend += `
        <div onclick="setProdID(${product.id})" class="list-group-item list-group-item-action">
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
            }
     document.getElementById("prod-list-container").innerHTML = htmlContentToAppend; 
     document.getElementById('subtit').innerHTML= `Veras aquí todos los productos de la categoría ${nomCat}`
    }
}

    // Almacena el id en el local storage
function setProdID(id) {
    localStorage.setItem("prodID", id);
    window.location = "product-info.html"
}

    // recibe por qué criterio de orden se lo está llamando
function sortAndShowProducts(sortCriteria, productosArray){
    currentSortCriteria = sortCriteria;

    // si productos array no está indefinido, lo almacena en esta variable
    if(productosArray != undefined){
        currentProductsArray = productosArray;
    }

    // llama a la funcion que ordena criterios con los la lista de productos que haya y muestra los productos con eso
    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);

    showProductsList();
}


        
document.addEventListener("DOMContentLoaded", function(e){
    // cuando se carga la pagina almacena el ID de la categoría y llama json correspondiente
    let catID = localStorage.getItem('catID')
    let CatProd = CATS_PRODUCTS+catID+EXT_TYPE;
    
    getJSONData(CatProd).then(function(resultObj){
        
        if (resultObj.status === "ok")
        {
            producto = resultObj.data;
            nomCat = producto.catName;
            productosArray = producto.products;
            
            showProductsList();
            
                //Sort by
            document.getElementById("sortAsc").addEventListener("click", function(){
                sortAndShowProducts(ORDER_ASC_BY_PRICE, productosArray);
            });
        
            document.getElementById("sortDesc").addEventListener("click", function(){
                sortAndShowProducts(ORDER_DESC_BY_PRICE, productosArray);
            });
        
            document.getElementById("sortByCount").addEventListener("click", function(){
                sortAndShowProducts(ORDER_BY_REL, productosArray);
            });
        
            document.getElementById("clearRangeFilter").addEventListener("click", function(){
                document.getElementById("rangeFilterCountMin").value = "";
                document.getElementById("rangeFilterCountMax").value = "";
        
                minCount = undefined;
                maxCount = undefined;
        
                showProductsList();
            });

                // Filtro por precio
            document.getElementById("rangeFilterCount").addEventListener("click", function(){
                minCount = document.getElementById("rangeFilterCountMin").value;
                maxCount = document.getElementById("rangeFilterCountMax").value;
        
                if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
                    minCount = parseInt(minCount);
                }
                else{
                    minCount = undefined;
                }
                
                    console.log(minCount);

                if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
                    maxCount = parseInt(maxCount);
                }
                else{
                    maxCount = undefined;
                }
        
                showProductsList();
            });
            
            /* document.getElementById("searchbar").addEventListener("keyup", function(){ 
                const busqueda = this.value.toLowerCase;
                let htmlContentToAppend = "";
                for (producto of productosArray) {
                    let x = producto.name.toLowerCase;
                if (producto.name.indexOf(busqueda) >= 0) {
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
                }
                document.getElementById("prod-list-container").innerHTML = htmlContentToAppend; 
                };
            }); */
        }
    });
});

