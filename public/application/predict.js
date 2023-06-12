import { DecisionTree } from "./libraries/decisiontree.js";

let form = document.querySelector('form');
let result = document.querySelector('#result');

// Load the saved model from JSON file
function loadSavedModel() {
  return fetch("./model.json")
    .then((response) => response.json())
    .then((model) => new DecisionTree(model));
}

// Make prediction when the form is submitted
form.addEventListener('submit', (event) => {
  event.preventDefault();

  // Get user input
  let color = document.querySelector('#color').value;
  let musicGenre = document.querySelector('#musicGenre').value;
  let beverage = document.querySelector('#beverage').value;
  let softDrink = document.querySelector('#softDrink').value;

  // Load the saved model and make prediction
  loadSavedModel().then((decisionTree) => {
    let sample = { "Favorite Color": color, "Favorite Music Genre": musicGenre, "Favorite Beverage": beverage, "Favorite Soft Drink": softDrink };
    let prediction = decisionTree.predict(sample);
    result.textContent = `The predicted gender is ${prediction}.`;
  });
});
