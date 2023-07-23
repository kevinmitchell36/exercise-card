const modal = document.getElementById("form");

const btn = document.getElementById("add-item");

const closers = document.querySelectorAll("button#close, i#close");



btn.onclick = function() {
  modal.style.display = "block";
}


closers.forEach( function(element){
  element.addEventListener('click', event => {
    if (event.target.id == "close") {
      modal.style.display = "none";
    }
  })
});