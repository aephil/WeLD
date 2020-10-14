

var slider = d3
   .sliderHorizontal()
   .min(0)
   .max(10)
   .step(1)
   .width(300)
   .displayValue(false)
   .on('onchange', (val) => {
     d3.select('#value').text(val);
   });
   
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
