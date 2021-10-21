const Verlet = function(d, data)
{
  const dt = 1e-1;

  // calculate total force acting on the node
  this.velocityVerlet = function(d, data){

  // TODO: implement forces due to a potential to get total force on a node.
    let fi = {x:0, y:0, z:0};

    d.forces.forEach(({name, params, color}) => {
      force = Physics.Forcemap[name];
      const {x, y, z} = force(d, data, params);
      fi.x += x;
      fi.y += y;
      fi.z += z;
    })

    // leapfrog step
    const v_half = Physics.Vector.add(d.vi, Physics.Vector.scale(0.5*(1/d.m)*dt, fi));
    const rf = Physics.Vector.add(d.ri, Physics.Vector.scale(dt, v_half));
    const vf = Physics.Vector.add(v_half,Physics.Vector.scale(dt*0.5*(1/d.m),fi));

    d.vf = vf
    d.rf = rf
}

this.updateState = function(d,data){
    d.ri = d.rf;
    d.vi = d.vf;
}

}

Physics.Verlet = new Verlet();
