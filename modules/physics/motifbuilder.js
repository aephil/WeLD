

var Lattice = {

  makePrimitive2D: function(numCellsX, numCellsY, a, p){
    _points = []
    _edgesData = []
    for(i = 0; i < numCellsX; i++)
    {

      for(j = 0; j < numCellsY; j++)
      {

        var cornerX = a * i
        var cornerY = a * j

        _points.push(
          {
            vx:0, // velocity x
            vy:0, // velocity y
            vz:0, // velocity z

            x:cornerX, // position x
            y:cornerY, // position y
            z:1, // position z

            r:5,  // radius
            m:5,  // mass

            neighbours:[], // index of other atoms
            col:"white", // colour
          }
        )
      }
    }

    // create bonds based on a given predicate
  if(p!=false)
  {
    for(k = 0; k < _points.length; k++)
    {
      for(l = 0; l < _points.length; l++)
      {
        if(p(_points[k], _points[l]))
        {
          _edgesData.push(
            {
              x1:_points[l].x,
              y1:_points[l].y,
              x2:_points[k].x,
              y2:_points[k].y
            }
          )
          _points[k].neighbours.push([l, pointLen3D(_points[k],_points[l])])
          _points[l].neighbours.push([k, pointLen3D(_points[k],_points[l])])
        }
      }
    }
  }
    return [_points , _edgesData]
  },

  makeFCC2D: function(numCellsX, numCellsY, a, p = false){

    _points = []
    _edgesData = []

    for(i = 0; i < numCellsX; i++)
    {
      for(j = 0; j < numCellsY; j++)
      {

        var cornerX = a * i
        var cornerY = a * j

        _points.push(
          {
            isonLattice: true,
            vx:0.1, // velocity x
            vy:0.3, // velocity y
            vz:0.4, // velocity z

            x:cornerX, // position x
            y:cornerY, // position y
            z:1, // position z

            r:5,  // radius
            m:1,  // mass

            neighbours:[], // index of other atoms
            col:"white", // colour
          }
        )

        _points.push(
          {
            isonLattice: false,
            vx:0, // velocity x
            vy:0, // velocity y
            vz:0, // velocity z

            x:cornerX + (a*0.5) , // position x
            y:cornerY + (a*0.5), // position y
            z:1, // position z

            r:5,  // radius
            m:1,  // mass

            neighbours:[], // index of other atoms
            col:"white", // colour
          }
        )
      }
    }

    // create bonds based on a given predicate
  if(p!=false)
  {
    for(k = 0; k < _points.length; k++)
    {
      for(l = 0; l < _points.length; l++)
      {
        if(p(_points[k], _points[l]))
        {
          _edgesData.push(
            {
              x1:_points[l].x,
              y1:_points[l].y,
              x2:_points[k].x,
              y2:_points[k].y
            }
          )
          _points[k].neighbours.push([l, Physics.Vector.distance(_points[k],_points[l])])
          _points[l].neighbours.push([k, Physics.Vector.distance(_points[k],_points[l])])
        }
      }
    }
  }
    return [_points , _edgesData]
  },

  draw: function(parent, data)
 {

   var handle = parent.selectAll("circle").data(data);
   handle
   .enter()
   .append("circle")
   .attr("r",function(d){return d.r})
   .attr("cx",function(d){return centreToScreenX(d.x, simWidth)})
   .attr("cy", function(d){return centreToScreenY(d.y, simHeight)})
   .attr("fill", function(d){return d.col})
   .attr("stroke", "black")

   return handle;
 }
}
