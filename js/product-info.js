document.addEventListener("DOMContentLoaded", function(e) {
    let prodID   = localStorage.getItem('prodID');
    let product  = PRODUCT_INFO_URL+prodID+EXT_TYPE;
    let comments = PRODUCT_INFO_COMMENTS_URL+prodID+EXT_TYPE;

    getJSONData(product).then(function(resultObj){
        
        if (resultObj.status === "ok")
        {
            producto = resultObj.data;
            
            showProduct();
        }
    });

    getJSONData(comments).then(function(resultObj){
        
        if (resultObj.status === "ok")
        {
            comentarios = resultObj.data;
            
            showProduct();
        }
    });

});

    //Setea la id del producto para que cargue la data del producto relacionado
function setProdID(id) {
    localStorage.setItem("prodID", id);
    window.location = "product-info.html"
}

function showProduct() {
    let imagenes = "";
    let relatedProd = "";
    let commentsList = "";
       
    //Guarda las imagenes del producto
    for(imagen of producto.images) {
        imagenes += `<div class="col">
        <img src="${imagen}" class="img-fluid img-thumbnail">
        </div>`
    }
        
    // Guarda las cartas con los productos relacionados
    for(prod of producto.relatedProducts) {
        relatedProd += `<div class="col-sm-3">
        <a class="text-decoration-none" href><div class="card pe-auto" onclick="setProdID(${prod.id})" >
        <div class="card-block">
        <h4 class="card-title text-center text-dark pt-2">${prod.name}</h4>
        </div>
        <img src="${prod.image}" class="card-img-bottom">
        </div>
        </div></a>`
    }

    // Guarda la lista de comentarios
     for(comment of comentarios) {
        score = ""
        let i = 0
        while(i<comment.score){
            score += `<span class="fa fa-star checked"></span>`
            i++
        }
        while(i<5){
            score += `<span class="fa fa-star"></span>`
            i++
        }
        commentsList += `
            <li class="list-group-item"><b>${comment.user}</b> - ${comment.dateTime} - ${score}
            </br> ${comment.description}</li>
        `
    } 

    //Genera todo el contenido de la página
    let htmlContentToAppend = `
    <h1 id="name" class="pt-5 pb-4">${producto.name}</h1>
    <p>
      <b>Precio</b> </br>
      <span id="cost">${producto.currency} ${producto.cost}</span>
    </p>
    <p>
      <b>Descripción</b> </br>
      <span id="description">${producto.description}</span>
    </p>
    <p>
      <b>Categoría</b> </br>
      <span id="category">${producto.category}</span>
    </p>
    <p>
      <b>Cantidad de vendidos</b> </br>
      <span id="soldcount">${producto.soldCount}</span>
    </p>
    <p>
      <b>Imagenes ilustrativas</b> </br>
      <div class="container pb-5">
      <div class="row">
      ${imagenes}
      </div>
      </div>
    </p>
    <p>
      <b>Productos relacionados</b> </br>
      <div class="container">
      <div class="row">
      ${relatedProd}
      </div>
      </div>
    </p>
    <h4 class="pt-5">Comentarios</h4>
    <ul class="list-group" id="commentsList">
    ${commentsList}
    </ul>
    <h4 class="pt-5">Comentar</h4>
    
    <form id="formComentario" name="formComentario">
    <div class="row">
        <div class="form-group col-lg-6">
        <label for="textComment">Tu opinión:</label>
        <textarea class="form-control" id="textComment" name="textComment"></textarea></br>
        </div>
    </div>
    <div class="row">
        <div class="form-group col-sm-2">
        <label for="selectScore">Tu puntuación:</label>
        <select class="form-control" id="selectScore" name="scoreComment">
        <option>0</option>
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
        </select>
        </div>
    </div>
    <button type="button" class="btn btn-primary mt-3" id="formCommentBtn">Enviar</button>
    
    </form>
    `;

    document.getElementById('productPresentation').innerHTML = htmlContentToAppend;

    // Guarda el comentario que se hizo y lo agrega a la lista de comentarios
    document.getElementById("formCommentBtn").addEventListener("click", function() {
        
        let textCom = document.forms["formComentario"]["textComment"].value;
        let scoreCom = document.forms["formComentario"]["scoreComment"].value;
        let usuario = localStorage.getItem("usuario");
        
        var hoy = new Date();
        var fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear();
        var hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
        var fechaYHora = fecha + ' ' + hora;

        scoreStars = ""
        let i = 0
        while(i<scoreCom){
            scoreStars += `<span class="fa fa-star checked"></span>`
            i++
        }
        while(i<5){
            scoreStars += `<span class="fa fa-star"></span>`
            i++
        }
        
        document.getElementById("commentsList").innerHTML += 
        `
                <li class="list-group-item"><b>${usuario}</b> - ${fechaYHora} - ${scoreStars}
                </br> ${textCom}</li>
            `
    
    
    })
}



