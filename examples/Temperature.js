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
//.style("filter", "url(#gooeyCodeFilter)");

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////



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

var boxWidth = 400;
var boxHeight = 400;

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

var N = 100;
var temperature = 20
var dT = 0;
var tempUpdated = false
let dof = 2;

// test of d3v6
//var svg = d3.select("body").append("svg")
//  .attr("width", worldWidth)
//  .attr("height",worldHeight);

var edges = createCentredCube(boxWidth);


var lineFunction = d3.line()
  .x(function(d) { return d.x; })
  .y(function(d) { return d.y; })

var box = svg.append("path")
  .attr("d", lineFunction(edges))
  .attr("stroke", heatColGrad(temperature/100,0.7))
  .attr("stroke-width", 0.7)
  .attr("fill", heatColGrad(temperature/100,0.4))

var massA = 2
var massB = 1
var avgKinEn = (dof/2) * temperature // natural units

var data = new Array;
for (var i = 0; i < N; i++){

  var rnd = randomNumber(0,1);

  if(randomNumber(0,1)> 0.5){

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
      r: 4,
      m: massA,
      col:"red",
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
      col: "blue",
      cofr: 0.999
    }
    data.push(p);
  }
}

var particleData = data;

var particle = circleWrapper.selectAll("circle").data(particleData);

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
      if(!tempUpdated){
        if(temperature<1000)
        {
          dT = 1
          tempUpdated = true;
          console.log("heating up.")
          console.log("last temp: " + temperature.toString())
        }
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
        if (!tempUpdated)
        {
          if(temperature>1)
          {
            dT = -1
            tempUpdated = true;
            console.log("cooling down.")
            console.log("last temp: " + temperature.toString())
          }
          else
          {
            temperature = 0
            tempUpdated = true;
            console.log("min temp reached")
            console.log("last temp: " + temperature.toString())
          }
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

        var speedIsZero = d.vx == 0 && d.vy == 0;

        if(speedIsZero)
        {
          if (dT>0)
          {
            var rnd = randomNumber(0,1);
            var vsquared = dof / d.m;
            d.vx = rnd * Math.sqrt(vsquared) * (randomNumber(0,1) > 0.5 ? -1 : 1);
            d.vy = (1-rnd) * Math.sqrt(vsquared) * (randomNumber(0,1) > 0.5 ? -1 : 1);
          }
            console.log("temperature already at minimum")
        }
        else
        {
          avgKinEn = (dof/2) * (temperature + dT) * 0.634; // new target K.E
          var vratio = Math.sqrt((avgKinEn * 2 / d.m)) / Math.sqrt((Math.pow(d.vx,2) + Math.pow(d.vy,2)));
          d.vx *= vratio;
          d.vy *= vratio;
        }
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
    return particleData;
  });

  if (tempUpdated)
  {
    tempUpdated = false;
    dT = 0;
  }

  temperature = ((kinetic/N) * (2/dof) / 0.634)

  // graphics
  if(elapsed >= frames * (1/fps)){
  particle.enter().selectAll("circle")
    .attr("cy", function (d){ return screenToCentreY(d.py);})
    .attr("cx", function (d){ return screenToCentreX(d.px);})
    //.transition()
    //.duration(300)
    //.attr("fill", function(d){ return heatColGrad((Math.pow(d.vy,2) + Math.pow(d.vx,2)) / (dof * 100 * 0.634 / d.m));})
    frames += 1;
  }

  box
  .transition()
  .duration(200)
  .attr("fill", heatColGrad(temperature/100,0.2))
  .attr("stroke", "black");
  tempInfo.text(function () {return "T: " + temperature.toFixed(2) })
  timeInfo.text(function () {return "time elapsed: " + (elapsed).toFixed(2) + "s"})
});
