const ml = require('ml-regression');
const KNN = require('ml-knn');
const csv = require('csvtojson');
const prompt = require('prompt');
const csvFilePath = 'iris.csv';
const names = ['sepalLength', 'sepalWidth', 'petalLength', 'petalWidth', 'type'];

let knn;
let seperationSize;
let data = [],
  X = [],
  y = [];

let trainingSetX = [],
    trainingSetY = [],
    testSetX = [],
    testSetY = [];

csv({ noHeader: true, headers: names })
  .fromFile(csvFilePath)
  .on('json', ( jsonObj ) => {
    data.push( jsonObj );
  })
  .on('done', ( error ) => {
    seperationSize = 0.7 * data.length;
    data = shuffleArray( data );
    dressData();
  });

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}

function dressData() {
  let types = new Set();

  data.forEach(( row ) => {
    types.add( row.type );
  });
  typesArray = [...types];

  data.forEach(( row ) => {
    let rowArray, typeNumber;
  
  rowArray = Object.keys(row).map(key => parseFloat(row[key])).slice(0,4);

  typeNumber = typesArray.indexOf( row.type );

  X.push( rowArray );
  y.push( typeNumber );

  });

  trainingSetX = X.slice(0, seperationSize);
  trainingSetY = y.slice(0, seperationSize);
  testSetX = X.slice(seperationSize);
  testSetY = y.slice(seperationSize);

  train();

}

function train() {
  knn = new KNN(trainingSetX, trainingSetY, {k: 7});
  test();
}

function test() {
  const result = knn.predict(testSetX);
  const testSetLength = testSetX.length;
  const predictionError = error(result, testSetY);
  console.log( ` Test set size = ${testSetLength} and number of Misclassifications = ${predictionError}`);
  predict();
}

function error(predicted, expected) {
  let misclassifications = 0;
  for (let index = 0; index < predicted.length; index++) {
    if ( predicted[index] !== expected[index] ) {
      misclassifications++;
    }
  }
  return misclassifications;
}

function predict() {
  let temp = [];
  prompt.start();

  prompt.get(['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'], function ( err, result ) {
    if ( !err ) {
      for ( let key in result ) {
        temp.push( parseFloat(result[key]));
      }
      console.log( `With ${temp} -- type = ${knn.predict( temp )}`);
    }
  });
}
