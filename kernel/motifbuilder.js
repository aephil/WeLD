function makePrimitive2D(numCellsX, numCellsY, a){
  _points = []
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

          px:cornerX, // position x
          py:cornerY, // position y
          pz:0, // position z

          r:10,  // radius
          m:5,  // mass

          neighbours:[], // index of other atoms
          col:"red", // colour
        }
      )
    }
  }
  return _points
}

function makeFCC2D(numCellsX, numCellsY, a, p = false){

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
          vx:0, // velocity x
          vy:0, // velocity y
          vz:0, // velocity z

          px:cornerX, // position x
          py:cornerY, // position y
          pz:0, // position z

          r:5,  // radius
          m:1,  // mass

          neighbours:[], // index of other atoms
          col:"red", // colour
        }
      )

      _points.push(
        {
          isonLattice: false,
          vx:0, // velocity x
          vy:0, // velocity y
          vz:0, // velocity z

          px:cornerX + (a*0.5) , // position x
          py:cornerY + (a*0.5), // position y
          pz:0, // position z

          r:5,  // radius
          m:1,  // mass

          neighbours:[], // index of other atoms
          col:"red", // colour
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
            x1:_points[l].px,
            y1:_points[l].py,
            x2:_points[k].px,
            y2:_points[k].py
          }
        )
        _points[k].neighbours.push([l, pointLen3D(_points[k],_points[l])])
        _points[l].neighbours.push([k, pointLen3D(_points[k],_points[l])])
      }
    }
  }
}
  return [_points , _edgesData]
}
