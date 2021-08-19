

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


    var R = 20
    var bondLen = 100

    points = [
      // centre
      {
        cofr:1,
        vx:0,
        vy:0,
        vz:0,
        px:-bondLen/2,
        py:0,
        pz:0,
        r:R,
        m:5,
        neighbours:[1,3,6],
        col:"red",
        scale: function(){
          return zFactor(boxDepth,this.pz,zp);
        },
        ix: function(){
          return this.px * this.scale();
        },
        iy: function(){
          return this.py * this.scale();
        },
        ir: function(){
          return this.r * this.scale();
        },
      },

      {
        cofr:1,
        vx:0,
        vy:0,
        vz:0,
        px:bondLen/2,
        py:0,
        pz:0,
        r:R,
        m:5,
        neighbours:[0,2,4,7],
        col:"red",
        scale: function(){
          return zFactor(boxDepth,this.pz,zp);
        },
        ix: function(){
          return this.px * this.scale();
        },
        iy: function(){
          return this.py * this.scale();
        },
        ir: function(){
          return this.r * this.scale();
        },
      },

      {
        cofr:1,
        vx:0,
        vy:0,
        vz:0,
        px:bondLen,
        py:bondLen,
        pz:0,
        r:R,
        m:5,
        neighbours:[1,5,8],
        col:"red",
        scale: function(){
          return zFactor(boxDepth,this.pz,zp);
        },
        ix: function(){
          return this.px * this.scale();
        },
        iy: function(){
          return this.py * this.scale();
        },
        ir: function(){
          return this.r * this.scale();
        },
      },

      // up
      {
        cofr:1,
        vx:0,
        vy:0,
        vz:0,
        px:-bondLen,
        py:bondLen,
        pz:0,
        r:R,
        m:1,
        neighbours:[0,4],
        col:"red",
        scale: function(){
          return zFactor(boxDepth,this.pz,zp);
        },
        ix: function(){
          return this.px * this.scale();
        },
        iy: function(){
          return this.py * this.scale();
        },
        ir: function(){
          return this.r * this.scale();
        },
      },

      {
        cofr:1,
        vx:0,
        vy:0,
        vz:0,
        px:bondLen/2,
        py:bondLen,
        pz:0,
        r:R,
        m:1,
        neighbours:[3,5,1],
        col:"red",
        scale: function(){
          return zFactor(boxDepth,this.pz,zp);
        },
        ix: function(){
          return this.px * this.scale();
        },
        iy: function(){
          return this.py * this.scale();
        },
        ir: function(){
          return this.r * this.scale();
        },
      },
      {
        cofr:1,
        vx:0,
        vy:0,
        vz:0,
        px:bondLen,
        py:bondLen,
        pz:0,
        r:R,
        m:1,
        neighbours:[2,5],
        left:5,
        right:-1,
        up:-1,
        down:2,
        col:"red",
        scale: function(){
          return zFactor(boxDepth,this.pz,zp);
        },
        ix: function(){
          return this.px * this.scale();
        },
        iy: function(){
          return this.py * this.scale();
        },
        ir: function(){
          return this.r * this.scale();
        },
      },

      // down
      {
        cofr:1,
        vx:0,
        vy:0,
        vz:0,
        px:-bondLen/2,
        py:-bondLen,
        pz:0,
        r:R,
        m:1,
        neighbours:[0,7],
        left:-1,
        right:7,
        up:0,
        down:-1,
        col:"red",
        scale: function(){
          return zFactor(boxDepth,this.pz,zp);
        },
        ix: function(){
          return this.px * this.scale();
        },
        iy: function(){
          return this.py * this.scale();
        },
        ir: function(){
          return this.r * this.scale();
        },
      },
      {
        cofr:1,
        vx:0,
        vy:0,
        vz:0,
        px:20,
        py:-bondLen,
        pz:0,
        r:R,
        m:1,
        neighbours:[6,8,1],
        col:"red",
        scale: function(){
          return zFactor(boxDepth,this.pz,zp);
        },
        ix: function(){
          return this.px * this.scale();
        },
        iy: function(){
          return this.py * this.scale();
        },
        ir: function(){
          return this.r * this.scale();
        },
      },
      {
        cofr:1,
        vx:0,
        vy:0,
        vz:0,
        px:bondLen,
        py:-bondLen,
        pz:0,
        r:R,
        m:1,
        neighbours:[7,2],
        col:"red",
        scale: function(){
          return zFactor(boxDepth,this.pz,zp);
        },
        ix: function(){
          return this.px * this.scale();
        },
        iy: function(){
          return this.py * this.scale();
        },
        ir: function(){
          return this.r * this.scale();
        },
      },
    ]


    var bond = svg.selectAll("circle").data(points);

    var info = svg
      .append("text")
      .attr("x",screenToCentreX(boxCentreX*b))
      .attr("y", screenToCentreY((-boxCentreY-25)*b))
      .attr("fill","none")
      .attr("stroke","black");

      var tempInfo = svg
        .append("text")
        .attr("x",screenToCentreX(boxCentreX))
        .attr("y", screenToCentreY((-boxCentreY-45)))
        .attr("fill","none")
        .attr("stroke","black");

    function dragged(event, d) {

      bond.raise().attr("cx", d.px =  event.x - worldWidth/2).attr("cy", d.py = worldHeight/2 - event.y);
      }

    bond.enter()
      .append("circle")
      .attr("r",function(d){return d.ir()})
      .attr("cx",function(d){return centreToScreenX(d.ix())})
      .attr("cy", function(d){return centreToScreenY(d.iy())})
      .attr("fill", function(d){return d.col})
      .attr("stroke", "black")
      .call(
      d3.drag()
      .on("drag", dragged));


      var N = 9;
      var temperature = 0
      var dT = 0;
      var tempUpdated = false
      let dof = 2;
      var kinetic = 0

      var avgKinEn = (dof/2) * temperature // natural units

      var tempButtonUp = svg
        .append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("y",screenToCentreY(-boxCentreY-35))
        .attr("x",screenToCentreX(boxCentreX + 70))
        .attr("fill", "red")
        .on("click",
          function()
          {

              if(temperature<1000)
              {
                temperature += 1
                tempUpdated = true;
                console.log("heating up.")
                console.log("last temp: " + temperature.toString())
              }

          }
        )

        var tempButtonDown = svg
          .append("rect")
          .attr("width", 10)
          .attr("height", 10)
          .attr("y",screenToCentreY(-boxCentreY-35))
          .attr("x",screenToCentreX(boxCentreX + 85))
          .attr("fill", "blue")
          .on("click",
            function()
            {

                if(temperature>0)
                {
                  temperature -= 1

                  console.log("cooling down.")
                  console.log("last temp: " + temperature.toString())
                }
                else
                {

                  console.log("min temp reached")
                  console.log("last temp: " + temperature.toString())
                }

            }
          )

    var frames  = 0
    var fps = 10

    var breakLen = 1000
    var k = 0.5

    d3.timer(function(duration){
      elapsed = (duration * 0.001).toFixed(2)
      bond.data(function(d){

          edgesData = []
          kinetic = 0
          points.forEach(function(d)
          {
            //d.px += randomNumber(-vib,vib)
            //d.py += randomNumber(-vib,vib)

                var rnd = randomNumber(0,1);
                avgKinEn = (dof/2) * (temperature) * 0.634; // new target K.E
                var vsquared = avgKinEn * 2 / d.m;
                d.vx = rnd * Math.sqrt(vsquared) * (randomNumber(0,1) > 0.5 ? -1 : 1);
                d.vy = (1-rnd) * Math.sqrt(vsquared) * (randomNumber(0,1) > 0.5 ? -1 : 1);

            for(var i = 0; i < d.neighbours.length; i++)
            {
              var neighbour = d.neighbours[i]
              if(neighbour == null)
              {
                continue;
              }

              dx = Math.abs(d.px - points[neighbour].px).toFixed(2)
              dy = Math.abs(d.py - points[neighbour].py).toFixed(2)

              // extension
              ext = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2)) - bondLen
              if(ext>breakLen){
                delete d.neighbours[neighbour];
                continue;
              }

              contract = !(ext > 0);
              extY = dx < 0.001 ? 0 : ext * dy/bondLen
              extX = ext * dx/bondLen

              // fix one atom!

              directionX = contract ? (d.px < points[neighbour].px ? -1 : 1) : (d.px < points[neighbour].px ? 1 : -1)
              directionY = contract ? (d.py < points[neighbour].py ? -1 : 1) : (d.py < points[neighbour].py ? 1 : -1)

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
                points[neighbour].px += pxN

                d.py += py
                points[neighbour].py += pyN


              //inter-particle kinematics

              updateVerletP(d,0.01,0,0);
              //exchangeMomenta(d,points)

              //kinetic +=  0.5 * d.m * (Math.pow(d.vx,2) + Math.pow(d.vy,2));

              edgesData.push(
              [
                {x:centreToScreenX(d.ix()),y:centreToScreenY(d.iy())},
                {x:centreToScreenX(points[neighbour].ix()),y:centreToScreenY(  points[neighbour].iy())}
              ]
              )
            }
          })
        return points
      })

          if(elapsed > frames * (1/fps))
          {

            tempInfo.text(function () {return "T: " + temperature.toFixed(2) })
            bond
              .enter()
              .selectAll("circle")
              .attr("cx",function(d){
                return centreToScreenX(d.ix())
              })

              .attr("cy",function(d){
                return centreToScreenY(d.iy())
              })
            frames += 1;
            svg.selectAll("path").remove()
            edgesData.forEach(function(d){
              svg
              .append("path")
              .attr("stroke", "none")
              .attr("stroke-width", 1)
              .attr("d", lineFunction(d))
              .attr("fill", "none");
            })
          }
        })
