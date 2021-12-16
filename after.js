verletController = Physics.Verlet;

// Each function here is called by the renderer every frame
ui.setData(lattice.data);

// The debug function should be defined in the simulation
// script

// these functions will get run once every frame.
// They should take the lattice data as an input
var updates = [
    verletController.integrationStep,
    // verletController.updateState,
    debug
];

// These functions are run on every node every frame.
// They should take a specific node and the lattice data
// as arguments (in that order)
var nodeUpdates = [
];

renderer = Graphics.Renderer;
renderer.setUI(ui);
renderer.setUpdates(updates);
renderer.setNodeUpdates(nodeUpdates);
renderer.setLattice(lattice);
renderer.setFPS(30);
renderer.setSpeed(1000);
renderer.ui = ui;
renderer.render();
