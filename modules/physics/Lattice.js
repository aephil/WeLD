var Lattice = function()
  {
    var nodeR = false;
    var nodeCol = false;
    var ui = false;
    var predicate = false;
    var showEdges = false;
    this.data = [];
    this.setShowEdges = function(bool){
      if(bool && ui){
        ui.logWarning("enabling edges may cause a significant hit to the frame rate.")
      }
      showEdges = bool;
    }

    this.showEdges = function(){return showEdges;}

    this.setUI = function(x)
    {
      // typescript to check type maybe?
      ui = x;
    }

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

    function makeBonds(data)
    {
      if(predicate)
      {
        var edgeCount = 0
        var angleCount = 0;
        for(k = 0; k < data.length; k++)
        {
          for(l = 0; l < data.length; l++)
          {
            if(predicate(data[k], data[l]))
            {
              // check l does not already consider k a neighbour
              if(!(hasNeighbour(data[l],data[k])))
              {
                data[k].neighbours.push([l, Physics.Vector.distance(data[k].ri,data[l].ri)]);
                edgeCount++;
              }
            }
          }
        }

        //calculate angles between neighbours
        data.forEach(
          function(node){
            for(let i = 0; i < node.neighbours.length; i++)
            {
              for(let j = i+1; j < node.neighbours.length; j++)
              {
                n1 = data[node.neighbours[i][0]];
                n2 = data[node.neighbours[j][0]];

                var vec1 = {x:(n1.x-node.x),y:(n1.y-node.y),z:(n1.z-node.z)};
                var vec2 = {x:(n2.x-node.x),y:(n2.y-node.y),z:(n2.z-node.z)};
                var angle = Physics.Vector.angle(vec1,vec2);
                node.valencePairs.push([node.neighbours[i][0], node.neighbours[j][0], angle]);
                angleCount++
            }
          }

        })

        if(ui)
        {
          ui.log("total of "+ui.colouredText(edgeCount,"blue")+" unique bonds (edges) were formed.");
          ui.log("total of "+ui.colouredText(angleCount,"blue")+" valence angle pairs were formed.");
        }

      } else {
        if(ui)
        {
          ui.log("No predicate for bonding was set; nodes are free.");
        }
      }
    }

    // returns true if node i considers node j a neighbour.
     this.hasNeighbour = function(i,j){
      return hasNeighbour(i,j);
    }

    this.makeFCC3D = function(cellsX, cellsY, cellsZ, a, sim)
    {
      this.data = []
      var counter=0;
      for(let h = 0; h < cellsZ; h++)
      {
        for(let i = 0; i < cellsX; i++)
            {
              for(let j = 0; j < cellsY; j++)
              {

                this.data.push(
                  {
                    ri:{x:(a * i) + (0.5 * a),y:(a * j),z:(a * h) + (0.5 * a)},
                    rf:{x:0,y:0,z:0},

                    // velocity
                    vi:{x:randomNumber(-0.01,0.01), y:randomNumber(-0.01,0.01), z:randomNumber(-0.01,0.01)},
                    vf:{x:0,y:0,z:0},

                    id:counter++,
                    r:5,  // radius
                    m:1,  // mass
                    name:"basic node",
                    neighbours:[], // index of other atoms
                    valencePairs:[],
                    showEdges:true,
                    visible: true,
                    stroke:"black",
                    edgeStroke:"black",
                    col:"rgb(173,172,173)", // colour
                  }
                )
              }
            }
          }

          if(ui)
          {
            ui.log("loaded"+ui.colouredText(" Face-Centred Cubic ","blue") +"lattice data with "+ui.colouredText(cellsX,"blue")+" x " +ui.colouredText(cellsY,"blue")+" x " +ui.colouredText(cellsZ,"blue")+" unit cells. Total of "+ui.colouredText(this.data.length,"blue")+" nodes.");
          }
          makeBonds(this.data);
    }

    this.makePrimitive3D = function(cellsX, cellsY, cellsZ, a)
    {
      this.data = []
      nodes = []
      var counter=0;
      for(h = 0; h < cellsZ; h++){
        for(i = 0; i < cellsX; i++)
        {
          for(j = 0; j < cellsY; j++)
          {

            this.data.push(
              {
                // displacement
                ri:{x:a * i,y:a * j,z:a * h},
                rf:{x:0,y:0,z:0},

                // velocity
                vi:{x:randomNumber(-0.1,0.1), y:randomNumber(-0.1,0.1), z:randomNumber(-0.1,0.1)},
                vf:{x:0,y:0,z:0},

                id:counter++,
                r:(nodeR?nodeR():5),  // radius
                m:1,  // mass
                name:"basic node",
                neighbours:[], // index of other atoms
                valencePairs:[],
                showEdges:true,
                visible: true,
                stroke:"black",
                edgeStroke:"black",
                col:(nodeCol?nodeCol():"orange"), // colour
              }
            )
          }
        }
      }

      // create bonds based on a given predicate

      if(ui)
      {
        ui.log("loaded"+ui.colouredText(" Primitive Cubic ","blue") +"lattice data with "+ui.colouredText(cellsX,"blue")+" x " +ui.colouredText(cellsY,"blue")+" x " +ui.colouredText(cellsZ,"blue")+" unit cells. Total of "+ui.colouredText(this.data.length,"blue")+" nodes.");
      }
      makeBonds(this.data);
    }

    this.makePerovskite3D = function(cellsX, cellsY, cellsZ, a, sim)
    {
      this.data = []
      var counter = 0;
      for(h=0; h < cellsZ; h++){
        for(i = 0; i < cellsX; i++)
        {
          for(j = 0; j < cellsY; j++)
          {

            // A cation

            this.data.push(
              {
                x:a * i, // position x
                y:a * j, // position y
                z:a * h, // position z

                vx:randomNumber(-0.01,0.01),
                vy:randomNumber(-0.01,0.01),
                vz:randomNumber(-0.01,0.01),

                id:counter++,
                r:(nodeR?nodeR():3),  // radius
                m:1,  // mass
                name:"A Cation",
                neighbours:[], // index of other atoms
                valencePairs:[],
                showEdges:true,
                visible: true,
                stroke:"black",
                edgeStroke:"black",
                col:(nodeCol?nodeCol():"blue"), // colour
              }
            )

            // B cation
            this.data.push(
              {
                x:(a * i) + (a * 0.5), // position x
                y:(a * j) + (a * 0.5), // position y
                z:(a * h) + (a * 0.5), // position z

                vx:randomNumber(-0.01,0.01),
                vy:randomNumber(-0.01,0.01),
                vz:randomNumber(-0.01,0.01),

                id:counter++,
                r:(nodeR?nodeR():5),  // radius
                m:1,  // mass
                name:"B Cation",
                neighbours:[], // index of other atoms
                valencePairs:[],
                showEdges:true,
                visible: true,
                stroke:"black",
                edgeStroke:"black",
                col:(nodeCol?nodeCol():"orange"), // colour
              }
            )

            // O anion

            this.data.push(
              {
                x:(a * i) + (a * 0.5), // position x
                y:(a * j) + (a * 0.5), // position y
                z:(a * h), // position z

                vx:randomNumber(-0.01,0.01),
                vy:randomNumber(-0.01,0.01),
                vz:randomNumber(-0.01,0.01),

                id:counter++,
                r:(nodeR?nodeR():5),  // radius
                m:1,  // mass
                name:"O Anion",
                neighbours:[], // index of other atoms
                valencePairs:[],
                showEdges:true,
                visible: true,
                stroke:"black",
                edgeStroke:"black",
                col:(nodeCol?nodeCol():"red"), // colour
              }
            )

            this.data.push(
              {
                x:(a * i) + (a * 0.5), // position x
                y:(a * j), // position y
                z:(a * h) + (a * 0.5), // position z

                vx:randomNumber(-0.01,0.01),
                vy:randomNumber(-0.01,0.01),
                vz:randomNumber(-0.01,0.01),

                id:counter++,
                r:(nodeR?nodeR():5),  // radius
                m:1,  // mass
                name:"O Anion",
                neighbours:[], // index of other atoms
                valencePairs:[],
                showEdges:true,
                visible: true,
                stroke:"black",
                edgeStroke:"black",
                col:(nodeCol?nodeCol():"red"), // colour
              }
            )

            this.data.push(
              {
                x:(a * i), // position x
                y:(a * j) + (a * 0.5), // position y
                z:(a * h) + (a * 0.5), // position z

                vx:randomNumber(-0.01,0.01),
                vy:randomNumber(-0.01,0.01),
                vz:randomNumber(-0.01,0.01),

                id:counter++,
                r:(nodeR?nodeR():5),  // radius
                m:1,  // mass
                name:"O Anion",
                neighbours:[], // index of other atoms
                valencePairs:[],
                showEdges:true,
                visible: true,
                stroke:"black",
                edgeStroke:"black",
                col:(nodeCol?nodeCol():"red"), // colour
              }
            )
          }
        }
      }

      // create bonds based on a given predicate

      if(ui)
      {
        ui.log("loaded"+ui.colouredText(" Perovskite Cubic ","blue") +"lattice data with "+ui.colouredText(cellsX,"blue")+" x " +ui.colouredText(cellsY,"blue")+" x " +ui.colouredText(cellsZ,"blue")+" unit cells. Total of "+ui.colouredText(this.data.length,"blue")+" nodes.");
      }
      makeBonds(this.data);

    }

   this.setPredicate = function(p){predicate = p}
// default draw call for renderer, (can use a custom one)
  }

Physics.Lattice = new Lattice();
