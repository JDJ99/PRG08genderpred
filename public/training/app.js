import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"

//
// DATA
//
const csvFile = "./data/gender.csv"
const trainingLabel = "Gender"
const ignored = ["Gender"]

var positive_true = 0;
var negative_true = 0;
var positive_false = 0;
var negative_false = 0;

//
// LOAD CSV DATA AS JSON
//

function loadData() {
  Papa.parse(csvFile, {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: results => trainModel(results.data)
  });
}

//
// MACHINE LEARNING - Decision Tree
//

function trainModel(data) {
  // todo: split data into training and testing data
  // Shuffle the data randomly
  data.sort(() => Math.random() - 0.5);
  // Split the data into train and test sets
  let trainData = data.slice(0, Math.floor(data.length * 0.8));
  let testData = data.slice(Math.floor(data.length * 0.8));
  
  var l_data = data.length;
  var l_train = trainData.length;
  var l_test = testData.length;
  console.log((l_test / l_data) * 100);

  // Create the decision tree algorithm
  let decisionTree = new DecisionTree({
    ignoredAttributes: ignored,
    trainingSet: trainData,
    categoryAttr: trainingLabel
  });

  // Draw the tree structure - DOM element, width, height, decision tree
  let json = decisionTree.toJSON();
  let visual = new VegaTree('#view', 2300, 1000, json);
  console.log(decisionTree.stringify());

  // Calculate accuracy using the test data
  let correctPredictions = 0;
  for (let i = 0; i < testData.length; i++) {
    const withoutLabel = { ...testData[i] };
    delete withoutLabel.Gender;
    console.log(withoutLabel);
    console.log("Test: " + decisionTree.predict(withoutLabel));
    console.log("Label: " + testData[i][trainingLabel]);
    console.log("###############################");

    if (decisionTree.predict(withoutLabel) == testData[i][trainingLabel]) {
      correctPredictions += 1;
      if (decisionTree.predict(withoutLabel) == 1) {
        positive_true += 1;
        $("#positive_true").html(positive_true);
      }
      if (decisionTree.predict(withoutLabel) == 0) {
        negative_true += 1;
        $("#negative_true").html(negative_true);
      }
    } else {
      if (decisionTree.predict(withoutLabel) == 1) {
        positive_false += 1;
        $("#positive_false").html(positive_false);
      }
      if (decisionTree.predict(withoutLabel) == 0) {
        negative_false += 1;
        $("#negative_false").html(negative_false);
      }
    }
  }

  let accuracy = (correctPredictions / testData.length) * 100;
  accuracy = accuracy.toFixed(2);
  console.log(`Accuracy: % ${accuracy}`);
  document.getElementById("accuracy").innerHTML = "Accuracy: %" + accuracy;
}

loadData();
