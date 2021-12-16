"use strict";

var epsilon = 10;
var sigma = 100;
var r0 = sigma * (Math.pow(2, 1) / 6);
var edgeLen = r0 * 3;
lattice.makePrimitive3D(2, 1, 1, edgeLen);
tempController.changeDOF(3 * lattice.data.length);
lattice.setInterAtomicForces({
  name: "lennardJones",
  // epsilon, sigma
  params: [epsilon, sigma],
  color: "red" // currently not in use.

}, springPredicate // depending on the predicate sets the neighbour in params.
); // Setup valence angles
// Physics.initValence(lattice, 1);
// TESTING: push the first node in the x direction to simulate an initial Extension