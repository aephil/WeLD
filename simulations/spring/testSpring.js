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

// Define a function called debug here (must have
// that exact name)
// This function will get called every frame. The
// example function below will console log the frame number
// every 1000 frames
i = 0
function debug() {
    // The lattice data can be accessed via the variable
    // lattice.data
    i += 1
    if (i % 100 === 0) {
        console.log(lattice.data);

        // The debugger statement can be really useful here
        //debugger
    }
}
