var Lattice = function()
  {

    var nodeR = false;
    var nodeCol = false;
    var ui = false;
    var predicate = false;
    var showEdges = false;
    var data = [];
    var nodes = [];

    this.data = function(){return data};
    this.nodes = function(){return nodes};

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

          if(showEdges)
          {
            var newLine1 = document.createElementNS('http://www.w3.org/2000/svg','line');
            document.getElementById('sim').appendChild(newLine1);

            var newLine2 = document.createElementNS('http://www.w3.org/2000/svg','line');
            document.getElementById('sim').appendChild(newLine2);

            node.valencePairs.push([node.neighbours[i][0], node.neighbours[j][0], angle, newLine1, newLine2]);
          } else {
            node.valencePairs.push([node.neighbours[i][0], node.neighbours[j][0], angle]);
          }
        }
      }
    };

    function makeBonds(data)
    {
      if(predicate)
      {
        // form neighbours
        for(k = 0; k < data.length; k++)
        {
          for(l = 0; l < data.length; l++)
          {
            if(predicate(data[k], data[l]))
            {

              // check they are not already considered neighbours
              if(!(areNeighbours(data[k],data[l])))
              {
                data[k].neighbours.push([l, Physics.Vector.distance(data[k],data[l])]);
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

                if(showEdges)
                {
                  var newLine1 = document.createElementNS('http://www.w3.org/2000/svg','line');
                  document.getElementById('sim').appendChild(newLine1);

                  var newLine2 = document.createElementNS('http://www.w3.org/2000/svg','line');
                  document.getElementById('sim').appendChild(newLine2);

                  node.valencePairs.push([node.neighbours[i][0], node.neighbours[j][0], angle, newLine1, newLine2]);
                } else {
                  node.valencePairs.push([node.neighbours[i][0], node.neighbours[j][0], angle]);
                }
            }
          }
        })

      }
    }

    // returns true if node i considers node j a neighbour.
     this.hasNeighbour = function(i,j){
      return hasNeighbour(i,j);
    }

    this.makeFCC3D = function(cellsX, cellsY, cellsZ, a, sim)
    {
      for(let h = 0; h < cellsZ; h++)
      {
        for(let i = 0; i < cellsX; i++)
            {
              for(let j = 0; j < cellsY; j++)
              {

                data.push(
                  {
                    x:(a * i) + (0.5 * a), // position x
                    y:(a * j), // position y
                    z:(a * h) + (0.5 * a), // position z
                    r:5,  // radius
                    m:1,  // mass
                    name:"basic node",
                    neighbours:[], // index of other atoms
                    valencePairs:[],
                    showEdges:true,
                    stroke:"black",
                    col:"rgb(173,172,173)", // colour
                  }
                )

                data.push(
                  {
                    x: (a * i), // position x
                    y: (a * j) + (0.5 * a), // position y
                    z: (a * h) + (0.5 * a), // position z
                    r:5,  // radius
                    m:1,  // mass
                    name:"basic node",
                    neighbours:[],
                    valencePairs:[],
                    showEdges:true,
                    stroke:"black",
                    col:"rgb(173,172,173)", // colour
                  })

                data.push(
                  {
                    x:(a * i) + (0.5 * a), // position x
                    y:(a * j) + (0.5 * a), // position y
                    z:(a * h), // position z
                    r:5,  // radius
                    m:1,  // mass
                    name:"basic node",
                    neighbours:[],
                    valencePairs:[],
                    showEdges:true,
                    stroke:"black",
                    col:"rgb(173,172,173)", // colour
                  }
                )
              }
            }
          }

          makeBonds(data);

          if(ui)
          {
            ui.log("loaded" + ui.colouredText(" Face-Centered Cubic ","blue") +"lattice data with "+ui.colouredText(cellsX,"blue")+" x " +ui.colouredText(cellsY,"blue")+" x " +ui.colouredText(cellsZ,"blue")+" unit cells.");
            ui.log("total of "+ui.colouredText(data.length,"blue")+" nodes were formed.");
          }

          for(let i = 0; i < data.length; i++)
          {
            var newNode = document.createElementNS("http://www.w3.org/2000/svg", "circle");

            newNode.addEventListener("mouseover", function( event ) {
                Graphics.UserInterface.showTooltip(event,i);
              }, false);

            newNode.addEventListener("mouseout", function( event ) {
                Graphics.UserInterface.hideTooltip();
              }, false);

            newNode.addEventListener("mousedown", function( event ) {
              Graphics.UserInterface.highlight(event,i);
              }, false);

            newNode.setAttribute("idx",i);
            sim.appendChild(newNode);
            nodes.push(newNode);
          }

    }

    this.makePrimitive3D = function(cellsX, cellsY, cellsZ, a, sim)
    {
      data = []
      nodes = []
      for(h =0; h < cellsZ; h++){
        for(i = 0; i < cellsX; i++)
        {
          for(j = 0; j < cellsY; j++)
          {
            data.push(
              {
                x:a * i, // position x
                y:a * j, // position y
                z:a * h, // position z
                r:(nodeR?nodeR():5),  // radius
                m:1,  // mass
                name:"basic node",
                neighbours:[], // index of other atoms
                valencePairs:[],
                showEdges:true,
                stroke:"black",
                col:(nodeCol?nodeCol():"rgb(173,172,173)"), // colour
              }
            )
          }
        }
      }

      // create bonds based on a given predicate

      makeBonds(data);
      if(ui)
      {
        ui.log("loaded"+ui.colouredText(" Primitive Cubic ","blue") +"lattice data with "+ui.colouredText(cellsX,"blue")+" x " +ui.colouredText(cellsY,"blue")+" x " +ui.colouredText(cellsZ,"blue")+" unit cells.");
        ui.log("total of "+ui.colouredText(data.length,"blue")+" nodes were formed.");
      }

      for(let i = 0; i < data.length; i++)
      {
        var newNode = document.createElementNS("http://www.w3.org/2000/svg", "circle");

        newNode.addEventListener("mouseover", function( event ) {
            Graphics.UserInterface.showTooltip(event,i);
          }, false);

        newNode.addEventListener("mouseout", function( event ) {
            Graphics.UserInterface.hideTooltip();
          }, false);

        newNode.addEventListener("mousedown", function( event ) {
          Graphics.UserInterface.highlight(event,i);
          }, false);

        newNode.setAttribute("idx",i);
        sim.appendChild(newNode);
        nodes.push(newNode);
      }

    }

    this.makePerovskite3D = function(cellsX, cellsY, cellsZ, a, sim)
    {
      data = []
      nodes = []
      for(h=0; h < cellsZ; h++){
        for(i = 0; i < cellsX; i++)
        {
          for(j = 0; j < cellsY; j++)
          {

            // A cation

            var cornerXA = a * i
            var cornerYA = a * j
            var cornerZA = a * h

            data.push(
              {
                x:cornerXA, // position x
                y:cornerYA, // position y
                z:cornerZA, // position z

                r:(nodeR?nodeR():3),  // radius
                m:1,  // mass
                name:"A Cation",
                neighbours:[], // index of other atoms
                valencePairs:[],
                showEdges:true,
                stroke:"black",
                col:(nodeCol?nodeCol():"blue"), // colour
              }
            )

            // B cation

            var cornerXB = (a * i) + (a * 0.5)
            var cornerYB = (a * j) + (a * 0.5)
            var cornerZB = (a * h) + (a * 0.5)

            data.push(
              {
                x:cornerXB, // position x
                y:cornerYB, // position y
                z:cornerZB, // position z

                r:(nodeR?nodeR():5),  // radius
                m:1,  // mass
                name:"B Cation",
                neighbours:[], // index of other atoms
                valencePairs:[],
                showEdges:true,
                stroke:"black",
                col:(nodeCol?nodeCol():"orange"), // colour
              }
            )

            // O anion

            var cornerXO1 = (a * i) + (a * 0.5)
            var cornerYO1 = (a * j) + (a * 0.5)
            var cornerZO1 = (a * h)

            data.push(
              {
                x:cornerXO1, // position x
                y:cornerYO1, // position y
                z:cornerZO1, // position z

                r:(nodeR?nodeR():5),  // radius
                m:1,  // mass
                name:"O Anion",
                neighbours:[], // index of other atoms
                valencePairs:[],
                showEdges:true,
                stroke:"black",
                col:(nodeCol?nodeCol():"red"), // colour
              }
            )

            var cornerXO2 = (a * i) + (a * 0.5)
            var cornerYO2 = (a * j)
            var cornerZO2 = (a * h) + (a * 0.5)

            data.push(
              {
                x:cornerXO2, // position x
                y:cornerYO2, // position y
                z:cornerZO2, // position z

                r:(nodeR?nodeR():5),  // radius
                m:1,  // mass
                name:"O Anion",
                neighbours:[], // index of other atoms
                valencePairs:[],
                showEdges:true,
                stroke:"black",
                col:(nodeCol?nodeCol():"red"), // colour
              }
            )

            var cornerXO3 = (a * i)
            var cornerYO3 = (a * j) + (a * 0.5)
            var cornerZO3 = (a * h) + (a * 0.5)

            data.push(
              {
                x:cornerXO3, // position x
                y:cornerYO3, // position y
                z:cornerZO3, // position z

                r:(nodeR?nodeR():5),  // radius
                m:1,  // mass
                name:"O Anion",
                neighbours:[], // index of other atoms
                valencePairs:[],
                showEdges:true,
                stroke:"black",
                col:(nodeCol?nodeCol():"red"), // colour
              }
            )
          }
        }
      }

      // create bonds based on a given predicate
      makeBonds(data);

      if(ui)
      {
        ui.log("loaded" + ui.colouredText(" Perovskite ","blue") +"lattice data with "+ui.colouredText(cellsX,"blue")+" x " +ui.colouredText(cellsY,"blue")+" x " +ui.colouredText(cellsZ,"blue")+" unit cells.");
        ui.log("total of "+ui.colouredText(data.length,"blue")+" nodes were formed.");
      }

      for(let i = 0; i < data.length; i++)
      {
        var newNode = document.createElementNS("http://www.w3.org/2000/svg", "circle");

        newNode.addEventListener("mouseover", function( event ) {
            Graphics.UserInterface.showTooltip(event,i);
          }, false);

        newNode.addEventListener("mouseout", function( event ) {
            Graphics.UserInterface.hideTooltip();
          }, false);

        newNode.addEventListener("mousedown", function( event ) {
          Graphics.UserInterface.highlight(event,i);
          }, false);

        newNode.setAttribute("idx",i);
        sim.appendChild(newNode);
        nodes.push(newNode);
      }
    }

   this.setPredicate = function(p){predicate = p}
// default draw call for renderer, (can use a custom one)
  }

Physics.Lattice = new Lattice();
