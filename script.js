// Globals

// Form
const nameInput = document.getElementById("movement");
const splitsInput = document.getElementById("splits");
const splitsContainer = document.getElementById("splits-container");
const demoInput = document.getElementById("demo");
const targetsInput = document.getElementById("targets");
const targetsContainer = document.getElementById("targets-container");
const weightInput = document.getElementById("weight");
const repsInput = document.getElementById("reps");
const notesInput = document.getElementById("notes");
const form = document.getElementById("form");


let isEditMode = false;
let splitsTag = '';
let targetsTag = '';

// Page
const list = document.getElementById("all-exercises");
const search = document.getElementById("search-bar");

// Modal
const modal = document.getElementById("form");
const innerModal = document.querySelector(".form-content");
const addBtn = document.getElementById("add-item");
const closeBtn = document.getElementById("close");
const fields = document.querySelectorAll("input:not(#search-bar)");
const submitBtn = document.querySelector("button[type='submit']");
const plusSigns = document.querySelectorAll("i.fa-plus")

// Page Load
function displayCards() {
  const cardsFromStorage = getCardsFromStorage();
  cardsFromStorage.forEach((card) => addCardToDOM(card));
  clearUI();
}

function getCardsFromStorage(){
  let cardsFromStorage; 
  if (sessionStorage.getItem('exercises') === null) {
    cardsFromStorage = [];
  } else {
    cardsFromStorage = JSON.parse(sessionStorage.getItem('exercises'));
  }
  return cardsFromStorage
}

// Form
function addCard(e) {
  e.preventDefault();
  
  const exercise = {};
  
  const exerciseName = nameInput.value;
  exercise.name = exerciseName;

  const exerciseSplits = []
  allSplitTags = document.querySelectorAll("li.split-tag");
  allSplitTags.forEach(tag => exerciseSplits.push(tag.innerText));
  exercise.splits = exerciseSplits.reverse(); 
  

  const exerciseDemo = demoInput.value;
  exercise.demo = embedLink(exerciseDemo);
  
  const exerciseTargets = [];
  allTargetTags = document.querySelectorAll("li.target-tag")
  allTargetTags.forEach(tag => exerciseTargets.push(tag.innerText));
  exercise.targets = exerciseTargets.reverse();
  
  const exerciseWeight = weightInput.value;
  exercise.weight = exerciseWeight;
  const exerciseReps = repsInput.value;
  exercise.reps = exerciseReps;
  const exerciseNotes = notesInput.value;
  exercise.notes = exerciseNotes;
  
  for (const field in exercise) {
    if (exercise[field] === '') {
      alert("All fields are required");
      return;
    }
  }

  if (isEditMode) {
    const cardToDelete = list.querySelector(".edit-mode");
    removeCardFromStorage(cardToDelete.children[0].innerText);
    cardToDelete.classList.remove("edit-mode");
    cardToDelete.remove();
    isEditMode = false;
  } else {
    if (checkDuplicates(exercise.name)) {
      alert('That exercise already exsits!')
      return;
    }
  }
  
  addCardToStorage(exercise);
  addCardToDOM(exercise);
}  

function embedLink(url) {
  const videoId = url.split("v=")[1];
  const videoString = `https://www.youtube.com/embed/${videoId}`;
  return videoString;
}

function createTag(e) {
  let className = ''
  const text = e.target.value;
  if (e.target.id === "splits") {
    className = "split-tag";
    splitsTag = `<li class="${className}">${text}</li>`;
  } else {
    className = "target-tag";
    targetsTag = `<li class="${className}">${text}</li>`;
  }
}

function showTag(e) {
  if (e.target.id === "split-add") {
    splitsContainer.insertAdjacentHTML("afterend", splitsTag);
    splitsInput.value = '';
  } else if (e.target.id === "target-add") {
    targetsContainer.insertAdjacentHTML("afterend", targetsTag);
    targetsInput.value = '';
  }
  const tags = document.querySelectorAll('li');
  tags.forEach((tag) => {
    tag.addEventListener("dblclick", deleteTag);
  })
}

function deleteTag(e) {
  e.target.remove();
}

function onFocus(e) {
  checkPreviousFields(e);
  const length = e.target.parentElement.children.length - 1;
  const small = e.target.parentElement.children[length];
  small.classList.remove("show");
  const field = e.target.parentElement;
  field.addEventListener("focusout", warning);
}

function checkPreviousFields(e) {
  const fieldsArray = (Array.from(fields));
  const fieldsNames = fieldsArray.map((field) => field.name);
  const fieldName = e.target.name;
  const indexPosition = fieldsNames.indexOf(fieldName);
  for (let i = indexPosition - 1; i >= 0; i--) {
    let fieldId = "#" + fieldsNames[i];
    let fieldValue = document.querySelector(fieldId).value;
    const parent = document.getElementById(fieldsNames[i]).parentElement;
    const inputName = parent.querySelector("input").name;
    let splitField = inputName === "splits" ? true : false;
    let targetField = inputName === "targets" ? true : false;
    const small = parent.querySelector("small");
    if (!fieldValue && splitField) {
      const tagList = (document.getElementsByClassName("split-tag"));
      if (tagList.length === 0)  {
        small.classList.add("show");
      }
    } else if (!fieldValue && targetField) {
      const tagList = (document.getElementsByClassName("target-tag"));
      if (tagList.length === 0)  {
        small.classList.add("show");
      }  
    } else if (!fieldValue) {
      small.classList.add("show");
    }
  }
}

function warning(e) {
  let child 
  if (e.target.parentElement.children.length == 3) {
    child = 2
  } else {
    child = 3
  }
  const small = e.target.parentElement.children[child]
  if (child === 2 && e.target.value === "") {
    small.classList.add("show");
  } else if (child === 3 && e.target.value === "" && (splitsTag === null || targetsTag === null) ) {
    small.classList.add("show");
  }
}

function addCardToDOM(exercise) {
  const card = `<div class="card-container">
  <div class="card">
    <p id="card-movement">${exercise.name}</p>
    <p id="card-splits">${exercise.splits.join('/')}</p>
    <iframe src=${exercise.demo} alt="media not found" id="card-image"></iframe>
    <div id="card-weight">
      <i class="fa fa-dumbbell"></i>
      <p id="number">${exercise.weight}</p>
    </div>
    <div id="card-reps">
      <i class="fa fa-repeat"></i>
      <p id="reps">${exercise.reps}</p>
    </div>
    <p id="card-targets"><i class="fa fa-crosshairs"></i>${exercise.targets}</p>
    <p id="card-notes">${exercise.notes}</p>
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
  sessionStorage.setItem('exercises', JSON.stringify(cardsFromStorage));
}

// Delete/Edit
function onClick(e) {
  if (e.target.parentElement.id === "delete") {
    removeCard(e.target.parentElement.parentElement);
  } else if (e.target.parentElement.id === "edit") {
    findCard(e.target.parentElement.parentElement)
  }

}

// Delete
function removeCard(card) {
  if (confirm(`Delete this exercise card?`)) {
    card.remove();
    removeCardFromStorage(card.children[0].innerText);
  }
}

function removeCardFromStorage(card) {
  let cardsFromStorage = getCardsFromStorage();
  cardsFromStorage = cardsFromStorage.filter((c) => c.name !== card);
  sessionStorage.setItem('exercises', JSON.stringify(cardsFromStorage));
  clearUI();
}

// Edit
function findCard(card) {
  isEditMode = true;
  const nameOfCard = card.children[0].innerText;
  const cardsFromStorage = getCardsFromStorage();
  const cardToEdit = cardsFromStorage.filter((card) => card.name === nameOfCard)
  const cardObject = cardToEdit[0]
  card.classList.add("edit-mode");
  displayModal();
  editCard(cardObject);
}

function editCard(cardObject) {
  const inputs = document.getElementsByTagName("input");
  document.getElementById("movement").value = cardObject.name;
  document.getElementById("splits").value = cardObject.splits;
  document.getElementById("demo").value = cardObject.demo;
  document.getElementById("targets").value = cardObject.targets;
  document.getElementById("weight").value = cardObject.weight;
  document.getElementById("reps").value = cardObject.reps;
  document.getElementById("notes").value = cardObject.notes;
}

// Local Storage Duplicates
function checkDuplicates(exerciseName) {
  const cardsFromStorage = getCardsFromStorage();
  return cardsFromStorage.some(e => e.name === exerciseName);
}

// Modal
function displayModal() {
  if (isEditMode) {
    submitBtn.innerText = "Update Exercise";
  }
  modal.style.display = "block";
  modal.addEventListener("click", outModalClick);
  innerModal.addEventListener("click", inModalClick);
  if (isEditMode === false) {
    form.reset();
  }
}

function outModalClick() {
  modal.style.display = "none";
  refreshForm();
}

function refreshForm() {
  const smalls = document.querySelectorAll('small');
  smalls.forEach((small) => {
    small.classList.remove("show");
  })
  const tags = document.querySelectorAll('li');
  tags.forEach((tag) => {
    tag.remove();
  })
}

function inModalClick(e) {
  e.stopPropagation();
  e.stopImmediatePropagation();
}

// Search
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
  modal.style.display = "none";
  submitBtn.innerText = "Add Exercise";
  isEditMode = false;
  refreshForm();
}

// Event Listeners
function init() {
  form.addEventListener('submit', addCard);
  splitsInput.addEventListener("input", createTag);
  targetsInput.addEventListener("input", createTag);
  list.addEventListener('click', onClick);
  addBtn.addEventListener("click", displayModal);
  document.addEventListener('DOMContentLoaded', displayCards);
  search.addEventListener("input", searchExercises);
  closeBtn.addEventListener("click", outModalClick);
  
  fields.forEach((e) => {
    e.addEventListener("mousedown", onFocus);
  })

  plusSigns.forEach(plus => {
    plus.addEventListener("click", showTag);
  })

  clearUI();
}

init();
