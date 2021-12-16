"use strict";

var _Physics = _interopRequireDefault(require("../../namespaces/Physics.js"));

var _Graphics = _interopRequireDefault(require("../../namespaces/Graphics.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var edgeLen = 20;
var ui = _Graphics["default"].userInterface;
ui.loadBasic(); // loads divs for simulation, control and terminal, and initialises the terminal

var lattice = _Physics["default"].lattice;
lattice.setUI(ui);
lattice.setShowEdges(true);
ui.setData(lattice.data); // Spring neighbour predicate

var springPredicate = function springPredicate(d1, d2) {
  if (d1.id === d2.id) return false;
  var dx2 = Math.pow(d2.ri.x - d1.ri.x, 2);
  var dy2 = Math.pow(d2.ri.y - d1.ri.y, 2);
  var dz2 = Math.pow(d2.ri.z - d1.ri.z, 2);
  var distanceSquared = dx2 + dy2 + dz2;
  return distanceSquared <= Math.pow(edgeLen, 2);
};

lattice.makePrimitive3D(2, 1, 1, edgeLen);
var k = 1;
lattice.setInterAtomicForces({
  name: "spring",
  params: [k
  /* spring constant k */
  , edgeLen
  /* equilibrium separation*/
  ],
  color: "red" // currently not in use.

}, springPredicate // depending on the predicate sets the neighbour in params.
);
ui.setData(lattice.data); // TESTING: push the first node in the x direction to simulate an initial Extension

lattice.data[0].ri.x += 10;

var initialSeparation = edgeLen - _Physics["default"].Vector.norm(_Physics["default"].Vector.sub(lattice.data[1].ri, lattice.data[0].ri)); // Define a function called debug here (must have
// that exact name)
// This function will get called every frame. The
// example function below will console log the frame number
// every 1000 frames


var i = 0;
var min = 100000;
var max = 0;
var separations = [];

function meanOf(arr) {
  var sum = arr.reduce(function (a, b) {
    return a + b;
  }, 0);
  var mean = sum / arr.length || 0;
  return mean;
}

function debug(data) {
  // The lattice data can be accessed via the variable
  // lattice.data
  i += 1;

  if (i % 100 === 0) {
    var a = lattice.data[0].ri;
    var b = lattice.data[1].ri;

    var displacement = _Physics["default"].Vector.sub(b, a);

    var separation = _Physics["default"].Vector.norm(displacement);

    separations.push(separation);

    if (separation > max) {
      max = separation;
    }

    if (separation < min) {
      min = separation;
    }

    var range = max - min;
    var mean = meanOf(separations); // Use console.clear to cleat the console so it doesn't get
    // cluttered

    console.clear();
    console.log("Separation: ".concat(separation));
    console.log("Range: ".concat(range));
    console.log("Mean separation: ".concat(mean));
    console.log("Expected mean separation: ".concat(edgeLen));
    console.log("Expected range: ".concat(2 * initialSeparation)); // The debugger statement can be really useful here
    //debugger
  }
}

console.log(_Physics["default"]);
var verletController = _Physics["default"].verlet;
var updates = [verletController.integrationStep];
var nodeUpdates = [];
var renderer = _Graphics["default"].renderer;
renderer.setUI(ui);
renderer.setUpdates(updates);
renderer.setNodeUpdates(nodeUpdates);
renderer.setDebug(debug);
renderer.setLattice(lattice);
renderer.setFPS(30);
renderer.setSpeed(1000);
renderer.ui = ui;
renderer.render();