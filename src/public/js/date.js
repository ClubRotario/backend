const date = document.querySelector('#date');

window.onload = function(){
    date.innerText = new Date().getFullYear();
}