
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

        dx = Math.abs(d.px - data[nIndex].px).toFixed(2)
        dy = Math.abs(d.py - data[nIndex].py).toFixed(2)

        // extension
        ext = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2)) - nodesLen

        contract = !(ext > 0);
        extY = dx < 0.001 ? 0 : ext * dy/nodesLen
        extX = ext * dx/nodesLen

        // fix one atom!

        directionX = contract ? (d.px < data[nIndex].px ? -1 : 1) : (d.px < data[nIndex].px ? 1 : -1)
        directionY = contract ? (d.py < data[nIndex].py ? -1 : 1) : (d.py < data[nIndex].py ? 1 : -1)

        ax = (k * Math.abs(extX).toFixed(2) / d.m ).toFixed(2)
        ay = (k * Math.abs(extY).toFixed(2) / d.m ).toFixed(2)

        var px = (0.5*ax) * directionX
        var pxN = (0.5*ax) * (-1 * directionX)

        // new image dx
        var idx = Math.abs(px - pxN)

        var py = (0.5*ay) * directionY
        var pyN = (0.5*ay) * (-1 * directionY)

        // new image dy
        var idy = Math.abs(py - pyN)

        // new image distance between
        var id = Math.sqrt(Math.pow(idx,2) + Math.pow(idy,2))

        d.px += px
        data[nIndex].px += pxN

        d.py += py
        data[nIndex].py += pyN

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

        var neighbour2 = d.neighbours[j]
        nodesLen2 = neighbour2[1]; // node length between neighbour and particle
        nIndex2 = neighbour2[0]; // index of neighbour in data

        var a = Physics.Vector.makeV3(data[nIndex])
        var b = Physics.Vector.makeV3(d)
        var c = Physics.Vector.makeV3(data[nIndex2])

        var ba = Physics.Vector.sub(b,a);
        var bc = Physics.Vector.sub(b,c);

        var pa = Physics.Vector.normalise(Physics.Vector.cross(ba,Physics.Vector.cross(ba,bc)))
        var pc = Physics.Vector.normalise(Physics.Vector.cross(bc,Physics.Vector.cross(ba,bc)))

        var abc = Physics.Vector.angle(ba, bc);
        abc = (isNaN(abc)? 0 : abc);
        var theta = Math.PI / 2;

        var faFactor = (-1)*k*(abc - theta)/(Physics.Vector.norm(ba))
        faFactor = (isNaN(faFactor)? 0 : faFactor);
        var fa = Physics.Vector.scale(faFactor, pa)

        var fcFactor = (-1)*k*(abc - theta)/(Physics.Vector.norm(bc))
        fcFactor = (isNaN(fcFactor)? 0 : fcFactor);
        var fc = Physics.Vector.scale(fcFactor, pc)

        var fb = Physics.Vector.scale(-1, Physics.Vector.add(fa, fc))

        console.log("1: "+data[nIndex].px)

        // scaling by 500 at the moment is for test purposes
        // so that it is visible in the animation. TODO: fix this

        data[nIndex].px += 500*(fa.px/data[nIndex].m);
        data[nIndex].py += 500*(fa.py/data[nIndex].m);
        data[nIndex].pz += 500*(fa.pz/data[nIndex].m);

        console.log("2: "+data[nIndex].px)


        d.px += 500*(fb.px/d.m)
        d.py += 500*(fb.py/d.m)
        d.pz += 500*(fb.pz/d.m)

        data[nIndex2].px += 500*(fc.px/data[nIndex2].m)
        data[nIndex2].py += 500*(fc.py/data[nIndex2].m)
        data[nIndex2].pz += 500*(fc.pz/data[nIndex2].m)

      }
    }

  }

    return this;
  }

Physics.Harmonic = new Harmonic();
