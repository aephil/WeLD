const epsilon = 10;
const sigma = 100;
const r0 = sigma * (2 ** 1/6);
const edgeLen = r0 * 3;

lattice.makePrimitive3D(2,1,1,edgeLen);
tempController.changeDOF(3*lattice.data.length);

lattice.setInterAtomicForces(
{
 name: "lennardJones",
 // epsilon, sigma
 params: [epsilon, sigma],
 color: "red" // currently not in use.
},
springPredicate // depending on the predicate sets the neighbour in params.
);

// Setup valence angles
// Physics.initValence(lattice, 1);

// TESTING: push the first node in the x direction to simulate an initial Extension
