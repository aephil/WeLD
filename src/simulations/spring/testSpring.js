import Physics from '../../namespaces/Physics.js';
import Graphics from '../../namespaces/Graphics.js';
import {
    calculateQuantities,
    KineticEnergy,
    PotentialEnergy
} from '../../modules/physics/quantities.js';


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

lattice.makePrimitive3D(2, 1, 1, edgeLen);

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


let i = 0;
function meanOf(arr) {
    const sum = arr.reduce((a, b) => a + b, 0);
    const mean = (sum / arr.length) || 0;
    return mean;
}

function debugQuantities(lattice) {
    if (i % 100 === 0) {

        ui.clearTerminal();
        ui.logDebug('----------------------')

        // energies /////////////////////////////////////////////////

        const KE = lattice.quantities[0].value;
        const PE = lattice.quantities[1].value;
        const TE = KE + PE;
        ui.logDebug(`Kinetic energy: ${KE}`);
        ui.logDebug(`Potential energy: ${PE}`);
        ui.logDebug(`Total energy: ${TE}`);

        ui.logDebug('--------------------');

    }
    i += 1;
}

lattice.setQuantities([
    new KineticEnergy(),
    new PotentialEnergy()
]);

const verletController = Physics.verlet;
const updates = [verletController.integrationStep, calculateQuantities]
const nodeUpdates = [];

const renderer = Graphics.renderer;

renderer.setUI(ui);
renderer.setUpdates(updates);
renderer.setNodeUpdates(nodeUpdates);
renderer.setDebug(debugQuantities);
renderer.setLattice(lattice);
renderer.setFPS(30);
renderer.setSpeed(1000);
renderer.ui = ui;
renderer.render()
