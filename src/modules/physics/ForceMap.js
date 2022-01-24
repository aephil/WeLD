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

export const testForce = function(d, lattice, params) {
            // just for testing purposes
            const force = { x: 100, y: 100, z: 0 };
            const potential = -100 * d.ri.x - 100 * d.ri.y;
            return [[d.id, force, potential]]
        };

export const spring = function(d, lattice, params) {
            const [k, nodesLen, neighbourIndex] = params;
            const d2 = lattice.data[neighbourIndex];

            const dx = d.ri.x - d2.ri.x;
            const dy = d.ri.y - d2.ri.y;
            const dz = d.ri.z - d2.ri.z;

            const separation = { x: dx, y: dy, z: dz };
            const unitSeparation = Vector.unitVector(separation);

            const equilibrium = Vector.scale(nodesLen, unitSeparation);
            const extension = Vector.sub(separation, equilibrium);

            const fx = -2 * k * extension.x;
            const fy = -2 * k * extension.y;
            const fz = -2 * k * extension.z;
            const force = {x: fx, y: fy, z: fz};

            // We return only the potential on one atom,
            // we are only returning the force on one atom.
            // Since the potential on both atoms is the same,
            // we can just return half the potential of the sytem
            const potential = k / 2 * Vector.norm(extension) ** 2;
            return [[d.id, force, potential]]
        };

export const valenceAngle = function(d, lattice, params) {
            const [k, eqAngle, index1, index2] = params;
            const a = lattice.data[index1].ri;
            const b = d.ri; //central node
            const c = lattice.data[index2].ri;

            const ba = Vector.sub(a, b);
            const bc = Vector.sub(c, b);
            const cb = Vector.scale(-1, bc)

            const abc = Vector.angle(ba, bc);

            const pa = Vector.normalise(Vector.cross(ba, Vector.cross(ba, bc)));
            const pc = Vector.normalise(Vector.cross(cb, Vector.cross(ba, bc)));

            let faFactor = (-2) * k * (abc - eqAngle) / (Vector.norm(ba));
            faFactor = (isNaN(faFactor) ? 0 : faFactor);

            const fa = Vector.scale(faFactor, pa);

            let fcFactor = (-2) * k * (abc - eqAngle) / (Vector.norm(bc));
            fcFactor = (isNaN(fcFactor) ? 0 : fcFactor);

            const fc = Vector.scale(fcFactor, pc);
            const fb = Vector.scale(-1, Vector.add(fa, fc));

            const potential = k * (abc - eqAngle) ** 2;

    return [
        [index1, fa, potential / 3],
        [d.id, fb, potential /3],
        [index2, fc, potential /3]];
        };

export const lennardJones = function(d, lattice, params) {
            const [epsilon, sigma, neighbourIndex] = params;
            const a = d;
            const b = lattice.data[neighbourIndex];
            const ba = Vector.sub(a.ri, b.ri);
            const r = Vector.norm(ba);
            const u = Vector.normalise(ba);
            const faMagnitude = 24 * epsilon / r
                * (2 * (sigma / r) ** 12 - (sigma / r) ** 6)
            const fa = Vector.scale(faMagnitude, u);
            const fb = Vector.scale(-1, fa);

            const potential = 4 * epsilon * ((sigma / r) ** 12 - (sigma / r) ** 6)

    return [
        [a.id, fa, potential / 2],
        [b.id, fb, potential / 2]
    ];
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
                const index1 = f1.params[2]
                const d2 = lattice.data[index1];
                d1.forces.forEach((f2) => {
                    const index2 = f2.params[2]
                    if (f2.name == "spring" && index2 != index1) {
                        const d3 = lattice.data[index2];
                        // calculate their equilibrium angles
                        const vec1 = Vector.sub(d3.ri, d1.ri);
                        const vec2 = Vector.sub(d2.ri, d1.ri);
                        const eqAngle = Vector.angle(vec1, vec2)
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
