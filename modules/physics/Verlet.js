const Verlet = function(d, data) {
    const dt = 1e-1;

    // calculate total force acting on the node
    this.velocityVerlet = function(d, data) {
        d.forces.forEach(({ name, params, color }) => {
                actionFunction = Physics.ForceMap[name];
                const actions = actionFunction(d, data, params);
                actions.forEach( (action, i) => {
                    const [index, force] = action
                    const {x, y, z} = force;
                    const node = data[index]
                    // leapfrog step
                    const v_half = Physics.Vector.add(node.vi, Physics.Vector.scale(0.5 * (1 / node.m) * dt, force));
                    const rf = Physics.Vector.add(node.ri, Physics.Vector.scale(dt, v_half));

                    // construct a virtual node with ri = rf
                    // this will require a deep copy of the current node.
                    const node_deep_copy = JSON.parse(JSON.stringify(node));
                    node_deep_copy.ri = rf;
                    const future_force = actionFunction(node_deep_copy, data, params)[i][1];
                    const vf = Physics.Vector.add(v_half, Physics.Vector.scale(dt * 0.5 * (1 / node.m), future_force));

                    node.vf = vf
                    node.rf = rf
            })
        })
    }


    this.updateState = function(d, data) {
        d.ri = d.rf;
        d.vi = d.vf;
    }

}

Physics.Verlet = new Verlet();
