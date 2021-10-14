
// Bonds ////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

var Harmonic = function(){

  var kSpring = 0 // Spring constant
  var kValence = 0
  var dt = 1; // timestep

  this.changeKSpring = function(n){
    kSpring = n;
  }

  this.changeKValence = function(n){
    kValence = n;
  }


  this.kSpring = function(){return kSpring}

  this.kValence = function(){return kValence}

  this.spring = function(d, data)
  {
    for(var i = 0; i < d.neighbours.length; i++)
    {

        var neighbour = d.neighbours[i]
        nodesLen = neighbour[1]; // node length between neighbour and particle
        nIndex = neighbour[0]; // index of neighbour in data

        dx = Math.abs(d.x - data[nIndex].x);
        dy = Math.abs(d.y - data[nIndex].y);
        dz = Math.abs(d.z - data[nIndex].z);

        // get unit vector of the(dx, dy, dz)
        vec = {x:dx,y:dy,z:dz};
        uVec = Physics.Vector.unitVector(vec);

        equilibrium = Physics.Vector.scale(nodesLen, uVec);



        x_i = Physics.Vector.sub(vec, equilibrium);

        f_i = Physics.Vector.v3(-kSpring*x_i.x, -kSpring*x_i.y, -kSpring*x_i.z)
        v_i = Physics.Vector.v3(d.vx, d.vy, d.vz);

        x_f = Physics.Vector.add(x_i, Physics.Vector.add( Physics.Vector.scale(dt,v_i) , Physics.Vector.scale(dt*dt*0.5*d.m,f_i)))
        v_half = Physics.Vector.add(v_i, Physics.Vector.scale(dt/(2*d.m), f_i));
        f_f = Physics.Vector.scale(-kSpring, x_f);
        v_f = Physics.Vector.add(v_half, Physics.Vector.scale(-kSpring*dt*0.5*d.m, x_f));

        // use calculated x_f to reposition datapoint x, y , z
        d.x += x_f.x;
        d.y += x_f.y;
        d.z += x_f.z;



  }
}

  this.valence = function(d, data)
  {
    for(var i = 0; i < d.valencePairs.length; i++)
    {

      var node1Idx = d.valencePairs[i][0];
      var node2Idx = d.valencePairs[i][1];
      var eqAngle = d.valencePairs[i][2];

      var a = Physics.Vector.makeV3(data[node1Idx]);
      var b = Physics.Vector.makeV3(d);//central node
      var c = Physics.Vector.makeV3(data[node2Idx]);

      var ba = Physics.Vector.sub(b,a);
      var bc = Physics.Vector.sub(b,c);

      var abc = Physics.Vector.angle(ba, bc);

      var pa = Physics.Vector.normalise(Physics.Vector.cross(ba,Physics.Vector.cross(ba,bc)));
      var pc = Physics.Vector.normalise(Physics.Vector.cross(bc,Physics.Vector.cross(ba,bc)));

      var faFactor = (-1)*kValence*(abc - eqAngle)/(Physics.Vector.norm(ba))
      faFactor = (isNaN(faFactor)? 0 : faFactor);

      var fa = Physics.Vector.scale(faFactor, pa);

      var fcFactor = (-1)*kValence*(abc - eqAngle)/(Physics.Vector.norm(bc))
      fcFactor = (isNaN(fcFactor)? 0 : fcFactor);

      var fc = Physics.Vector.scale(fcFactor, pc)
      var fb = Physics.Vector.scale(-1, Physics.Vector.add(fa, fc))

      data[node1Idx].x += 0.5*(fa.x/data[node1Idx].m);
      data[node1Idx].y += 0.5*(fa.y/data[node1Idx].m);
      data[node1Idx].z += 0.5*(fa.z/data[node1Idx].m);

      d.x += 0.5*(fb.x/d.m);
      d.y += 0.5*(fb.y/d.m);
      d.z += 0.5*(fb.z/d.m);

      data[node2Idx].x += 0.5*(fc.x/data[node2Idx].m)
      data[node2Idx].y += 0.5*(fc.y/data[node2Idx].m)
      data[node2Idx].z += 0.5*(fc.z/data[node2Idx].m)
    }
  }
    return this;
  }

Physics.Harmonic = new Harmonic();
