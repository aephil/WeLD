var worldHeight = 1000;
var worldWidth = 1000;

var svg = d3.select("body").append("svg")
  .attr("width", worldWidth)
  .attr("height",worldHeight);

// Z direction INTO screen

var boxWidth = 1000;
var boxHeight = 1000;
var boxDepth = 1000;
var boxCentreX = -boxWidth/2; // in local coordinates
var boxCentreY = boxHeight/2; // in local coordinates
var particleSize = 20;
var particleSizeMin = particleSize/4;

// z-perspective value
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

var a = zFactor(boxDepth,boxDepth/2,zp);
var b = zFactor(boxDepth,-boxDepth/2,zp);

var edges = createCentredCube(boxWidth,zp);

var boxColour = "black";
var boxStroke = "white";

edges.slice(0,5).forEach(function(d){
  svg.append("path")
    .attr("d", lineFunction(d))
    .attr("stroke", boxStroke)
    .attr("stroke-width", 0.7)
    .attr("fill", boxColour);
})

let N = 4;
var data = new Array;
for (var i = 0; i < N; i++){
  var n = {
    vx: 5,
    vy: 0,
    vz: 0,
    px: -boxWidth/2 + (i*80),
    py: 0,//-boxHeight/2 + (i*20),
    pz: boxDepth/4,
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
    m: 1,
  }
  data.push(n);
}

var particleData = data;
particleData.slice(-1)[0].vx = 5;
var particle = d3.select("svg").selectAll("circle").data(particleData);

particle.enter().append("circle")
  .attr("cy", function (d){ return screenToCentreY(d.py)})
  .attr("cx", function (d){ return screenToCentreX(d.px)})
  .attr("r",particleSize)
  .attr("stroke","black")
  .attr("fill","yellow");

var timeInfo = d3.select("svg")
  .append("text")
  .attr("x",screenToCentreX(boxCentreX*b))
  .attr("y", screenToCentreY((-boxCentreY-25)*b))
  .attr("fill","none")
  .attr("stroke","black");

var miscInfo = d3.select("svg")
  .append("text")
  .attr("x",screenToCentreX(boxCentreX*b))
  .attr("y", screenToCentreY((-boxCentreY-50)*b))
  .attr("fill","none")
  .attr("stroke","black");


var globalTime = 0;
let dt = 0.0001;
let gx = 0//9.81*0.1
let gy = 0//-9.81;
let gz = 0//9.81*0.01;
let cOfR = 0.5; // Coefficient of Restitution

// runs the simulation
d3.timer( function(duration) {
  var interval = duration*0.0001;

  particle.data(function(d) {
    particleData.forEach(
      function (d,i,data){
        updateVerletV(d,interval,gx,gy,gz);
        updateVerletP(d,interval,gx,gy,gz);

        var upperLim = upperBoxEdge(0);
        var lowerLim = lowerBoxEdge(0);
        var leftLim = leftBoxEdge(0);
        var rightLim = rightBoxEdge(0);
        var outerLim = outerBoxEdge(0);
        var innerLim = innerBoxEdge(0);

        if( d.py >= upperLim && d.vy>0 ) {
          d.py = lowerLim;
        };

        if( d.py <= lowerLim && d.vy<0) {
          d.py = upperLim ;
        };

        if( d.px == leftLim && d.vx < 0) {
          d.px = rightLim;
        };

        if( d.px == rightLim && d.vx>0) {
          d.px = leftLim;
        };

        if( d.pz <= innerLim && d.vz<0) {
          d.pz = outerLim;
        };

        if( d.pz >= outerLim && d.vz>0) {
          d.pz = innerLim;
        };
      }
    );
    return particleData;
  });

particle
  .enter()
  .selectAll("circle")
  .merge(particle)
  .attr("cx",function(d){return centreToScreenX(d.ix())})
  .attr("cy",function(d){return centreToScreenY(d.iy())})
  .attr("r", function(d) {return d.ir();});

timeInfo.text(function () {return "time elapsed: " + (duration*0.001).toFixed(2) + "s"})
miscInfo.text(function () {
return "N: " + N + " " +
"gravity: " + gy.toFixed(3) + " ms^2"
  });
return false;
});
