var Verlet = function(d, data)
{
  dt = 1//

  // calculate total force acting on the node
  this.velocityVerlet = function(d, data){

  // TODO: implement forces due to a potential to get total force on a node.
  fi = {x:0, y:0, z:0};
  /*
  d.forces.forEach((f_data) => {

    //  f_data takes form
    //  [0] string: name of force.
    //  [1] array: containing array(s) with interaction metadata (depending on function call):

    //      e.g. function call spring will have structure

    //      [0] a neighbouring node
    //      [1] the equilibrium distance between target and the neighbouring node
    //      [2] the spring constant for this interaction

    //      one such for each neighbour...

    //      function call valenceAngle will have the structure

    //      [0] neighbouring node a
    //      [1] neighbouring node c
    //      [2] equilibrium angle of node abc (where b is the target node)
    //      [3] the angular spring constant for this interaction

    //      one such for each valence angle pair...
    //  [2] colour to show force

    //  each function may interpret a command-string such as
    //  spring

    var fn = physicsMap.get(f_data[0]);
    var f = fn(node, data);
    fi.x += f.x;
    fi.y += f.y;
    fi.z += f.z;
  });
*/

  var v_half = Physics.Vector.add(d.vi, Physics.Vector.scale(0.5*(1/d.m)*dt, fi));
  var rf = Physics.Vector.add(d.ri, Physics.Vector.scale(dt, v_half));
  var vf = Physics.Vector.add(v_half,Physics.Vector.scale(dt*0.5*(1/d.m),fi));

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
