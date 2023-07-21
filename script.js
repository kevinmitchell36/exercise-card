const modal = document.getElementById("form");

const btn = document.getElementById("add-item");

const span = document.getElementById("close");

btn.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}