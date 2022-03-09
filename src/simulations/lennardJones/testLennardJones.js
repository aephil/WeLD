import Physics from '../../namespaces/Physics.js';
import Graphics from '../../namespaces/Graphics.js';
import {
    calculateQuantities,
    KineticEnergy,
    PotentialEnergy
} from '../../modules/physics/quantities.js';

const epsilon = 10;
const sigma = 100;
const r0 = sigma * (2 ** (1/6));
const edgeLen = r0 * 1.5;

var shared = {};

const ui = new Graphics.UserInterface(shared);
ui.loadBasic(); // loads divs for simulation, control and terminal, and initialises the terminal

const lattice = new Physics.Lattice(shared);
lattice.setShowEdges(true);

lattice.makePrimitive3D(2, 1, 1, edgeLen);

const k = 1;

lattice.setInterAtomicForces(
    {
        name: "lennardJones",
        params: [epsilon, sigma],
        color: "red" // currently not in use.
    },
    () => true // depending on the predicate sets the neighbour in params.
);

let i = 0;
function debugQuantities(lattice) {
    if (i % 100 === 0) {

        console.clear();

        // energies /////////////////////////////////////////////////

        const KE = lattice.quantities[0].value;
        const PE = lattice.quantities[1].value;
        const TE = KE + PE;
        console.log(`Kinetic energy: ${KE}`);
        console.log(`Potential energy: ${PE}`);
        console.log(`Total energy: ${TE}`);

    }
    i += 1;
}

lattice.setQuantities([
    new KineticEnergy(),
    new PotentialEnergy()
]);

const verletController = Physics.verlet;
const updates = [verletController.integrationStep, calculateQuantities, debugQuantities]
const nodeUpdates = [];

const renderer = new Graphics.Renderer(shared);

renderer.setUI(ui);
renderer.setUpdates(updates);
//renderer.setNodeUpdates(nodeUpdates);
//renderer.setDebug(debugQuantities);

renderer.setFPS(30);
renderer.setSpeed(1000);
renderer.render()
