// Globals

// Form
const nameInput = document.getElementById("movement");
const splitsInput = document.getElementById("splits");
const targetsInput = document.getElementById("targets");
const weightInput = document.getElementById("weight");
const repsInput = document.getElementById("reps");
const notesInput = document.getElementById("notes");
const form = document.getElementById("form");
let isEditMode = false;

// Page
const list = document.getElementById("all-exercises");
const search = document.getElementById("search-bar");


// Modal
const modal = document.getElementById("form");
const innerModal = document.querySelector(".form-content");
const addBtn = document.getElementById("add-item");
const closers = document.querySelectorAll("button#close, i#close");
const fields = document.querySelectorAll("input");

function displayCards() {
  const cardsFromStorage = getCardsFromStorage();
  cardsFromStorage.forEach((card) => addCardToDOM(card));
  clearUI();
}

function getCardsFromStorage(){
  let cardsFromStorage; 
  if (localStorage.getItem('exercises') === null) {
    cardsFromStorage = [];
  } else {
    cardsFromStorage = JSON.parse(localStorage.getItem('exercises'));
  }
  return cardsFromStorage
}
// Form
function addCard(e) {
  e.preventDefault();

  const exercise = {};
  
  const exerciseName = nameInput.value;
  exercise.name = exerciseName;
  const exerciseSplits = splitsInput.value;
  exercise.splits = exerciseSplits;
  const exerciseTargets = targetsInput.value;
  exercise.targets = exerciseTargets;
  const exerciseWeight = weightInput.value;
  exercise.weight = exerciseWeight;
  const exerciseReps = repsInput.value;
  exercise.reps = exerciseReps;
  const exerciseNotes = notesInput.value;
  exercise.notes = exerciseNotes


  addCardToStorage(exercise);
  addCardToDOM(exercise);
}  

function onFocus(e) {
  const small = e.target.parentElement.children[2]
  small.classList.remove("show");
  const field = e.target.parentElement;
  field.addEventListener("focusout", warning);
}

function warning(e) {
  const small = e.target.parentElement.children[2]
  if (e.target.value === "") {
    small.classList.add("show");
  } 
}

function addCardToDOM(exercise) {
  const card = `<div class="card-container">
  <div class="card">
    <p id="movement">${exercise.name}</p>
    <p id="splits">${exercise.splits}</p>
    <iframe src="https://www.youtube.com/embed/UKwkChzThig" id="image"></iframe>
    <p id="category">Fix this later</p>
    <p id="setof">Set 1 of 3</p>
    <div class="break">
      <div class="line-break"></div>
    </div>
    <div class="weight">
      <i class="fa fa-dumbbell"></i>
      <p id="number">${exercise.weight}</p>
    </div>
    <div class="reps">
      <i class="fa fa-repeat"></i>
      <p id="reps">${exercise.reps}</p>
    </div>
    <p id="targets"><i class="fa fa-crosshairs"></i>${exercise.targets}</p>
    <p id="notes">${exercise.notes}</p>
    <p id="edit"><i class="fa fa-pencil"></i></p>
    <p id="delete"><i class="fa fa-trash"></i></p>
  </div>
  
</div>`   

list.insertAdjacentHTML("afterbegin", card);
clearUI();

}

function addCardToStorage(exercise) {
  const cardsFromStorage = getCardsFromStorage();
  cardsFromStorage.push(exercise);
  localStorage.setItem('exercises', JSON.stringify(cardsFromStorage));
}

function onClick(e) {
  if (e.target.parentElement.id === "delete") {
    removeCard(e.target.parentElement.parentElement);
  } else if (e.target.parentElement.id === "edit") {
    findCard(e.target.parentElement.parentElement)
  }

}

function removeCard(card) {
  if (confirm('Delete this exercise card?')) {
    card.remove();
    removeCardFromStorage(card.children[0].innerText);
  }
}

function removeCardFromStorage(card) {
  let cardsFromStorage = getCardsFromStorage();
  cardsFromStorage = cardsFromStorage.filter((c) => c.name !== card);
  localStorage.setItem('exercises', JSON.stringify(cardsFromStorage));
  clearUI();
}

function findCard(card) {
  const nameOfCard = card.children[0].innerText;
  const cardsFromStorage = getCardsFromStorage();
  const cardToEdit = cardsFromStorage.filter((card) => card.name === nameOfCard)
  displayModal();
  editCard(cardToEdit[0]);
}

function editCard(card) {
  console.log(card);
  const inputs = document.getElementsByTagName("input");
  document.getElementById("movement").value = card.name;
  document.getElementById("splits").value = card.splits;
  document.getElementById("targets").value = card.targets;
  document.getElementById("weight").value = card.weight;
  document.getElementById("reps").value = card.reps;
  document.getElementById("notes").value = card.notes;
  console.log(movement);
  // for(let i = 0; i < inputs.length; i++) {

  //   console.log(inputs[i].value); 
  // }
}

// Modal
// btn.onclick = function() {
//   modal.style.display = "block";
// }

function displayModal() {
  modal.style.display = "block";
  modal.addEventListener("click", outModalClick);
  innerModal.addEventListener("click", inModalClick);
  
}

function outModalClick() {
  modal.style.display = "none";
}

function inModalClick(e) {
  e.stopPropagation();
  e.stopImmediatePropagation();
}

closers.forEach(function(element){
  element.addEventListener('click', event => {
    if (event.target.id === "close") {
      modal.style.display = "none";
    }
  })
});

function searchExercises(e) {
  const cards = list.querySelectorAll("div.card");
  const text = e.target.value.toLowerCase();
  
  cards.forEach((card) => {
    const cardName = card.children[0].innerText.toLowerCase();
    if (cardName.indexOf(text) !== -1) {
      card.style.display = 'grid'
    } else {
      card.style.display = 'none';
    }
  })
}

// Application state
function clearUI() {
  const cards = list.querySelectorAll("div.card");
  if (cards.length === 0) {
    search.parentElement.style.display = "none";
  } else {
    search.parentElement.style.display = "block";
  }
}
// Event Listeners

function init() {
  form.addEventListener('submit', addCard);
  list.addEventListener('click', onClick);
  addBtn.addEventListener("click", displayModal);
  document.addEventListener('DOMContentLoaded', displayCards);
  search.addEventListener("input", searchExercises);
  
  fields.forEach ((e)=> {
    e.addEventListener("mousedown", onFocus);
  })
  clearUI();
}

init();
