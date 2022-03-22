import Physics from '../../namespaces/Physics.js';
import Graphics from '../../namespaces/Graphics.js';
import {
    KineticEnergy,
    PotentialEnergy,
    calculateQuantities
} from '../../modules/physics/quantities.js';

import { initValence } from '../../modules/physics/ForceMap.js';

var shared = {};
const edgeLen = 35;

const ui = new Graphics.UserInterface(shared);
ui.loadBasic(); // loads divs for simulation, control and terminal, and initialises the terminal

const lattice = new Physics.Lattice(shared);
lattice.setShowEdges(true);

const springPredicate = (d1, d2) => {
if (d1.id === d2.id) return false;

const dx2 = (d2.ri.x - d1.ri.x) ** 2;
const dy2 = (d2.ri.y - d1.ri.y) ** 2;
const dz2 = (d2.ri.z - d1.ri.z) ** 2;
const distanceSquared = dx2 + dy2 + dz2;

return distanceSquared <= edgeLen ** 2;
}


lattice.makePrimitive3D(5,5,1,edgeLen);

const springConstant = 0.01;
const k = 1;
lattice.setInterAtomicForces(
{
 name: "spring",
 params: [springConstant /* spring constant k */, edgeLen /* equilibrium separation*/],
 color: "red" // currently not in use.
},
springPredicate // depending on the predicate sets the neighbour in params.
);


initValence(shared, k);

lattice.sharedData.nodes[0].ri.x += 15;
lattice.sharedData.nodes[0].ri.y += 15;

console.log(lattice.sharedData.nodes[0].forces);


let i = 0;
function debug() {
    if (i % 100 == 0) {
        ui.clearTerminal();
        const KE = lattice.quantities[0].value;
        const PE = lattice.quantities[1].value;
        const TE = KE + PE;
        console.log(lattice);
        ui.logDebug(`Kinetic energy: ${KE}`);
        ui.logDebug(`Potential energy: ${PE}`);
        ui.logDebug(`Total energy: ${TE}`);
    }
    i += 1;
}


lattice.setQuantities([
    new KineticEnergy(),
    new PotentialEnergy()
])

// TESTING: push the first node in the x direction to simulate an initial Extension

const verletController = Physics.verlet;
const updates = [verletController.integrationStep, calculateQuantities]
const nodeUpdates = [];

const renderer = new Graphics.Renderer(shared);

renderer.setUI(ui);
renderer.setUpdates(updates);
//renderer.setNodeUpdates(nodeUpdates);
//renderer.setDebug(debug);
renderer.setFPS(30);
renderer.setSpeed(1000);
renderer.render()
