const btn = document.querySelector('#btnSend');

btn.addEventListener( "click", function(){
    btn.innerText = "Enviando...";
    setTimeout(() => {
        btn.disabled = true;
    }, 500);
})