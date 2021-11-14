const Verlet = function(d, data) {
    const dt = 1e-1;

    // add a single one time only force, and do a single velocityVerlet step;
    var addForceByVV = function(d,force){

    }

    // calculate total force acting on the node
    this.velocityVerlet = function(d, data) {

        d.forces.forEach(({ name, params, color }) => {
                force = Physics.ForceMap[name];
                const actions = force(d, data, params);
                actions.forEach(action => {
                    const [index, force] = action
                    const {x, y, z} = force;
                    const node = data[index]
                    // leapfrog step
                    const v_half = Physics.Vector.add(node.vi, Physics.Vector.scale(0.5 * (1 / node.m) * dt, force));
                    const rf = Physics.Vector.add(node.ri, Physics.Vector.scale(dt, v_half));
                    const vf = Physics.Vector.add(v_half, Physics.Vector.scale(dt * 0.5 * (1 / node.m), force));

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
