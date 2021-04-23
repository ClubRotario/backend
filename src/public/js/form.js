const btn = document.querySelector('#btnSend');
const txtName = document.querySelector('#txtName');
const txtEmail = document.querySelector('#txtEmail');
const txtAddress = document.querySelector('#txtAddress');

btn.addEventListener( "click", function(){
    if(txtName && txtEmail && txtAddress){
        btn.innerText = "Enviando...";
        setTimeout(() => {
            btn.disabled = true;
        }, 500);
    }
})