const edgeLen = 20;
lattice.makePrimitive3D(2,1,1,edgeLen);

const k = 1;

lattice.setInterAtomicForces(
{
 name: "spring",
 params: [k /* spring constant k */, edgeLen /* equilibrium separation*/],
 color: "red" // currently not in use.
},
springPredicate // depending on the predicate sets the neighbour in params.
);

// TESTING: push the first node in the x direction to simulate an initial Extension
lattice.data[0].ri.x += 10;

const initialSeparation = edgeLen - Physics.Vector.norm(Physics.Vector.sub(lattice.data[1].ri, lattice.data[0].ri));

// Define a function called debug here (must have
// that exact name)
// This function will get called every frame. The
// example function below will console log the frame number
// every 1000 frames
i = 0;
min = 100000
max = 0

const separations = [];

function meanOf(arr) {
    const sum = arr.reduce((a, b) => a + b, 0);
    const mean = (sum / arr.length) || 0;
    return mean;
}

function debug(data) {
    // The lattice data can be accessed via the variable
    // lattice.data
    i += 1
    if (i % 100 === 0) {
        const a = lattice.data[0].ri
        const b = lattice.data[1].ri
        const displacement = Physics.Vector.sub(b, a)

        const separation = Physics.Vector.norm(displacement)

        separations.push(separation);

        if (separation > max) {
            max = separation;
        }
        if (separation < min) {
            min = separation;
        }

        const range = max - min;
        const mean = meanOf(separations);
        // Use console.clear to cleat the console so it doesn't get
        // cluttered
        console.clear()
        console.log(`Separation: ${separation}`)
        console.log(`Range: ${range}`);
        console.log(`Mean separation: ${mean}`);
        console.log(`Expected mean separation: ${edgeLen}`);
        console.log(`Expected range: ${2 * initialSeparation}`);
        // The debugger statement can be really useful here
        //debugger
    }
}
