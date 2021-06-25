

var worldHeight = 1000;
var worldWidth = 1000;

var boxWidth = 800;
var boxHeight = 800;
var boxDepth = 800;
var boxCentreX = -boxWidth/2; // in local coordinates
var boxCentreY = boxHeight/2; // in local coordinates
var particleSize = 3;
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
var boxStroke = "rgba(60,60,60,1)";

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
    vx: 0,//randomNumber(10,10),
    vy: 0,//randomNumber(-10,10),
    vz: 0,//randomNumber(-10,10),
    px: randomNumber(leftBoxEdge(particleSize), rightBoxEdge(particleSize)),
    py: 0 ,//randomNumber(upperBoxEdge(particleSize), lowerBoxEdge(particleSize)),
    pz: upperBoxEdge(particleSize) / 6 ,//randomNumber(upperBoxEdge(particleSize), lowerBoxEdge(particleSize)),
    r: particleSize,
    scale: function(){
      return zFactor(boxDepth,this.pz,zp);
    },
    ix: function(){
      return (this.px +randomNumber(-10,10)) * this.scale();
    },
    iy: function(){
      return ((this.px + randomNumber(-10,10))) * this.scale();
    },
    ir: function(){
      return this.r * this.scale();
    },
    m: randomNumber(1,4),
  }
  data.push(n);
}
colourData = ["rgb(100,0,0)",'rgb(0,100,0)','rgb(0,0,100)']

var particleData = data;
var particle = svg.selectAll("circle").data(particleData);
var lines = svg.selectAll("line").data(particleData);

particle.enter().append("circle")
  .attr("r",particleSize)
  .attr("stroke","none")
  .attr("fill","white")
  .merge(particle)
  .attr("cy", function (d){ return screenToCentreY(d.iy())})
  .attr("cx", function (d){ return screenToCentreX(d.ix())})
  .attr("r", function(d) {return d.ir();})
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

// runs the simulation
var timer = d3.timer( function(duration) {
  //timer.stop()
  var interval = duration;
  var m = randomNumber(-0.5,0.5);
  var c = randomNumber(-100,100);

  var mz = randomNumber(-1,1);
  var cz = randomNumber(-100,100);

  particle.data(function(d) {
    particleData.forEach(
      function (d,i,data){

        x =  randomNumber(0,20);
        y = (x < 1 && x > 0)

        d.pz = d.px*mz + cz

        if(y){
          particle.enter().selectAll("circle")
            .merge(particle)
            .transition()
            .duration(0.5)
            .attr("fill",function (d){
              x =  randomNumber(0,3);
              f = colourData[0];
              if(x < 1 ){
                f = colourData[1]
              }
              else if (x <  2)
              {
                f = colourData[2]
              }
              return f})
            .attr("cx", function (d){ return screenToCentreX(d.ix())})
            .attr("cy", function (d){ return screenToCentreY((d.iy() * m) + c)})
            .attr("r", function(d) {return d.ir();})
        } else {
          particle.enter().selectAll("circle")
            .merge(particle)
            .transition()
            .duration(75)
            .attr("fill","black")
        }

      }
    );
    return particleData;
  });
//  timeInfo.text(function () {return "time elapsed: " + (duration*0.001).toFixed(2) + "s"})
});
