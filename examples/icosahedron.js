
var worldHeight = 720;
var worldWidth = 720;

var svg = d3.select("body").append("svg")
  .style('position','absolute')
  .attr("fill","black")
  .attr("width", '100%')
  .attr("height",'100%');


var boxDepth = 0.8*worldWidth;
let zp = (2*boxDepth);

var lineFunction = d3.line()
  .x(function(d) { return d.x; })
  .y(function(d) { return d.y; });


var facesToScreen = function(faces,d,z){
  var projectedFaces = [];
  faces.forEach(function(face){
    var projectedPoints = [];
    face.forEach(function(point){
      var scale = zFactor(d,point.z,z)*200;
      projectedPoints.push({x:centreToScreenX(point.x*scale),y:centreToScreenY(point.y*scale),z:point.z});
    })
    projectedFaces.push(projectedPoints);
  })
  return projectedFaces;
}

var phi = 1.618033;
var len = 0.2*worldHeight;

var icosaPoints =
  [
    {x:0,y:1,z:phi},
    {x:phi,y:0,z:1},
    {x:-1,y:phi,z:0},
    {x:0,y:-1,z:-phi},
    {x:-phi,y:0,z:-1},
    {x:-1,y:-phi,z:0},
    {x:1,y:-phi,z:0},
    {x:0,y:1,z:-phi},
    {x:-phi,y:0,z:1},
    {x:1,y:phi,z:0},
    {x:0,y:-1,z:phi},
    {x:phi,y:0,z:-1},

  ]

var generateFaces = function(data,l){
  var faces = [];
  for(var i = 0; i<data.length;i++){
    for(var j = 0; j<data.length;j++){
      for(var k = 0; k<data.length;k++){
        var a=data[i];
        var b=data[j];
        var c=data[k];
        if(pointLen(a,b)==pointLen(b,c)&&pointLen(b,c)==pointLen(a,c)&&pointLen(a,b)&&pointLen(a,b)){
          var faceFound = false;
          faces.forEach(function(f){
            if(facesEqual(f,[a,b,c])){ faceFound==true}
          })
          if(!faceFound){faces.push([a,b,c]);}
        }

      }
    }
  }
  return faces;
}

svg.append("rect")
  .attr("width",worldWidth)
  .attr("height",worldHeight)
  .attr("fill","rgb(0,0,0,1)")

svg.append("circle")
  .attr("r", 2)
  .attr("cy",centreToScreenY(0))
  .attr("cx",centreToScreenX(0))
  .attr("fill", "blue");

var info = d3.select("svg")
  .append("text")
  .attr("x",100)
  .attr("y", 100)
  .attr("fill","white")
  .attr("stroke","none");

var info2 = d3.select("svg")
  .append("text")
  .attr("x",100)
  .attr("y", 120)
  .attr("fill","white")
  .attr("stroke","none");

var edgeLen = Math.sqrt(Math.pow(phi,2)+Math.pow(1,2)+Math.pow(phi-1,2));
var test = generateFaces(icosaPoints,edgeLen);

var grp = svg.append("g");
d3.timer( function(duration) {
  var interval = duration*0.0001;
  var theta = Math.PI*Math.cos(interval*4);
  var rho = Math.PI*Math.sin(interval*4);
  var rotated = rotateFacesY(rotateFacesX(test,theta),rho);
  var icosa = facesToScreen(rotated,boxDepth,zp);
  grp.remove();
  grp = svg.append("svg")
  icosa.forEach(function(face, i){
    grp.append("path")
    .attr("d", lineFunction(face))
    .attr("stroke", "white")
    .attr("stroke-width", 1)
    .attr("fill", "rgb(0,255,255,0.1)");
  });

  info.text(function(){return "theta (x): " + theta.toFixed(2)+ " rad"})
  info2.text(function(){return "rho (y): " + rho.toFixed(2)+ " rad"})

return false;
});
