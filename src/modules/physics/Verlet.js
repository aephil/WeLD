import ForceMap from './ForceMap.js';
import Vector from './Vector.js';

const Verlet = function(d, lattice) {
    const dt = 1e-1;

    const zeroForces = function(lattice) {
        lattice.data.forEach(d => {
            d.force = {x: 0, y: 0, z: 0};
        });
    }

    const zeroPotentials = function(lattice) {
        lattice.data.forEach(d => {
            d.potential = 0;
        })
    }

    const updateForces = function(lattice) {
        zeroForces(lattice);
        zeroPotentials(lattice);

        lattice.data.forEach(d => {
            d.forces.forEach(({ name, params, color }) => {
                const actionFunction = ForceMap[name];
                const actions = actionFunction(d, lattice, params);
                actions.forEach((action, i) => {
                    const [index, force, potential] = action
                    const node = lattice.data[index]
                    node.force = Vector.add(node.force, force);
                    node.potential += potential;
                })
            })
        })
    }

    this.integrationStep = function(lattice) {
        // leapfrog step
        updateForces(lattice);
        velocityVerlet1(lattice);
        updateForces(lattice);
        velocityVerlet2(lattice);
    }

    // calculate total force acting on the node
    const velocityVerlet1 = function(lattice) {
        // first part of velocity verlet algorithm
        lattice.data.forEach(d => {
                d.vi = Vector.add(d.vi, Vector.scale(0.5 * dt, d.force));
                d.ri = Vector.add(d.ri, Vector.scale(dt, d.vi));
            });
    }

    const velocityVerlet2 = function(lattice) {
        // second part of velocity verlet algorithm
        lattice.data.forEach(d => {
            d.vi = Vector.add(d.vi, Vector.scale(0.5 * dt, d.force));
        })
    }
}

export const verlet = new Verlet();
export default verlet;
