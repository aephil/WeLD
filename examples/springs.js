

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


    points = [
      {
        vx:0,
        x:-45,
        y:0,
        r:10,
        m:5,
        left:1,
        right:-1
      },
      {
        vx:0,
        x:40,
        y:0,
        r:10,
        m:5,
        left:-1,
        right:0,
      }
    ]

    var bond = svg.selectAll("circle").data(points);
    var k = 0.1

    var info = svg
      .append("text")
      .attr("x",screenToCentreX(boxCentreX*b))
      .attr("y", screenToCentreY((-boxCentreY-25)*b))
      .attr("fill","none")
      .attr("stroke","black");


    bond.enter()
      .append("circle")
      .attr("r",function(d){return d.r})
      .attr("cx",function(d){return centreToScreenX(d.x + d.lex + d.rex)})
      .attr("cy", function(d){return centreToScreenY(d.y)})
      .attr("fill", "red");

      var frames  = 0
      var fps = 1
      var bondLen = 80

    d3.timer(function(duration){
      elapsed = (duration * 0.001)
      bond.data(function(d){

        points.forEach(function(d){

          // update verlet v

          if(elapsed > frames * (1/fps))
          {
            if(d.left>0)
            {
              ext = Math.abs(bondLen - Math.abs(screenToCentreX(d.x) - screenToCentreX(points[d.left].x)))
              a = (k * ext / d.m )
              d.x += (0.5*a*elapsed*elapsed)


              info.text((a).toFixed(3) + ", "+ (ext).toFixed(3) +", "+ elapsed)
            }
            frames += 1
          }
            //d.vx = a * interval
        })

        return points
      })

      bond
        .enter()
        .selectAll("circle")
        .attr("cx",function(d){
          return centreToScreenX(d.x)})
    })


/*
    var updateVerletAngularVt = function(d, g, t){
      d.freq += (g/d.l)*Math.sin(d.theta)*t;
    }

    var updateVerletAngularPt = function(d,g,t){
      d.theta += d.freq + (g/d.l)*Math.sin(d.theta)*Math.pow(t,2);
    }

    var updateVerletAngularVr = function(d, g, t){
      d.freq += (g/d.l)*Math.sin(d.rho)*t;
    }

    var updateVerletAngularPr = function(d,g,t){
      d.theta += d.freq + (g/d.l)*Math.sin(d.rho)*Math.pow(t,2);
    }

    var group1 = svg.append("g");
    var string = group1.selectAll("path").data(pendulumData);
    var pendulum = svg.selectAll("circle").data(pendulumData);

    pendulum.enter()
      .append("circle")
      .attr("r",function(d){return d.ir()})
      .attr("cx",function(d){return centreToScreenX(d.ix())})
      .attr("cy", function(d){return centreToScreenY(d.iy())})
      .attr("fill", "red");

    string.enter()
      .append("path")
      .attr("stroke", "red")
      .attr("stroke-width", 1)
      .attr("fill", "none");

    var timeInfo = d3.select("svg")
      .append("text")
      .attr("x",screenToCentreX(boxCentreX*b))
      .attr("y", screenToCentreY((-boxCentreY-25)*b))
      .attr("fill","none")
      .attr("stroke","black");

      var g = -9.81;
      d3.timer( function(duration) {
        var interval = duration*0.0001;
        pendulum.data(function(d) {
          pendulumData.forEach(
            function (d,i,data){
              if(Math.abs(d.theta)>0.0001){
                updateVerletAngularVt(d,g,interval);
                updateVerletAngularPt(d,g,interval);

              }
              string
                .enter()
                .select("path")
                //.merge(string)
                .attr("d", lineFunction(d.s()));
              pendulum
                .enter()
                .select("circle")
              //  .merge(pendulum)
                .attr("cx",function(d){return centreToScreenX(d.ix())})
                .attr("cy",function(d){return centreToScreenY(d.iy())})
                .attr("r", function(d){return d.ir()});
              timeInfo.text(function(){return "theta: " + (d.theta).toFixed(3)+ " rads    rho: " + (d.theta).toFixed(3)+ " rads"})
            }
          );
          return pendulumData;
        });

        return false;
      });

    */
