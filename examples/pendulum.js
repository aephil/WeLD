

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

    var edges = createCentredCube(boxWidth,zp);

    var boxColour = "rgba(0,0,0,1)";
    var boxStroke = "white";

    edges.slice(0,1).forEach(function(d){
      svg.append("path")
        .attr("d", lineFunction(d))
        .attr("stroke", boxStroke)
        .attr("stroke-width", 0.7)
        .attr("fill", boxColour);
    })

    var pendulumData = [
      {
        hx:0, // hinge x
        hy:boxHeight/2, //hinge y
        hz:0, // hinge z
        l: 500, //string length
        r:20,  // bob radius
        m:1,  // bob mass
        a:50, // amplitude
        rho:0, // z-y angle
        theta:3.14159,//randomNumber(-3.14159,3.14159), //x-y angle;
        freq:0,
        z:function(){
          return (this.hz + (this.l * Math.sin(this.rho)));
        },
        scale: function(){
          return zFactor(boxDepth,this.z(),zp);
        },
        ix: function(){
          return (this.hx + (this.l * Math.sin(this.theta))) * this.scale();
        },
        iy: function(){
          return (this.hy + (this.l * -Math.cos(this.theta))) * this.scale();
        },
        ir: function(){
          return this.r * this.scale();
        },
        s: function(){
            return [{x:centreToScreenX(this.hx*zFactor(boxDepth,this.hz,zp)),y:centreToScreenY(this.hy*zFactor(boxDepth,this.hz,zp))},{x:centreToScreenX(this.ix()),y:centreToScreenY(this.iy())}];
          }
      },
    ];

    var updateVerletAngularV = function(d, g, t){
      d.freq += (g/d.l)*Math.sin(d.theta)*t;
    }

    var updateVerletAngularP = function(d,g,t){
      d.theta += d.freq + (g/d.l)*Math.sin(d.theta)*Math.pow(t,2);
    }

    var group1 = svg.append("g");
    var string = group1.selectAll("path").data(pendulumData);
    var pendulum = d3.select("svg").selectAll("circle").data(pendulumData);

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
                updateVerletAngularV(d,g,interval);
                updateVerletAngularP(d,g,interval);
              }
              string
                .enter()
                .select("path")
                .merge(string)
                .attr("d", lineFunction(d.s()));
              pendulum
                .enter()
                .select("circle")
                .merge(pendulum)
                .attr("cx",function(d){return centreToScreenX(d.ix())})
                .attr("cy",function(d){return centreToScreenY(d.iy())})
                .attr("r", function(d){return d.ir()});
              timeInfo.text(function(){return "theta: " + (d.theta).toFixed(3)+ " rads"})
            }
          );
          return pendulumData;
        });

        return false;
      });
