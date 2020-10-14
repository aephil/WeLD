var windowWidth = 500;
var windowLength = 300;

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


let N = 100;
var data = new Array;
for (var i = 0; i < N; i++){
  var n = {
    vx: randomNumber(-100,100),
    vy: randomNumber(-100,100),
    vz: randomNumber(-100,100),
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
    m: 1,
  }
  data.push(n);
}

var particleData = data;

var pos = [
  [50, 40],
  [100, 80],
  [150, 120],
  [200, 160],
  [250, 200],
  [300, 240]
];

var base = d3.select("body").append("svg")
  .attr("width", windowWidth)
  .attr("height", windowLength);

var circles = base.selectAll("charlesDarwin")
  .data(particleData)
  .enter()
  .append("circle")
  .attr("cx", function(d, i) {
    return d.ix();
  })
  .attr("cy", function(d, i) {
    return d.iy();
  })
  .attr("r", function(d, i) {
    return d.ir();
  })
  .style("fill", "00ACCD");

var timer = d3.timer(animate);

function animate() {
  circles.attr("cx", function() {

    var x = +d3.select(this).attr("cx")
    return  x + Math.sin(0.1*x);
  });
};
