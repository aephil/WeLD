import Physics from '../../namespaces/Physics.js';
import Graphics from '../../namespaces/Graphics.js';

const edgeLen = 20;

const ui = Graphics.userInterface;
ui.loadBasic(); // loads divs for simulation, control and terminal, and initialises the terminal

const lattice = Physics.lattice;
lattice.setUI(ui);
lattice.setShowEdges(true);

ui.setData(lattice.data);

// Spring neighbour predicate
const springPredicate = (d1, d2) => {
if (d1.id === d2.id) return false;

const dx2 = (d2.ri.x - d1.ri.x) ** 2;
const dy2 = (d2.ri.y - d1.ri.y) ** 2;
const dz2 = (d2.ri.z - d1.ri.z) ** 2;
const distanceSquared = dx2 + dy2 + dz2;

return distanceSquared <= edgeLen ** 2;
}


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

ui.setData(lattice.data);



// TESTING: push the first node in the x direction to simulate an initial Extension
lattice.data[0].ri.x += 10;

const initialSeparation = edgeLen - Physics.Vector.norm(Physics.Vector.sub(lattice.data[1].ri, lattice.data[0].ri));

// Define a function called debug here (must have
// that exact name)
// This function will get called every frame. The
// example function below will console log the frame number
// every 1000 frames
let i = 0;
let min = 100000
let max = 0

const separations = [];
var mean = 0; 
var range = 0;

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
    
        mean = meanOf(separations);
        ui.clearTerminal();
        ui.logDebug(`<br>sample size: ${separations.length}`);
        ui.logDebug(`<br>Range: ${range}`);
        ui.logDebug(`<br>Mean separation: ${mean}`);
        ui.logDebug(`<br>Expected mean separation: ${edgeLen}`);
        ui.logDebug(`<br>Expected range: ${2 * initialSeparation}`);
        
    } else {

        const a = lattice.data[0].ri
        const b = lattice.data[1].ri
        const displacement = Physics.Vector.sub(b, a)
        const separation = Physics.Vector.norm(displacement)
        separations.push(separation);

        // prevent samples from getting too big
        if (separations.length>1000000)
        {
            ui.logDebug("resetting samples");
            separations = [];
        }

        if (separation > max) {
            max = separation;
        }
        if (separation < min) {
            min = separation;
        }

        range = max - min;
        
    }
    // Use console.clear to clear the console so it doesn't get
    // cluttered
   
   
    // The debugger statement can be really useful here
    // debugger
}

//console.log(Physics);
const verletController = Physics.verlet;
const updates = [verletController.integrationStep]
const nodeUpdates = [];

const renderer = Graphics.renderer;

renderer.setUI(ui);
renderer.setUpdates(updates);
renderer.setNodeUpdates(nodeUpdates);
renderer.setDebug(debug);
renderer.setLattice(lattice);
renderer.setFPS(30);
renderer.setSpeed(1000);
renderer.ui = ui;
renderer.render()
