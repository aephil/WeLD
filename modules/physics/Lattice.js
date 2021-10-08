var Lattice = function()
  {

    this.terminalObj = false;
    var predicate = false;

    // returns true if node i considers node j a neighbour.
     function hasNeighbour(i,j){
      i.neighbours.forEach(function(el){
        if(j[0]==el[0]){return true};
      })
      return false;
    }

    function areNeighbours(i,j)
    {
      return hasNeighbour(i,j) || hasNeighbour(j,i);
    };

    function calcNeighbourAngles(node, data)
    {
      for(let i = 0; i < node.neighbours.length; i++)
      {
        for(let j = i+1; j < node.neighbours.length; j++)
        {
          n1 = data[node.neighbours[i][0]];
          n2 = data[node.neighbours[j][0]];

          var vec1 = {x:(n1.x-node.x),y:(n1.y-node.y),z:(n1.z-node.z)};
          var vec2 = {x:(n2.x-node.x),y:(n2.y-node.y),z:(n2.z-node.z)};
          var angle = Physics.Vector.angle(vec1,vec2);

          node.valencePairs.push([node.neighbours[i][0],node.neighbours[j][0],angle]);
        }
      }
    };

    function makeBonds(data)
    {
      for(k = 0; k < data.length; k++)
      {
        for(l = 0; l < data.length; l++)
        {
          if(predicate(data[k], data[l]))
          {
            // check they are not already considered neighbours
            if(!(areNeighbours(data[k],data[l])))
            {
              _edgesData.push(
                [
                  {x:data[l].x,y:data[l].y},
                  {x:data[k].x,y:data[k].y}
                ]
              )
              _points[k].neighbours.push([l, Physics.Vector.distance(_points[k],_points[l])]);
            }
          }
        }
      }
    }

    // returns true if node i considers node j a neighbour.
     this.hasNeighbour = function(i,j){
      return hasNeighbour(i,j);
    }

    this.makePrimitive2D = function(cellsX, cellsY, a)
    {
        _points = []
        _edgesData = []
        for(i = 0; i < cellsX; i++)
        {
          for(j = 0; j < cellsY; j++)
          {
            var cornerX = a * i
            var cornerY = a * j

            _points.push(
              {
                x:cornerX, // position x
                y:cornerY, // position y
                z:1, // position z

                r:5,  // radius
                m:5,  // mass

                neighbours:[], // index of other atoms
                valencePairs:[],
                col:"black", // colour
              }
            )
          }
        }

        // create bonds based on a given predicate
        if(predicate!=false)
        {
          makeBonds(_points);
          _points.forEach(function(node){calcNeighbourAngles(node,_points)})
        }
        if(terminalObj)
        {
          terminalObj.log("total of "+_edgesData.length+" bonds were formed.");
          terminalObj.log("total of "+_points.length+" nodes were formed.");
        }
        return [_points , _edgesData]
      }

    this.makeFCC2D = function(cellsX, cellsY, a)
    {
      _points = []
      _edgesData = []

      for(i = 0; i < cellsX; i++)
      {
        for(j = 0; j < cellsY; j++)
        {

          var cornerX = a * i
          var cornerY = a * j

          _points.push(
            {
              x:cornerX, // position x
              y:cornerY, // position y
              z:1, // position z

              r:5,  // radius
              m:1,  // mass

              neighbours:[], // index of other atoms
              valencePairs:[],
              col:"black", // colour
            }
          )

          _points.push(
            {
              x:cornerX + (a*0.5) , // position x
              y:cornerY + (a*0.5), // position y
              z:1, // position z

              r:5,  // radius
              m:1,  // mass

              neighbours:[],
              valencePairs:[],
              col:"black", // colour
            }
          )
        }
      }

      // create bonds based on a given predicate
      if(predicate!=false)
      {
        makeBonds(_points);
        _points.forEach(function(node){calcNeighbourAngles(node,_points)})
      }
      if(terminalObj)
      {
        terminalObj.log("total of "+_edgesData.length+" bonds were formed.");
        terminalObj.log("total of "+_points.length+" nodes were formed.");
      }

      return [_points , _edgesData]
    }

    this.makePrimitive3D = function(cellsX, cellsY, cellsZ, a)
    {
      _points = []
      _edgesData = []
      for(h =0; h < cellsZ; h++){
        for(i = 0; i < cellsX; i++)
        {
          for(j = 0; j < cellsY; j++)
          {
            var cornerX = a * i
            var cornerY = a * j
            var cornerZ = a * h

            _points.push(
              {
                x:cornerX, // position x
                y:cornerY, // position y
                z:cornerZ, // position z

                r:1,  // radius
                m:5,  // mass

                neighbours:[], // index of other atoms
                valencePairs:[],
                col:"black", // colour
              }
            )
          }
        }
      }

      // create bonds based on a given predicate
      if(predicate!=false)
      {
        makeBonds(_points);
        _points.forEach(function(node){calcNeighbourAngles(node,_points)})
      }
      if(terminalObj)
      {
        terminalObj.log("total of "+_edgesData.length+" bonds were formed.");
        terminalObj.log("total of "+_points.length+" nodes were formed.");
      }
      return [_points , _edgesData]

    }

   this.setPredicate = function(p){predicate = p}

  }

Physics.Lattice = new Lattice();
