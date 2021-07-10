var heatColGrad = function(n){

  if(n < .25){
    return "rgb(" + (255*n).toString() + ",0,255)"
  } else if (.25 <= n && n < 5.0) {
    return "rgb(255,0," + (255*(1-n)).toString() + ")"
  } else if (.50 <= n && n < 7.5 ) {
    return "rgb(255," + (255*n).toString() +",255)"
  } else if (.75 < n){
    return "rgb(" + (255*n).toString() + "," + (255*n).toString() + "," + (255*n).toString() + ")";
  }
}

var kb = (1.38 * 6.020) * 10000000000000
var worldHeight = 1000;
var worldWidth = 1000;

var boxWidth = 300;
var boxHeight = 300;

var boxCentreX = -boxWidth/2; // in local coordinates
var boxCentreY = boxHeight/2; // in local coordinates
var particleSize = 3;
var particleSizeMin = particleSize/4;

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

var edges = createCentredCube(boxWidth);

var boxColour = "rgba(0,0,0,0.1)";
var boxStroke = "black";

var lineFunction = d3.line()
  .x(function(d) { return d.x; })
  .y(function(d) { return d.y; })

svg.append("path")
  .attr("d", lineFunction(edges))
  .attr("stroke", boxStroke)
  .attr("stroke-width", 0.7)
  .attr("fill", boxColour);

let N = 100;
var data = new Array;
for (var i = 0; i < N; i++){
  if(randomNumber(1,1)> 0.5){
    var p =
    {
      vx: randomNumber(-15,15),
      vy: randomNumber(-15,15),
      px: randomNumber(leftBoxEdge(6), rightBoxEdge(6)),
      py: randomNumber(upperBoxEdge(6), lowerBoxEdge(6)),
      r: 4,
      m: 4,
      col:"red",
      cofr: 0.99
    }
    data.push(p);
  }
  else{
    var p =
    {
      vx: randomNumber(-15,15),
      vy: randomNumber(-15,15),
      px: randomNumber(leftBoxEdge(3), rightBoxEdge(3)),
      py: randomNumber(upperBoxEdge(3), lowerBoxEdge(3)),
      r: 2,
      m: 2,
      col: "blue",
      cofr: 0.99
    }
    data.push(p);
  }
}

var particleData = data;

var particle = svg.selectAll("circle").data(particleData);

particle.enter().append("circle")

  .attr("stroke","none")
  .attr("fill",function (d){ return d.col; })

  .attr("cy", function (d){ return screenToCentreY(d.py); })
  .attr("cx", function (d){ return screenToCentreX(d.px); })
  .attr("r", function(d){ return d.r; })
particle.exit().remove();

var timeInfo = d3.select("svg")
  .append("text")
  .attr("x",screenToCentreX(boxCentreX))
  .attr("y", screenToCentreY((-boxCentreY-25)))
  .attr("fill","none")
  .attr("stroke","black");

var tempInfo = d3.select("svg")
  .append("text")
  .attr("x",screenToCentreX(boxCentreX))
  .attr("y", screenToCentreY((-boxCentreY-45)))
  .attr("fill","none")
  .attr("stroke","black");

var miscInfo = d3.select("svg")
  .append("text")
  .attr("x",screenToCentreX(boxCentreX))
  .attr("y", screenToCentreY((-boxCentreY-50)))
  .attr("fill","none")
  .attr("stroke","black");


var globalTime = 0;
let dt = 0.0001;
let gx = 0//9.81*0.1
let gy = 0//-.9810;
let fps = 20
let wcofr = 0.99
let T = 2

var frames = 0; // current frame number

// runs the simulation

var timer = d3.timer( function(duration) {
  //timer.stop()
  var elapsed = duration*0.001;
  var kinetic = 0

// physics
  particle.data(function(d) {

    // we replace the data with a modified version of itself by iteratively modifying each particle in the dataset
    // and then return the new dataset

    // reset the average kinetic energy
    kinetic = 0;

    particleData.forEach(
      function (d,i,data){

        // recalculate particle trajectory

        // dont need to do this step if no acceleration

        updateVerletV(d,elapsed,gx,gy);
        updateVerletP(d,elapsed,gx,gy);
        exchangeMomenta(d, particleData);

        // correct any particle to boundary collisons
        var upperLim = upperBoxEdge(d.r);
        var lowerLim = lowerBoxEdge(d.r);
        var leftLim = leftBoxEdge(d.r);
        var rightLim = rightBoxEdge(d.r);

        if( d.py >= upperLim ) {
          d.py = upperLim;

          d.vy = -1*d.vy*d.cofr*wcofr;
        };

        if( d.py <= lowerLim ) {
          d.py = lowerLim ;

          d.vy = -1*d.vy*d.cofr*wcofr;
        };

        if( d.px <= leftLim ) {
          d.px = leftLim;

          d.vx = -1*d.vx*d.cofr*wcofr;
        };

        if( d.px >= rightLim ) {
          d.px = rightLim;
          d.vx = -1*d.vx*d.cofr*wcofr;
        };
        kinetic += 0.5 * d.m * (Math.pow(d.vx,2) + Math.pow(d.vx,2));
        }
    );
    return particleData;
  });

  // graphics
  if(elapsed >= frames * (1/fps)){
  particle.enter().selectAll("circle")
    .attr("cy", function (d){ return screenToCentreY(d.py);})
    .attr("cx", function (d){ return screenToCentreX(d.px);})
    .attr("fill", function(d){ return heatColGrad(0.5 * d.m * (Math.pow(d.vx,2) + Math.pow(d.vx,2)) / 15);})
    frames += 1;
  }
  tempInfo.text(function () {return "T" + (T).toFixed(2) + ""})
  timeInfo.text(function () {return "time elapsed: " + (elapsed).toFixed(2) + "s"})
});
