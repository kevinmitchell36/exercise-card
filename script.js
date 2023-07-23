// Form
const nameField = document.getElementById("movement");
const list = document.getElementById("all-exercises");
const form = document.getElementById("form");

function addItem(e) {
  e.preventDefault();
  const exerciseName = nameField.value

  if (exerciseName === '') {
    alert('Please add to the name field');
    return;
  }

  const div = createCard("card", exerciseName);  
  list.appendChild(div)

}

function createCard(className, exerciseName) {
  const div = document.createElement('div');
  div.className = className;
  const ul = createUl('exercise', exerciseName);
  div.appendChild(ul);
  return div
}

function createUl(className, exerciseName) {
  const ul = document.createElement('ul');
  ul.className = className;
  const li = createLi(exerciseName);
  ul.appendChild(li)
  return ul;
}

function createLi(exerciseName) {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(exerciseName));
  return li;
}

form.addEventListener('submit', addItem);




// Modal
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