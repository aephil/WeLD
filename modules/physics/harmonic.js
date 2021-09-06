
// Springs ////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

// calculates the extension between two nodes and applies a force to each
// due to a spring constant k, modifying the nodes in data array.

var physics.calcExt = function(a, b)
{
  dx = Math.abs(a.px - b.px).toFixed(2)
  dy = Math.abs(a.py - b.py).toFixed(2)

  return 10
}

var physics.springPotentials = function(d, i){

    var neighbour = d.neighbours[i]
    nodesLen = neighbour[1]; // node length between neighbour and particle
    nIndex = neighbour[0]; // index of neighbour in points

    dx = Math.abs(d.px - points[nIndex].px).toFixed(2)
    dy = Math.abs(d.py - points[nIndex].py).toFixed(2)

    // extension
    // ext = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2)) - nodesLen
    console.log(this.calcExt())
    debugger;

    contract = !(ext > 0);
    extY = dx < 0.001 ? 0 : ext * dy/nodesLen
    extX = ext * dx/nodesLen

    // fix one atom!

    directionX = contract ? (d.px < points[nIndex].px ? -1 : 1) : (d.px < points[nIndex].px ? 1 : -1)
    directionY = contract ? (d.py < points[nIndex].py ? -1 : 1) : (d.py < points[nIndex].py ? 1 : -1)

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
      points[nIndex].px += pxN

      d.py += py
      points[nIndex].py += pyN

    //inter-particle kinematics
    updateVerletP(d,0.01,0,0);
    //exchangeMomenta(d,points)

    //kinetic +=  0.5 * d.m * (Math.pow(d.vx,2) + Math.pow(d.vy,2));

     edgesData.push(
     [
       {
         x1:centreToScreenX(d.px),
         y1:centreToScreenY(d.py),
         x2:centreToScreenX(points[nIndex].px),
         y2:centreToScreenY(points[nIndex].py)
       }
     ]
    )


  }
