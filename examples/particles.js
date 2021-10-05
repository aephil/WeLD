

var worldHeight = 1000;
var worldWidth = 1000;

var boxWidth = 800;
var boxHeight = 800;
var boxDepth = 800;
var boxCentreX = -boxWidth/2; // in local coordinates
var boxCentreY = boxHeight/2; // in local coordinates
var particleSize = 10;
var particleSizeMin = particleSize/4;

// z-perspective value
let zp = (2*boxDepth);

var a = zFactor(boxDepth,boxDepth/2,zp);
var b = zFactor(boxDepth,-boxDepth/2,zp);

// coordinates of box edges
var leftBoxEdge = function(r){return -boxWidth/2 + r;}
var rightBoxEdge = function(r){return boxWidth/2 - r;}

var upperBoxEdge = function(r){return boxHeight/2 - r;}
var lowerBoxEdge = function(r){return -boxHeight/2 + r;}

var outerBoxEdge = function(r){return boxDepth/2 - r;}
var innerBoxEdge = function(r){return (-boxDepth/2) + r;}

// test of d3v6

var svg = d3.select("body").append("svg")
  .attr("width", worldWidth)
  .attr("height",worldHeight);

var edges = createCentredCube(boxWidth,zp);

var boxColour = "rgba(0,0,0,1)";
var boxStroke = "white";

var lineFunction = d3.line()
  .x(function(d) { return d.x; })
  .y(function(d) { return d.y; })

edges.slice(0,5).forEach(function(d){
  svg.append("path")
    .attr("d", lineFunction(d))
    .attr("stroke", boxStroke)
    .attr("stroke-width", 0.7)
    .attr("fill", boxColour);
})

let N = 10;
var data = new Array;
for (var i = 0; i < N; i++){
  var n = {
    vx: randomNumber(-10,10),
    vy: randomNumber(-10,10),
    vz: randomNumber(-10,10),
    x: randomNumber(leftBoxEdge(particleSize), rightBoxEdge(particleSize)),
    y: randomNumber(upperBoxEdge(particleSize), lowerBoxEdge(particleSize)),
    z: randomNumber(upperBoxEdge(particleSize), lowerBoxEdge(particleSize)),
    r: particleSize,
    scale: function(){
      return zFactor(boxDepth,this.z,zp);
    },
    ix: function(){
      return this.x * this.scale();
    },
    iy: function(){
      return this.y * this.scale();
    },
    ir: function(){
      return this.r * this.scale();
    },
    m: randomNumber(1,4),
  }
  data.push(n);
}


var particleData = data;
var particle = svg.selectAll("circle").data(particleData);

particle.enter().append("circle")
  .attr("r",particleSize)
  .attr("stroke","none")
  .attr("fill","white")
  .merge(particle)
  .attr("cy", function (d){ return screenToCentreY(d.y / d.z )})
  .attr("cx", function (d){ return screenToCentreX(d.x / d.z)})
  .attr("r", function(d) {return d.r / d.z;})
particle.exit().remove();

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
let gz = 0//9.81*0.1;
let cOfR = 1; // Coefficient of Restitution

// runs the simulation
var timer = d3.timer( function(duration) {
  //timer.stop()
  var interval = duration*0.0001;

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

        if( d.y >= upperLim ) {
          d.y = upperLim;

          d.vy = -1*d.vy*cOfR;
        };

        if( d.y <= lowerLim ) {
          d.y = lowerLim ;

          d.vy = -1*d.vy*cOfR;
        };

        if( d.x <= leftLim ) {
          d.x = leftLim;

          d.vx = -1*d.vx*cOfR;
        };

        if( d.x >= rightLim ) {
          d.x = rightLim;
          d.vx = -1*d.vx*cOfR;
        };

        if( d.z <= innerLim ) {
          d.vz = -1*d.vz*cOfR;
          d.z = innerLim;
        };

        if( d.z >= outerLim ) {
          d.vz = -1*d.vz*cOfR;
          d.z = outerLim;
        };

        particle.enter().selectAll("circle")
          .merge(particle)
          .attr("cy", function (d){ return screenToCentreY(d.iy())})
          .attr("cx", function (d){ return screenToCentreX(d.ix() )})
          .attr("r", function (d){ return d.ir()})
      }
    );
    return particleData;
  });
  timeInfo.text(function () {return "time elapsed: " + (duration*0.001).toFixed(2) + "s"})
});
