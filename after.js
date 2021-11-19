verletController = Physics.Verlet;
// There is something really weird going on here
// where if you try to change this var to a let
// you get the error message
// Uncaught Syntaxerror: Identifier 'physics' has already
// been declared,
// I'm thinking this must have something to do with var and let
// using different scopes, but also something really weird
// must be going on, because if i grep the entire codebase
// for "physics =" and "physics=", the only relevant results
// are the let right below this comment, and a line in Weld.js,
// which is not being run. For now I think we just leave this
// as a var and hope this won't break anything else, but it seems
// really fragile

// Each function here is called by the renderer every frame
ui.setData(lattice.data);
var physics = [verletController.velocityVerlet, verletController.updateState];

renderer = Graphics.Renderer;
renderer.setUI(ui);
renderer.setUpdates(physics);
renderer.setLattice(lattice);
renderer.setFPS(30);
renderer.setSpeed(1000);
renderer.ui = ui;
renderer.render();
