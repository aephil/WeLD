import ForceMap from './ForceMap.js';
import Vector from './Vector.js';

const Verlet = function(d, data) {
    const dt = 1e-1;

    const zeroForces = function(data) {
        data.forEach(d => {
            d.force = {x: 0, y: 0, z: 0};
        });
    }

    const updateForces = function(data) {
        zeroForces(data);
        data.forEach(d => {
            d.forces.forEach(({ name, params, color }) => {
                const actionFunction = ForceMap[name];
                const actions = actionFunction(d, data, params);
                actions.forEach((action, i) => {
                    const [index, force] = action
                    const node = data[index]
                    node.force = Vector.add(node.force, force);
                })
            })
        })
    }

    this.integrationStep = function(data) {
        // leapfrog step
        updateForces(data);
        velocityVerlet1(data);
        updateForces(data);
        velocityVerlet2(data);
    }

    // calculate total force acting on the node
    const velocityVerlet1 = function(data) {
        // first part of velocity verlet algorithm
        data.forEach(d => {
                d.vi = Vector.add(d.vi, Vector.scale(0.5 * dt, d.force));
                d.ri = Vector.add(d.ri, Vector.scale(dt, d.vi));
            });
    }

    const velocityVerlet2 = function(data) {
        // second part of velocity verlet algorithm
        data.forEach(d => {
            d.vi = Vector.add(d.vi, Vector.scale(0.5 * dt, d.force));
        })
    }
}

export const verlet = new Verlet();
export default verlet;
