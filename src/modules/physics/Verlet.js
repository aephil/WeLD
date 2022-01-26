import ForceMap from './ForceMap.js';
import Vector from './Vector.js';

const Verlet = function(d, shared) {
    const dt = 1e-1;

    const zeroForces = function(shared) {
        shared.nodes.forEach(d => {
            d.force = {x: 0, y: 0, z: 0};
        });
    }

    const zeroPotentials = function(shared) {
        shared.nodes.forEach(d => {
            d.potential = 0;
        })
    }

    const updateForces = function(shared) {
        zeroForces(shared);
        zeroPotentials(shared);

        shared.nodes.forEach(d => {
            d.forces.forEach(({ name, params, color }) => {
                const actionFunction = ForceMap[name];
                const actions = actionFunction(d, shared, params);
                actions.forEach((action, i) => {
                    const [index, force, potential] = action
                    const node = shared.nodes[index]
                    node.force = Vector.add(node.force, force);
                    node.potential += potential;
                })
            })
        })
    }

    this.integrationStep = function(shared) {
        // leapfrog step
        updateForces(shared);
        velocityVerlet1(shared);
        updateForces(shared);
        velocityVerlet2(shared);
    }

    // calculate total force acting on the node
    const velocityVerlet1 = function(shared) {
        // first part of velocity verlet algorithm
        shared.nodes.forEach(d => {
                d.vi = Vector.add(d.vi, Vector.scale(0.5 * dt, d.force));
                d.ri = Vector.add(d.ri, Vector.scale(dt, d.vi));
            });
    }

    const velocityVerlet2 = function(shared) {
        // second part of velocity verlet algorithm
        shared.nodes.forEach(d => {
            d.vi = Vector.add(d.vi, Vector.scale(0.5 * dt, d.force));
        })
    }
}

export const verlet = new Verlet();
export default verlet;
