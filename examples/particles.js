

var worldHeight = 1000;
var worldWidth = 1000;

var boxWidth = 800;
var boxHeight = 800;
var boxDepth = 800;
var boxCentreX = -boxWidth/2; // in local coordinates
var boxCentreY = boxHeight/2; // in local coordinates
var particleSize = 8;
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

// coordinates of box edges

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

let N = 20;
var data = new Array;
for (var i = 0; i < N; i++){
  var n = {
    vx: randomNumber(-0,0),
    vy: randomNumber(-0,0),
    vz: randomNumber(-10,10),
    px: randomNumber(leftBoxEdge(particleSize), rightBoxEdge(particleSize)),
    py: randomNumber(upperBoxEdge(particleSize), lowerBoxEdge(particleSize)),
    pz: randomNumber(upperBoxEdge(particleSize), lowerBoxEdge(particleSize)),
    r: particleSize,
    scale: function(){
      return zFactor(boxDepth,this.pz,zp);
    },
    // data objects that each have duplicated functions? is this efficient?
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

var particles = svg.selectAll("charlesDarwin")
  .data(particleData)
  .enter()
  .append("circle")
  .attr("cx", function(d, i) {
    return centreToScreenX(d.ix());
  })
  .attr("cy", function(d, i) {
    return centreToScreenY(d.iy());
  })
  .attr("r", function(d, i) {
    return d.ir();
  })
  .style("fill", "00ACCD");

var timeInfo = d3.select("svg")
  .append("text")
  .attr("x",centreToScreenX(boxCentreX*b))
  .attr("y", centreToScreenY((-boxCentreY-25)*b))
  .attr("fill","none")
  .attr("stroke","black");

var miscInfo = d3.select("svg")
  .append("text")
  .attr("x",centreToScreenX(boxCentreX*b))
  .attr("y", centreToScreenY((-boxCentreY-50)*b))
  .attr("fill","none")
  .attr("stroke","black");

let dt = 0.0001;
let gx = 0//9.81*0.1
let gy = 0//-9.81;
let gz = 0//9.81*0.1;
let cOfR = 1.0; // Coefficient of Restitution
let dof = 3;
let kBoltzmann = 1.380649 * Math.pow(10,-23);

var timer = d3.timer( function(duration) {
  //timer.stop()
  var interval = duration*0.001;
  var temperature = 0;

  particles
    .attr("cy", function (d){
    //  var v =  d.vy + gy*interval;
    //  var p = d.py + d.vy*interval + (0.5*Math.pow(interval,2)*gy);
    var upperLim = boxHeight/2 - d.r ;
    var lowerLim = -boxHeight/2 + d.r;
    updateVerletV(d,interval,gx,gy,gz);
    updateVerletP(d,interval,gx,gy,gz);
    if( d.py >= upperLim ) {
      d.py = upperLim;

      d.vy = -1*d.vy*cOfR;
    };

    if( d.py <= lowerLim ) {
      d.py = lowerLim ;

      d.vy = -1*d.vy*cOfR;
    };
      return centreToScreenY(d.iy());
    })
    .attr("cx", function (d){

      updateVerletV(d,interval,gx,gy,gz);
      updateVerletP(d,interval,gx,gy,gz);
    //  var v =  d.vx + gx*interval;
    //  var p = d.px + d.vx*interval + (0.5*Math.pow(interval,2)*gx);
      var leftLim = -boxWidth/2 + d.r;
      var rightLim = boxWidth/2 - d.r;
      if( d.px <= leftLim ) {
        d.px = leftLim;
        d.vx = -1*d.vx*cOfR;
      };
      if( d.px >= rightLim ) {
        d.px = rightLim;
        d.vx = -1*d.vx*cOfR;
      };
      return centreToScreenX(d.ix());
    })

   timeInfo.text(() => {return "time elapsed: " + (interval).toFixed(2) + "s"});
   miscInfo.text(() => {return "Temp: " + (particleData[0].py).toFixed(2) +" K"});
});
