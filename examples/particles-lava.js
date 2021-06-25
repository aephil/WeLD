
			///////////////////////////////////////////////////////////////////////////
			//////////////////// Set up and initiate svg containers ///////////////////
			///////////////////////////////////////////////////////////////////////////


      var worldHeight = 1000;
      var worldWidth = 1000;

			//SVG container
			var svg = d3.select('#chart')
				.append("svg")
				.attr("width", worldWidth)
				.attr("height", worldHeight)
				.append("g")

			///////////////////////////////////////////////////////////////////////////
			///////////////////////////// Create filter ///////////////////////////////
			///////////////////////////////////////////////////////////////////////////

			//SVG filter for the gooey effect
			//Code taken from http://tympanus.net/codrops/2015/03/10/creative-gooey-effects/
			var defs = svg.append("defs");
			var filter = defs.append("filter").attr("id","gooeyCodeFilter");
			filter.append("feGaussianBlur")
				.attr("in","SourceGraphic")
				.attr("stdDeviation","10")
				//to fix safari: http://stackoverflow.com/questions/24295043/svg-gaussian-blur-in-safari-unexpectedly-lightens-image
				.attr("color-interpolation-filters","sRGB")
				.attr("result","blur");
			filter.append("feColorMatrix")
				.attr("in","blur")
				.attr("mode","matrix")
				.attr("values","1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9")
				.attr("result","gooey");
			//If you want the end shapes to be exactly the same size as without the filter
			//add the feComposite below. However this will result in a less beautiful gooey effect
			//filter.append("feBlend")
				//.attr("in","SourceGraphic")
				//.attr("in2","gooey");
			//Instead of the feBlend, you can do feComposite. This will also place a sharp image on top
			//But it will result in smaller circles
			//filter.append("feComposite") //feBlend
			// 	.attr("in","SourceGraphic")
			// 	.attr("in2","gooey")
			// 	.attr("operator","atop");

		///////////////////////////////////////////////////////////////////////////
		/////////////////////////// Create circles ////////////////////////////////
		///////////////////////////////////////////////////////////////////////////


		//Create a wrapper for the circles that has the Gooey effect applied to it
		var circleWrapper = svg.append("g")
			.style("filter", "url(#gooeyCodeFilter)");

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////


    var boxWidth = 500;
    var boxHeight = 500;
    var boxDepth = 500;
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

    let N = 50;
    var data = new Array;

    for (var i = 0; i < N; i++){
      var n = {
        vx: randomNumber(-10,10),
        vy: randomNumber(-10,10),
        vz: randomNumber(-10,10),
        px: randomNumber(leftBoxEdge(particleSize), rightBoxEdge(particleSize)),
        py: randomNumber(upperBoxEdge(particleSize), lowerBoxEdge(particleSize)),
        pz: randomNumber(upperBoxEdge(particleSize), lowerBoxEdge(particleSize)),
        r: randomNumber(10,50),
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
    let gy = 0// -9.81;
    let gz = 0//9.81*0.1;
    let cOfR = 0.7; // Coefficient of Restitution

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
