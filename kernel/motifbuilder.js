function makePrimitive2D(numCellsX, numCellsY, a){
  points = []
  for(i = 0; i < numCellsX; i++)
  {

    for(j = 0; j < numCellsY; j++)
    {

      var cornerX = a * i
      var cornerY = a * j

      points.push(
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
  return points
}

function makeFCC2D(numCellsX, numCellsY, a, p = false){

  points = []
  for(i = 0; i < numCellsX; i++)
  {

    for(j = 0; j < numCellsY; j++)
    {

      var cornerX = a * i
      var cornerY = a * j

      points.push(
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

      points.push(
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
  for(k = 0; k < points.length; k++)
  {
    for(l = 0; l < points.length; l++)
    {
      if(p(points[k], points[l]))
      {
        points[k].neighbours.push([l, pointLen3D(points[k],points[l])])
        points[l].neighbours.push([k, pointLen3D(points[k],points[l])])
      }
    }
  }
}

  return points
}
