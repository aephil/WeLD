
    var boxWidth = 800;
    var boxHeight = 800;
    var boxDepth = 800;
    var boxCentreX = -boxWidth/2; // in local coordinates
    var boxCentreY = boxHeight/2; // in local coordinates
    var particleSize = 20;
    var particleSizeMin = particleSize/4;

    // z-perspective value
    let zp = (2*boxDepth);

    var a = zFactor(boxDepth,boxDepth/2,zp);
    var b = zFactor(boxDepth,-boxDepth/2,zp);

    var leftBoxEdge = function(r){return -boxWidth/2 + r;}
    var rightBoxEdge = function(r){return boxWidth/2 - r;}

    var upperBoxEdge = function(r){return boxHeight/2 - r;}
    var lowerBoxEdge = function(r){return -boxHeight/2 + r;}

    var outerBoxEdge = function(r){return boxDepth/2 - r;}
    var innerBoxEdge = function(r){return (-boxDepth/2) + r;}

    var edges = createCentredCube(boxWidth,zp);

    var boxColour = "rgba(0,0,0,0)";
    var boxStroke = "black";

    var lineFunction = d3.line()
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; })

    edges.slice(0,5).forEach(function(d){
      circleWrapper.append("path")
        .attr("d", lineFunction(d))
        .attr("stroke", boxStroke)
        .attr("stroke-width", 0.7)
        .attr("fill", boxColour);
    })

    let N = 30;
    var data = new Array;

    for (var i = 0; i < N; i++){
      var n = {
        vx: randomNumber(-5,5),
        vy: randomNumber(-5,5),
        vz: randomNumber(-5,5),
        px: randomNumber(leftBoxEdge(particleSize), rightBoxEdge(particleSize)),
        py: randomNumber(upperBoxEdge(particleSize), lowerBoxEdge(particleSize)),
        pz: randomNumber(upperBoxEdge(particleSize), lowerBoxEdge(particleSize)),
        r: particleSize,
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

      }
      data.push(n);
    }

    var particleData = data;

		//Set up the circles
		var particle = circleWrapper.selectAll("circle")
			.data(particleData);

      particle
			.enter().append("circle")
			.style("fill", "red"/*function(d) { return randomColour(); }*/)
      .attr("r", function(d) { return 0})
      .attr("cy", function (d){ return screenToCentreY(d.iy())})
      .attr("cx", function (d){ return screenToCentreX(d.ix())})
			.attr("r", function(d) { return d.ir();})

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    var globalTime = 0;
    let dt = 0.1;
    let gx = 0//9.81*0.1
    let gy = 0//-0.001;
    let gz = 0//9.81*0.1;
    let cOfR = 1; // Coefficient of Restitution

// runs the simulation
var timer = d3.timer( function(duration) {
  //timer.stop()
  var interval = duration*0.1;

  particle.data(function(d) {
    particleData.forEach(
      function (d,i,data){
        updateVerletV(d,interval,gx,gy,gz);
        updateVerletP(d,interval,gx,gy,gz);

        var upperLim = upperBoxEdge(d.r);
        var lowerLim = lowerBoxEdge(d.r);
        var leftLim = leftBoxEdge(d.r);
        var rightLim = rightBoxEdge(d.r);
        var outerLim = outerBoxEdge(d.r);
        var innerLim = innerBoxEdge(d.r);

        if( d.py >= upperLim ) {
          d.py = upperLim;
          d.vy = -1*d.vy*cOfR;
        };

        if( d.py <= lowerLim ) {
          d.py = lowerLim ;

          d.vy = -1*d.vy*cOfR;
        };

        if( d.px <= leftLim ) {
          d.px = leftLim;

          d.vx = -1*d.vx*cOfR;
        };

        if( d.px >= rightLim ) {
          d.px = rightLim;
          d.vx = -1*d.vx*cOfR;
        };

        if( d.pz <= innerLim ) {
          d.vz = -1*d.vz*cOfR;
          d.pz = innerLim;
        };

        if( d.pz >= outerLim ) {
          d.vz = -1*d.vz*cOfR;
          d.pz = outerLim;
        };


      }
    );
    return particleData;
  });
  particle.enter().selectAll("circle")
    //.merge(particle)
    .attr("cy", function (d){ return screenToCentreY(d.iy()) })
    .attr("cx", function (d){ return screenToCentreX(d.ix())})
    .attr("r", function(d) {return d.ir();})
});
