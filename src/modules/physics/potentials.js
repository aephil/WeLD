// F -dV/dx, therefore V = -int F dx
import {Vector} from './Vector.js';


export const testPotential = function(d, data, params) {
    return 0;
}

export const springPotential = function(d, data, params) {
    const [k, nodesLen, neighbourIndex] = params;
    const d2 = data[neighbourIndex];

    const dx = d.ri.x - d2.ri.x;
    const dy = d.ri.y - d2.ri.y;
    const dz = d.ri.z - d2.ri.z;

    const separation = { x: dx, y: dy, z: dz };
    const unitSeparation = Vector.unitVector(separation);

    const equilibrium = Vector.scale(nodesLen, unitSeparation);
    const extension = Vector.sub(separation, equilibrium);

    const V = 1/2 * k * Vector.norm(extension) ** 2;
    return V
}

export const valencePotential = function(d, data, params) {
    // This is only the potential from the central atom,
    // There is also a potential associated with the two
    // other atoms as a result of this interaction
    const [k, eqAngle, index1, index2] = params;
    const a = data[index1].ri;
    const b = d.ri; //central node
    const c = data[index2].ri;

    const ba = Vector.sub(a, b);
    const bc = Vector.sub(c, b);
    const cb = Vector.scale(-1, bc)

    const abc = Vector.angle(ba, bc);

    return k * (abc - eqAngle) ** 2;

    // TODO: Implement valence potential calculation properly.
    // The implementation of the valence force is shown below for
    // reference. For now, we just return zero.
    // const [k, eqAngle, index1, index2] = params;
    // const a = data[index1].ri;
    // const b = d.ri; //central node
    // const c = data[index2].ri;

    // const ba = Vector.sub(a, b);
    // const bc = Vector.sub(c, b);
    // const cb = Vector.scale(-1, bc)

    // const abc = Vector.angle(ba, bc);

    // const pa = Vector.normalise(Vector.cross(ba, Vector.cross(ba, bc)));
    // const pc = Vector.normalise(Vector.cross(cb, Vector.cross(ba, bc)));

    // let faFactor = (-1) * k * (abc - eqAngle) / (Vector.norm(ba));
    // faFactor = (isNaN(faFactor) ? 0 : faFactor);

    // const fa = Vector.scale(faFactor, pa);

    // let fcFactor = (-1) * k * (abc - eqAngle) / (Vector.norm(bc));
    // fcFactor = (isNaN(fcFactor) ? 0 : fcFactor);

    // const fc = Vector.scale(fcFactor, pc);
    // const fb = Vector.scale(-1, Vector.add(fa, fc));
    // return [[index1, fa], [d.id, fb], [index2, fc]];
}

export const lennardJonesPotential = function(d, data, params) {
    // This is only the potential of one of the atoms
    const [epsilon, sigma, neighbourIndex] = params;
    const a = d;
    const b = data[neighbourIndex];
    const ba = Vector.sub(a.ri, b.ri);
    const r = Vector.norm(ba);

    return 4 * epsilon * ((sigma / r) ** 12 - (sigma / r) ** 6);
}

export const potentials = {
    "testForce": testPotential,
    "spring": springPotential,
    "valenceAngle": valencePotential,
    "lennardJones": lennardJonesPotential
}
