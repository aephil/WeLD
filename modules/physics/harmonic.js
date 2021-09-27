
// Bonds ////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

var Harmonic = function(){

  var k = 1 // Spring constant

  this.changeK = function(n){
    k = n;
  }

  this.k = function(){return k}

  this.bond = function(d, data)
  {
    for(var i = 0; i < d.neighbours.length; i++)
    {

        var neighbour = d.neighbours[i]
        nodesLen = neighbour[1]; // node length between neighbour and particle
        nIndex = neighbour[0]; // index of neighbour in data

        dx = Math.abs(d.x - data[nIndex].x);
        dy = Math.abs(d.y - data[nIndex].y);
        dz = Math.abs(d.z - data[nIndex].z);

        // get unit vector of the vector (dx, dy, dz)
        vec = {x:dx,y:dy,z:dz};
        uVec = Physics.Vector.unitVector(vec);

        equilibrium = Physics.Vector.scale(nodesLen, uVec);
        extVec = Physics.Vector.sub(equilibrium, vec);

        //contract = !(ext > 0);
        extY = extVec.y
        extX = extVec.x
        extZ = extVec.z

        // fix one atom!

        //directionX = contract ? (d.x < data[nIndex].x ? -1 : 1) : (d.x < data[nIndex].x ? 1 : -1)
        //directionY = contract ? (d.y < data[nIndex].y ? -1 : 1) : (d.y < data[nIndex].y ? 1 : -1)

        ax = (k * extX / d.m )
        ay = (k * extY / d.m )
        az = (k * extZ / d.m )


        var x = (0.5*ax)
        var xN = x * (-1)

        var y = (0.5*ay)
        var yN = y * (-1)

        var z = (0.5*az)
        var zN = z * (-1)


        d.x += x
        data[nIndex].x += xN

        d.y += y
        data[nIndex].y += yN

        d.z += z
        data[nIndex].z += zN

    }
  }

  this.valence = function(d, data)
  {
    for(var i = 0; i < d.neighbours.length; i++)
    {
      var neighbour = d.neighbours[i]
      nodesLen = neighbour[1]; // node length between neighbour and particle
      nIndex = neighbour[0]; // index of neighbour in data

      // need to compare angles between common neighbours
      for(var j = 0; j < d.neighbours.length; j++)
      {
        if(i===j){continue;}

        var neighbour2 = d.neighbours[j];
        nodesLen2 = neighbour2[1]; // node length between neighbour and particle
        nIndex2 = neighbour2[0]; // index of neighbour in data

        var a = Physics.Vector.makeV3(data[nIndex]);
        var b = Physics.Vector.makeV3(d);
        var c = Physics.Vector.makeV3(data[nIndex2]);

        var ba = Physics.Vector.sub(b,a);
        var bc = Physics.Vector.sub(b,c);

        var abc = Physics.Vector.angle(ba, bc);

        if(abc===0 || abc===Math.PI*2){continue;}

        var pa = Physics.Vector.normalise(Physics.Vector.cross(ba,Physics.Vector.cross(ba,bc)));
        var pc = Physics.Vector.normalise(Physics.Vector.cross(bc,Physics.Vector.cross(ba,bc)));


        abc = (isNaN(abc)? 0 : abc);
        var theta = Math.PI / 2;

        var faFactor = (-1)*k*(abc - theta)/(Physics.Vector.norm(ba))
        faFactor = (isNaN(faFactor)? 0 : faFactor);
        var fa = Physics.Vector.scale(faFactor, pa);

        var fcFactor = (-1)*k*(abc - theta)/(Physics.Vector.norm(bc))
        fcFactor = (isNaN(fcFactor)? 0 : fcFactor);
        var fc = Physics.Vector.scale(fcFactor, pc)
        var fb = Physics.Vector.scale(-1, Physics.Vector.add(fa, fc))

        // scaling by 500 at the moment is for test purposes
        // so that it is visible in the animation. TODO: fix this

        data[nIndex].x += 10*(fa.x/data[nIndex].m);
        data[nIndex].y += 10*(fa.y/data[nIndex].m);
        data[nIndex].z += 10*(fa.z/data[nIndex].m);

        d.x += 10*(fb.x/d.m)
        d.y += 10*(fb.y/d.m)
        d.z += 10*(fb.z/d.m)

        data[nIndex2].x += 10*(fc.x/data[nIndex2].m)
        data[nIndex2].y += 10*(fc.y/data[nIndex2].m)
        data[nIndex2].z += 10*(fc.z/data[nIndex2].m)

      }
    }

  }

    return this;
  }

Physics.Harmonic = new Harmonic();
