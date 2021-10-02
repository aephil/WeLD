var Lattice = function()
  {
    var predicate = false;

    function areNeighbours(i,j,data)
    {
      var node1 = data[i];
      var node2 = data[j];
      node1.neighbours.forEach(function(neighbour){
        if(neighbour[0]===j){  console.log("here!1"); return true;};

      })
      node2.neighbours.forEach(function(neighbour){
        if(neighbour[0]===i){   console.log("here!2"); return true;};
      })
      return false;
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
            if(!(areNeighbours(k,l,data)))
            {

              _edgesData.push(
                [
                  {x:data[l].x,y:data[l].y},
                  {x:data[k].x,y:data[k].y}
                ]
              )
              _points[k].neighbours.push([l, Physics.Vector.distance(_points[k],_points[l])]);

              //_points[l].neighbours.push([k, Physics.Vector.distance(_points[k],_points[l])]);
            }
          }
        }
      }
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
        return [_points , _edgesData]
      }

    this.draw = function(parent, data)
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

   this.setPredicate = function(p){predicate = p}

  }

Physics.Lattice = new Lattice();

/*
var Lattice = {

  areNeighbours:function(i,j,data){
    var node1 = data[i];
    var node2 = data[j];
    node1.neighbours.forEach(function(neighbour){
      if(neighbour[0]===j){  console.log("here!1"); return true;};

    })
    node2.neighbours.forEach(function(neighbour){
      if(neighbour[0]===i){   console.log("here!2"); return true;};
    })
    return false;
  },

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
            col:"black", // colour
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
          // check they are not already considered neighbours
          if(!(this.areNeighbours(k,l,_points)))
          {

            _edgesData.push(
              {
                x:_points[l].x,
                y:_points[l].y,
              }
            )

            _edgesData.push(
              {
                x:_points[k].x,
                y:_points[k].y
              })
              for(m = 0; m < _points.length)
            _points[k].neighbours.push([l, Physics.Vector.distance(_points[k],_points[l])]);
            //_points[l].neighbours.push([k, Physics.Vector.distance(_points[k],_points[l])]);
          }
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
            col:"black", // colour
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

            neighbours:[],
            col:"black", // colour
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
          // check they are not already considered neighbours
          if(!(this.areNeighbours(k,l,_points)))
          {
            _edgesData.push(
              {
                x:_points[l].x,
                y:_points[l].y,
              }
            )

            _edgesData.push(
              {
                x:_points[k].x,
                y:_points[k].y
              })

            _points[k].neighbours.push([l, Physics.Vector.distance(_points[k],_points[l])]);
            //_points[l].neighbours.push([k, Physics.Vector.distance(_points[k],_points[l])]);
          }

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
*/
