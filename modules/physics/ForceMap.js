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
        return {x: 1, y: 1, z: 1};
    }

    this.spring = function(d, data, params) {
        // Copied with minor changes from physics/Harmonic.js

         const [k, nodesLen, neighbourIndex] = params
         const d2 = data[neighbourIndex];

         const dx = Math.abs(d.ri.x - d2.ri.x);
         const dy = Math.abs(d.ri.y - d2.ri.y);
         const dz = Math.abs(d.ri.z - d2.ri.z);

         const separation = {x: dx, y: dy, z: dz};
         const unitSeparation = Physics.Vector.unitVector(separation);

         const equilibrium = Physics.Vector.scale(nodesLen, unitSeparation);
         const extension = Physics.Vector.sub(separation, equilibrium);

         // begin debug here
         fx = -k * extension.x;
         fy = -k * extension.y;
         fz = -k * extension.z;

        return {x: fx, y: fy, z: fz};
        }

    this.forceMap = {
    "Test Force": this.testForce,
    "spring": this.spring
    }

    return this.forceMap;
}

Physics.Forcemap = new ForceMap();
