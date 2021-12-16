/*
Physics.Forcemap
This class stores all of the predefined forces that
velocityVerlet uses. The forces should all have the same function signature:
(d, data, params) =>
[
[index1, {x: force1x, y: force1y, z: force1z}],
[index2, {x: force2x, y: force2y, z: force2z],
...
]
i.e. it should return a list of 2-tuples (arrays) containing the index
of the node the force should act on as well as the actual force.
d is the data for one node, data is the data for all nodes, and params is an array
containing all the parameters necessary to compute the force, e.g. spring constants etc.
The forces should all the pure functions, i.e. they should not mutate any nodes or have side effects. They
should simply calculate the force and return it.
*/

// Reference for potentials/forces:
// https://hal-mines-paristech.archives-ouvertes.fr/hal-00924263/document

import Vector from './Vector.js';

export const testForce = function(d, data, params) {
            // just for testing purposes
            return [[d.id, { x: 100, y: 100, z: 0 }]]
        };

export const spring = function(d, data, params) {
            const [k, nodesLen, neighbourIndex] = params;
            const d2 = data[neighbourIndex];

            const dx = d.ri.x - d2.ri.x;
            const dy = d.ri.y - d2.ri.y;
            const dz = d.ri.z - d2.ri.z;

            const separation = { x: dx, y: dy, z: dz };
            const unitSeparation = Vector.unitVector(separation);

            const equilibrium = Vector.scale(nodesLen, unitSeparation);
            const extension = Vector.sub(separation, equilibrium);

            const fx = -k * extension.x;
            const fy = -k * extension.y;
            const fz = -k * extension.z;

            //debugging

            return [[d.id, { x: fx, y: fy, z: fz }]]
        };

export const valenceAngle = function(d, data, params) {
            const [k, eqAngle, index1, index2] = params;
            var a = data[index1].ri;
            var b = d.ri; //central node
            var c = data[index2].ri;

            var ba = Vector.sub(a, b);
            var bc = Vector.sub(c, b);
            var cb = Vector.scale(-1, bc)

            var abc = Vector.angle(ba, bc);

            var pa = Vector.normalise(Vector.cross(ba, Vector.cross(ba, bc)));
            var pc = Vector.normalise(Vector.cross(cb, Vector.cross(ba, bc)));

            var faFactor = (-1) * k * (abc - eqAngle) / (Vector.norm(ba));
            faFactor = (isNaN(faFactor) ? 0 : faFactor);

            var fa = Vector.scale(faFactor, pa);

            var fcFactor = (-1) * k * (abc - eqAngle) / (Vector.norm(bc));
            fcFactor = (isNaN(fcFactor) ? 0 : fcFactor);

            var fc = Vector.scale(fcFactor, pc);
            var fb = Vector.scale(-1, Vector.add(fa, fc));
            return [[index1, fa], [d.id, fb], [index2, fc]];
        };

export const lennardJones = function(d, data, params) {
            const [epsilon, sigma, neighbourIndex] = params;
            const a = d;
            const b = data[neighbourIndex];
            const ba = Vector.sub(a.ri, b.ri);
            const r = Vector.norm(ba);
            const u = Vector.normalise(ba);
            const faMagnitude = 24 * epsilon / r
                * (2 * (sigma / r) ** 12 - (sigma / r) ** 6)
            const fa = Vector.scale(faMagnitude, u);
            const fb = Vector.scale(-1, fa);

            return [[a.id, fa], [b.id, fb]];
        }
export const forceMap = {
            "testForce": testForce,
            "spring": spring,
            "valenceAngle": valenceAngle,
            "lennardJones": lennardJones
        };

export const initValence = function(lattice, k = 1) {
    /*
    Performs the necessary initial setup for the Physics.Forcemap.valenceAngle method
    */
    lattice.data.forEach((d1) => {
        d1.forces.forEach((f1) => {
            if (f1.name == "spring") {
                let index1 = f1.params[2]
                let d2 = lattice.data[index1];
                d1.forces.forEach((f2) => {
                    let index2 = f2.params[2]
                    if (f2.name == "spring" && index2 != index1) {
                        let d3 = lattice.data[index2];
                        // calculate their equilibrium angles
                        let vec1 = Vector.sub(d3.ri, d1.ri);
                        let vec2 = Vector.sub(d2.ri, d1.ri);
                        let eqAngle = Vector.angle(vec1, vec2)
                        d1.forces.push(
                            {
                                name: "valenceAngle",
                                params: [k, eqAngle, index1, index2]
                            }
                        )
                    }
                });
            }
        });

    });

}

export default forceMap;
