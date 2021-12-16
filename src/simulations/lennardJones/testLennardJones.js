import Physics from '../../namespaces/Physics.js';
import Graphics from '../../namespaces/Graphics.js';

const epsilon = 10;
const sigma = 100;
const r0 = sigma * (2 ** 1/6);
const edgeLen = r0 * 3;

const ui = Graphics.userInterface;
ui.loadBasic();

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


lattice.setInterAtomicForces(
{
 name: "lennardJones",
 // epsilon, sigma
 params: [epsilon, sigma],
 color: "red" // currently not in use.
},
springPredicate // depending on the predicate sets the neighbour in params.
);

const verletController = Physics.verlet;
const updates = [verletController.integrationStep];
const nodeUpdates = [];

const renderer = Graphics.renderer;
renderer.setUI(ui);
renderer.setUpdates(updates);
renderer.setNodeUpdates(nodeUpdates);
renderer.setLattice(lattice);
renderer.setFPS(30);
renderer.setSpeed(1000);
renderer.ui = ui;
renderer.render();
