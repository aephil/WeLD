const edgeLen = 20;
lattice.makePrimitive3D(2,1,1,edgeLen);
tempController.changeDOF(3*lattice.data.length);

lattice.setInterAtomicForces(
{
 name: "spring",
 params: [1 /* spring constant k */, edgeLen /* equilibrium separation*/],
 color: "red" // currently not in use.
},
springPredicate // depending on the predicate sets the neighbour in params.
);

// Setup valence angles
Physics.initValence(lattice, 1);

// TESTING: push the first node in the x direction to simulate an initial Extension
lattice.data[0].ri.x += 0.5;
