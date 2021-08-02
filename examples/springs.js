

    var worldHeight = 1000;
    var worldWidth = 1000;

    var svg = d3.select("body").append("svg")
      .attr("width", worldWidth)
      .attr("height",worldHeight);

      var edgesData = []
      var g = svg.append("g")
      var edges = g.selectAll("path");

    // Z direction INTO screen

    let boxWidth = 800;
    let boxHeight = 800;
    let boxDepth = 800;
    let boxCentreX = -boxWidth/2; // in local coordinates
    let boxCentreY = boxHeight/2; // in local coordinates

    // centred coordinates of the perspective point
    var xp = screenToCentreX(0);
    var yp = screenToCentreY(0);
    let zp = (2*boxDepth);

    // coordinates of box edges
    var leftBoxEdge = function(r){return -boxWidth/2 + r;}
    var rightBoxEdge = function(r){return boxWidth/2 - r;}

    var upperBoxEdge = function(r){return boxHeight/2 - r;}
    var lowerBoxEdge = function(r){return -boxHeight/2 + r;}

    var outerBoxEdge = function(r){return boxDepth/2 - r;}
    var innerBoxEdge = function(r){return (-boxDepth/2) + r;}

    var lineFunction = d3.line()
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; });

    var a = (1-((boxDepth)/Math.abs((boxDepth/2)-zp)));
    var b = (1-((boxDepth)/Math.abs((-boxDepth/2)-zp)));



/*
    svg.append("path")
      .attr("d", lineFunction(xaxes))
      .attr("stroke", "black")
      .attr("stroke-width", 0.7)
      .attr("fill", "none");

    svg.append("path")
      .attr("d", lineFunction(yaxes))
      .attr("stroke", "black")
      .attr("stroke-width", 0.7)
      .attr("fill", "none");

*/


    points = [
      // centre
      {
        vx:0,
        x:-20,
        y:0,
        r:10,
        m:5,
        neighbours:[1,3,6,4,7],
        col:"blue",
      },

      {
        vx:0,
        x:20,
        y:0,
        r:10,
        m:5,
        neighbours:[0,2,4,7,5,8],
        col:"red",
      },

      {
        vx:0,
        x:80,
        y:0,
        r:10,
        m:5,
        neighbours:[1,5,8],
        col:"green",
      },

      // up
      {
        vx:0,
        x:-80,
        y:80,
        r:10,
        m:1,
        neighbours:[0,4],
        col:"blue",
      },

      {
        vx:0,
        x:0,
        y:80,
        r:10,
        m:1,
        neighbours:[3,5,1],
        col:"red",
      },
      {
        vx:0,
        x:80,
        y:80,
        r:10,
        m:1,
        neighbours:[2,5],
        left:5,
        right:-1,
        up:-1,
        down:2,
        col:"green",
      },

      // down
      {
        vx:0,
        x:-80,
        y:-80,
        r:10,
        m:1,
        neighbours:[0,7],
        left:-1,
        right:7,
        up:0,
        down:-1,
        col:"blue",
      },
      {
        vx:0,
        x:0,
        y:-80,
        r:10,
        m:1,
        neighbours:[6,8,1],
        col:"red",
      },
      {
        vx:0,
        x:80,
        y:-80,
        r:10,
        m:1,
        neighbours:[8,2],
        col:"green",
      },

    ]



    var bond = svg.selectAll("circle").data(points);
    var k = 1

    var info = svg
      .append("text")
      .attr("x",screenToCentreX(boxCentreX*b))
      .attr("y", screenToCentreY((-boxCentreY-25)*b))
      .attr("fill","none")
      .attr("stroke","black");

    function dragged(event, d) {
      bond.raise().attr("cx", d.x = event.x).attr("cy", d.y = event.y);
      }

    bond.enter()
      .append("circle")
      .attr("r",function(d){return d.r})
      .attr("cx",function(d){return centreToScreenX(d.x + d.lex + d.rex)})
      .attr("cy", function(d){return centreToScreenY(d.y)})
      .attr("fill", function(d){return d.col})
      .call(
      d3.drag()
      .on("drag", dragged));

    var frames  = 0
    var fps = 30
    var bondLen = 24
    var breakLen = 100
    var vib = 1

    d3.timer(function(duration){
      elapsed = (duration * 0.001).toFixed(2)
      bond.data(function(d){

          edgesData = []

          points.forEach(function(d)
          {
            d.x += randomNumber(-vib,vib)
            d.y += randomNumber(-vib,vib)

            for(var i = 0; i < d.neighbours.length; i++)
            {
              var neighbour = d.neighbours[i]
              if(neighbour == null)
              {
                continue;
              }
              dx = Math.abs(d.x - points[neighbour].x).toFixed(2)
              dy = Math.abs(d.y - points[neighbour].y).toFixed(2)

              // extension
              ext = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2)) - bondLen
              if(ext>breakLen){
                delete d.neighbours[neighbour];
                continue;
              }

              contract = ext > 0 ? false : true;

              extY = dx < 0.001 ? 0 : ext * Math.sin(dy/dx)
              extX = ext * Math.cos(dx/bondLen)

              directionX = contract ? (d.x < points[neighbour].x ? -1 : 1) : (d.x < points[neighbour].x ? 1 : -1)
              directionY = contract ? (d.y < points[neighbour].y ? -1 : 1) : (d.y < points[neighbour].y ? 1 : -1)

              ax = (k * Math.abs(extX).toFixed(2) / d.m ).toFixed(2)
              ay = (k * Math.abs(extY).toFixed(2) / d.m ).toFixed(2)

              d.x += (0.5*ax) * directionX
              points[neighbour].x += (0.5*ax) * (-1 * directionX)

              d.y += (0.5*ay) * directionY
              points[neighbour].y += (0.5*ay) * (-1 * directionY)

              edgesData.push(
              [
                {x:centreToScreenX(d.x),y:centreToScreenY(-d.y)},
                {x:centreToScreenX(points[neighbour].x),y:centreToScreenY(  -points[neighbour].y)}]
              )
            }
          })

        return points
      })

          if(elapsed > frames * (1/fps))
          {
            // vertices
            bond
              .enter()
              .selectAll("circle")
              .attr("cx",function(d){return centreToScreenX(d.x)})
              .attr("cy",function(d){return centreToScreenY(-d.y)})
            frames += 1;

            svg.selectAll("path").remove()
            edgesData.forEach(function(d){
              svg
              .append("path")
              .attr("stroke", "blue")
              .attr("stroke-width", 1)
              .attr("d", lineFunction(d))
              .attr("fill", "none");
            })
          }
        })
