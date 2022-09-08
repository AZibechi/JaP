

document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("loginBtn").addEventListener("click", function() {
        
        let password = document.forms["login"]["password"].value;
        let mail = document.forms["login"]["input"].value;
        usuario = mail;

        miStorage = window.localStorage;
        let uruario = "";
        localStorage.setItem("usuario", mail);

        if (password == '' || mail == '') {
            alert("debe ingresar sus datos");
        } else {
            window.location.href = "portada.html";
        }

    })
})




