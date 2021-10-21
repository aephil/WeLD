/*
Physics.Forcemap
This class stores all of the predefined forces that
velocityVerlet uses. The forces should all have the same function signature:
(d, data, params) => {forceX, forceY, forceZ), where
d is the data for one node, data is the data for all nodes, and params is an array
containing all the parameters necessary to compute the force, e.g. spring constants etc.
The forces should all the pure functions, i.e. they should not mutate any nodes or have side effects. They
should simply calculate the force and return it.
*/

const ForceMap = function () {
    this.testForce = function(d, data, params) {
        // just for testing purposes
        return {fx: 1, fy: 1, fz: 1};
    }

    this.harmonic = function(d, data, params) {
        // Copied with minor changes from physics/Harmonic.js
        [k] = params;
        let [fx, fy, fz] = [0, 0, 0];

        for (let i = 0; i < d.neighbours.length; i++) {
               const neighbour = d.neighbours[i];
               const neighbourIndex = neighbour[0];
               const d2 = data[neighbourIndex];
               
               const nodesLen = neighbour[1]; 

               const dx = Math.abs(d.ri.x - d2.ri.x);
               const dy = Math.abs(d.ri.y - d2.ri.y);
               const dz = Math.abs(d.ri.z - d2.ri.z);

               const separation = {x: dx, y: dy, z: dz};
               const unitSeparation = Physics.Vector.unitVector(separation);

               const equilibrium = Physics.Vector.scale(nodesLen, unitSeparation);
               const extension = Physics.Vector.sub(equilibrium, separation);

               // begin debug here

               fx -= k * extension.x;
               fy -= k * extension.y;
               fz -= k * extension.z;

            }

        return {fx: fx, fy: fy, fz: fz};
        }
    
    this.forceMap = {
    "Test Force": this.testForce,
    "Harmonic": this.harmonic
    }

    return this.forceMap;
}

Physics.Forcemap = new ForceMap();