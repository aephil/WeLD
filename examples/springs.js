

    var worldHeight = 1000;
    var worldWidth = 1000;

    var svg = d3.select("body").append("svg")
      .attr("width", worldWidth)
      .attr("height",worldHeight);

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


    var yaxes = [
      {x:centreToScreenX(0), y:centreToScreenY(1000)},
      {x:centreToScreenX(0),y:centreToScreenY(-1000)},
      ]

    var xaxes = [

            {x:centreToScreenX(1000), y:centreToScreenY(0)},
            {x:centreToScreenX(-1000),y:centreToScreenY(0)},
    ]

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
        x:-80,
        y:0,
        r:10,
        m:5,
        left:-1,
        right:1,
        up:3,
        down:6,
        col:"blue",
      },
      {
        vx:0,
        x:0,
        y:0,
        r:10,
        m:5,
        left:0,
        right:2,
        up:4,
        down:7,
        col:"red",
      },
      {
        vx:0,
        x:80,
        y:0,
        r:10,
        m:5,
        left:1,
        right:-1,
        up:5,
        down:8,
        col:"green",
      },

      // up
      {
        vx:0,
        x:-80,
        y:80,
        r:10,
        m:5,
        left:-1,
        right:4,
        up:-1,
        down:0,
        col:"blue",
      },
      {
        vx:0,
        x:0,
        y:80,
        r:10,
        m:5,
        left:3,
        right:5,
        up:-1,
        down:1,
        col:"red",
      },
      {
        vx:0,
        x:80,
        y:80,
        r:10,
        m:5,
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
        m:5,
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
        m:5,
        left:6,
        right:8,
        up:1,
        down:-1,
        col:"red",
      },
      {
        vx:0,
        x:80,
        y:-80,
        r:10,
        m:5,
        left:8,
        right:-1,
        up:2,
        down:-1,
        col:"green",
      },
    ]

    edgesData = []
    var group1 = svg.append("g");
    var edges = group1.selectAll("path").data(edgesData);


    edges.enter()
    .append("path")

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
      .call(d3.drag()
      //.on("start", function(d))
      .on("drag", dragged))

      var frames  = 0
      var fps = 100
      var bondLen = 80
      var breakLen = 120
      var vib = 0.5

    d3.timer(function(duration){
      elapsed = (duration * 0.001).toFixed(2)
      bond.data(function(d){

        points.forEach(function(d){

          edgesData = []

          d.x += randomNumber(-vib,vib)
          d.y += randomNumber(-vib,vib)

          if(d.right > -1)
          {
            ext =  Math.abs(screenToCentreX(d.x) - screenToCentreX(points[d.right].x)) - bondLen

            a = (k * ext / d.m ).toFixed(2)
            d.x += 0.5*(0.5*a)
            points[d.right].x -= 0.5*(0.5*a)

            edgesData.push([
              {x:centreToScreenX(d.x), y:centreToScreenY(d.y)},
              {x:centreToScreenX(points[d.right].x), y:centreToScreenY(points[d.right].y)}
            ])
          }

          if(d.left > -1)
          {
            ext =  Math.abs(screenToCentreX(d.x) - screenToCentreX(points[d.left].x)) - bondLen
            a = (k * ext / d.m ).toFixed(2)
            d.x -= 0.5*(0.5*a)
            points[d.left].x += 0.5*(0.5*a)

            edgesData.push([
              {x:centreToScreenX(d.x), y:centreToScreenY(d.y)},
              {x:centreToScreenX(points[d.left].x), y:centreToScreenY(points[d.left].y)}
            ])
          }

          if(d.up > -1)
          {
            ext =  Math.abs(screenToCentreX(d.y) - screenToCentreX(points[d.up].y)) - bondLen
            a = (k * ext / d.m ).toFixed(2)
            d.y += 0.5*(0.5*a)
            points[d.up].y -= 0.5*(0.5*a)

            edgesData.push([
              {x:centreToScreenX(d.x), y:centreToScreenY(d.y)},
              {x:centreToScreenX(points[d.up].x), y:centreToScreenY(points[d.up].y)}
            ])
          }

          if(d.down > -1)
          {
            ext =  Math.abs(screenToCentreX(d.y) - screenToCentreX(points[d.down].y)) - bondLen
            a = (k * ext / d.m ).toFixed(2)
            d.y -= 0.5*(0.5*a)
            points[d.down].y += 0.5*(0.5*a)
            edgesData.push([
              {x:centreToScreenX(d.x), y:centreToScreenY(d.y)},
              {x:centreToScreenX(points[d.down].x), y:centreToScreenY(points[d.down].y)}
            ])
          }
        })
        console.log(edgesData)
        return points
      })

          if(elapsed > frames * (1/fps))
          {
            // vertices
            bond
              .enter()
              .selectAll("circle")
              .attr("cx",function(d){return centreToScreenX(d.x)})
              .attr("cy",function(d){return centreToScreenX(d.y)})
            frames += 1;
          }
        })
