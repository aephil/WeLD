"use strict";

var edgeLen = 20;
lattice.makePrimitive3D(3, 3, 1, edgeLen);
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
); // TESTING: push the first node in the x direction to simulate an initial Extension

lattice.data[1].ri.x += 10;

function debug() {}