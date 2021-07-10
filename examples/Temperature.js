


var heatColGrad = function(n, o=1){

  if(n < .25){
    return "rgba(" + (255*n).toString() + ",0,255," + o.toString() + ")"
  } else if (0.25 <= n && n < 0.5) {
    return "rgba(255,0," + (255*(1-n)).toString() + "," + o.toString() + ")"
  } else if (0.50 <= n && n < 0.75 ) {
    return "rgba(255," + (255*n).toString() +",0," + o.toString() + ")"
  } else if (0.75 <= n){
    return "rgba(255,255,255," + o.toString() + ")"
  }
}

var worldHeight = 800;
var worldWidth = 800;

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

var N = 50;
var T = 20
var dT = 0;
var tempUpdated = false
let dof = 2;

// test of d3v6
var svg = d3.select("body").append("svg")
  .attr("width", worldWidth)
  .attr("height",worldHeight);

var edges = createCentredCube(boxWidth);


var lineFunction = d3.line()
  .x(function(d) { return d.x; })
  .y(function(d) { return d.y; })

var box = svg.append("path")
  .attr("d", lineFunction(edges))
  .attr("stroke", heatColGrad(T/100,0.7))
  .attr("stroke-width", 0.7)
  .attr("fill", heatColGrad(T/100,0.4))

var massA = 1
var massB = 1
var avgKinEn = (dof/2) * T // natural units

var data = new Array;
for (var i = 0; i < N; i++){

  var rnd = randomNumber(0,1);

  if(randomNumber(1,1)> 0.5){

    var vsquared = avgKinEn * 2 / massA
    var vxi = rnd * Math.sqrt(vsquared) * (randomNumber(0,1) > 0.5 ? -1 : 1);
    var vyi = (1-rnd) * Math.sqrt(vsquared) * (randomNumber(0,1) > 0.5 ? -1 : 1);

    var p =
    {
      id: "a",
      vx: vxi,
      vy: vyi,
      px: randomNumber(leftBoxEdge(6), rightBoxEdge(6)),
      py: randomNumber(upperBoxEdge(6), lowerBoxEdge(6)),
      r: 2,
      m: massA,
      col:"white",
      cofr: 0.999
    }
    data.push(p);
  }
  else{

    var vsquared = avgKinEn * 2 / massB
    var vxi = rnd * Math.sqrt(vsquared) * (randomNumber(0,1) > 0.5 ? -1 : 1);
    var vyi = (1-rnd) * Math.sqrt(vsquared) * (randomNumber(0,1) > 0.5 ? -1 : 1);

    var p =
    {
      id: "a",
      vx: vxi,
      vy: vyi,
      px: randomNumber(leftBoxEdge(3), rightBoxEdge(3)),
      py: randomNumber(upperBoxEdge(3), lowerBoxEdge(3)),
      r: 2,
      m: massB,
      col: "white",
      cofr: 0.999
    }
    data.push(p);
  }
}

var particleData = data;

var particle = svg.selectAll("circle").data(particleData);

particle.enter().append("circle")

  .attr("stroke","black")
  .attr("fill",function (d){ return d.col; })
  .attr("cy", function (d){ return screenToCentreY(d.py); })
  .attr("cx", function (d){ return screenToCentreX(d.px); })
  .attr("r", function(d){ return d.r; })
particle.exit().remove();

var timeInfo = svg
  .append("text")
  .attr("x",screenToCentreX(boxCentreX))
  .attr("y", screenToCentreY((-boxCentreY-25)))
  .attr("fill","none")
  .attr("stroke","black");

var tempInfo = svg
  .append("text")
  .attr("x",screenToCentreX(boxCentreX))
  .attr("y", screenToCentreY((-boxCentreY-45)))
  .attr("fill","none")
  .attr("stroke","black");

var tempButtonUp = svg
  .append("rect")
  .attr("width", 10)
  .attr("height", 10)
  .attr("y",screenToCentreY(-boxCentreY-35))
  .attr("x",screenToCentreX(boxCentreX + 70))
  .attr("fill", "red")
  .on("click",
    function()
    {
      if(T<1000)
      {
        dT = 1
        tempUpdated = true;
        console.log("heating up.")
        console.log("last temp: " + T.toString())
      }
    }
  )
  var tempButtonDown = svg
    .append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .attr("y",screenToCentreY(-boxCentreY-35))
    .attr("x",screenToCentreX(boxCentreX + 85))
    .attr("fill", "blue")
    .on("click",
      function()
      {
        if(T>1)
        {
          dT = -1
          tempUpdated = true;
          console.log("cooling down.")
          console.log("last temp: " + T.toString())
        }
      }
    )



var miscInfo = svg
  .append("text")
  .attr("x",screenToCentreX(boxCentreX))
  .attr("y", screenToCentreY((-boxCentreY-50)))
  .attr("fill","none")
  .attr("stroke","black");

var globalTime = 0;
let dt = 0.0001;
let gx = 0//9.81*0.1
let gy = 0//-.9810;
let fps = 60
let wcofr = 0.999

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


      // recalc avg kinetic energy and apply to particles

      if(tempUpdated){
        avgKinEn = (dof/2) * (T + dT) * 0.634; // new target K.E
        var vratio = Math.sqrt((avgKinEn * 2 / d.m)) / Math.sqrt((Math.pow(d.vx,2) + Math.pow(d.vy,2)));
        d.vx *= vratio;
        d.vy *= vratio;
      }


        // recalculate particle trajectory

        //updateVerletV(d,elapsed,gx,gy);
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
        kinetic +=  0.5 * d.m * (Math.pow(d.vx,2) + Math.pow(d.vy,2));
        }
    );


    if (tempUpdated){
      tempUpdated = false;
      dT = 0;
    }
    T = ((kinetic/N) * (2/dof) / 0.634)
    return particleData;
  });

  // graphics
  if(elapsed >= frames * (1/fps)){
  particle.enter().selectAll("circle")
    .attr("cy", function (d){ return screenToCentreY(d.py);})
    .attr("cx", function (d){ return screenToCentreX(d.px);})
    .transition()
    .duration(200)
    .attr("fill", function(d){ return heatColGrad(0.5 * d.m * (Math.pow(d.vx,2) + Math.pow(d.vx,2)) / 50);})
    frames += 1;
  }

  box
  .transition()
  .duration(200)
  .attr("fill", heatColGrad(T/100,0.4))
  .attr("stroke", heatColGrad(T/100,0.7));
  tempInfo.text(function () {return "T: " + T.toFixed(2) + ""})
  timeInfo.text(function () {return "time elapsed: " + (elapsed).toFixed(2) + "s"})
});
