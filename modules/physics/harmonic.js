
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

        var a = {px:d.px,py:d.py,pz:d.pz}
        var b = {px:data[nIndex].px,py:data[nIndex].py,pz:data[nIndex].pz}
        var c = {px:data[nIndex2].px,py:data[nIndex2].py,pz:data[nIndex2].pz}

        //console.log(Physics.Vector.norm(Physics.Vector.cross(b,c)))
      }
    }

  }

    return this;
  }

Physics.Harmonic = new Harmonic();
