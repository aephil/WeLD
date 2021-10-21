const Verlet = function(d, data)
{
  const dt = 1e-1;

  // calculate total force acting on the node
  this.velocityVerlet = function(d, data){

  // TODO: implement forces due to a potential to get total force on a node.
    let fi = {x:0, y:0, z:0};

    d.forces.forEach(({name, params, color}) => {
      force = Physics.Forcemap[name];
      const {fx, fy, fz} = force(d, data, params);
      fi.x += fx;
      fi.y += fy;
      fi.z += fz;
    })
  
    // leapfrog step
    const v_half = Physics.Vector.add(d.vi, Physics.Vector.scale(0.5*(1/d.m)*dt, fi));
    const rf = Physics.Vector.add(d.ri, Physics.Vector.scale(dt, v_half));
    const vf = Physics.Vector.add(v_half,Physics.Vector.scale(dt*0.5*(1/d.m),fi));

    d.vf = vf
    d.rf = rf
}

this.updateState = function(d,data){
  // maybe we can rely on error being suffieciently
  // small with small dt, and do this as we update each node in method velocotyVerlet.
  // If you have a chain of node interactions, however, the later nodes will stack in error.
  // this is why i think it is better we update the whole state once we know the displacement/velocity
  // of the whole state.
    d.ri = d.rf;
    d.vi = d.vf;

}

}

Physics.Verlet = new Verlet();
