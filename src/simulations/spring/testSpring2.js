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

return distanceSquared <= 2 * edgeLen ** 2;
}


lattice.makePrimitive3D(3,3,1,edgeLen);

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
lattice.data[0].ri.x += 0;

const verletController = Physics.verlet;
const updates = [verletController.integrationStep]
const nodeUpdates = [];

const renderer = Graphics.renderer;

renderer.setUI(ui);
renderer.setUpdates(updates);
renderer.setNodeUpdates(nodeUpdates);
renderer.setLattice(lattice);
renderer.setFPS(30);
renderer.setSpeed(1000);
renderer.ui = ui;
renderer.render()
