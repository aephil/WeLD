/*
  create an svg canvas
*/

var worldHeight = 1000;
var worldWidth = 1000;

var svg = d3.select("body").append("svg")
  .attr("fill","black")
  .attr("width", worldWidth)
  .attr("height",worldHeight);


var boxDepth = 800;
let zp = (2*boxDepth);

var lineFunction = d3.svg.line()
  .x(function(d) { return d.x; })
  .y(function(d) { return d.y; })
  .interpolate('linear');

  //for rotating a single point
  var rotX = function(d,theta){
    return {x:d.x,y:d.y*Math.cos(theta)-d.z*Math.sin(theta),z:d.z*Math.cos(theta)+d.y*Math.sin(theta)};
  }
  var rotY = function(d,rho){
    return {x:Math.cos(rho)*d.x + Math.sin(rho)*d.z,y:d.y,z:Math.cos(rho)*d.y-Math.sin(rho)*d.x}
  }
  var rotZ = function(d,gamma){
    return {x:Math.cos(gamma)*d.x - Math.sin(gamma)*d.y,y:Math.sin(gamma)*d.x+Math.cos(gamma)*d.y,z:d.z}
  }

  // for rotating entire shape (array of edges)
  var rotateFacesX = function(faces,theta){
    var rotatedFaces = [];
    faces.forEach(function(face){
      var rotatedPoints = [];
      face.forEach(function(point){
        rotatedPoints.push(rotX(point,theta));
      });
      rotatedFaces.push(rotatedPoints);
    });
    return rotatedFaces;
  }

  var rotateFacesY = function(faces,theta){
    var rotatedFaces = [];
    faces.forEach(function(face){
      var rotatedPoints = [];
      face.forEach(function(point){
        rotatedPoints.push(rotY(point,theta));
      });
      rotatedFaces.push(rotatedPoints);
    });
    return rotatedFaces;
  }

  var rotateFacesZ = function(faces,theta){
    var rotatedFaces = [];
    faces.forEach(function(face){
      var rotatedPoints = [];
      face.forEach(function(point){
        rotatedPoints.push(rotZ(point,theta));
      });
      rotatedFaces.push(rotatedPoints);
    });
    return rotatedFaces;
  }

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
var len = 100;
let lemon = 20;

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

var cubePoints = [
  {x:-1,y:-1,z:1},
  {x:-1,y:1,z:1},
  {x:1,y:1,z:1},
  {x:1,y:-1,z:1},

  {x:-1,y:-1,z:-1},
  {x:-1,y:1,z:-1},
  {x:1,y:1,z:-1},
  {x:1,y:-1,z:-1},
]

var pointLen = function(a,b){
  return Math.sqrt(Math.pow(a.x-b.x,2)+Math.pow(a.y-b.y,2)+Math.pow(a.z-b.z,2));
}
/*
var generateFaces = function(data, l){
  var faces = [];
  data.forEach(function(a){
    var face = [];
    face.push(a);
    data.forEach(function(b){
      var length = pointLen(a,b);
      var isValid = true;
      face.forEach(function(p){
          var length = pointLen(p,b);
          if(length != l){
            isValid = false;
          };
      })
      if(isValid){
        face.push(b);
      }
    });
    //face.push(a);
    faces.push(face);
  });
  return faces;
}
*/

var pointLen = function(a,b){
  return Math.sqrt(Math.pow(a.x-b.x,2)+Math.pow(a.y-b.y,2)+Math.pow(a.z-b.z,2));
}
var pointsEqual = function(a,b){
  return a.x==b.x&&a.y==b.y&&a.z==b.z;
}
var facesEqual = function(faceA,faceB){
  if(faceA.length!=faceB.length){return false;}
  var numEqualPoints = 0;
  faceA.forEach(function(a){
    faceB.forEach(function(b){
      if(pointsEqual(a,b)){
        numEqualPoints++;
      }
    })
  })
  return numEqualPoints==faceB.length;
}
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
  var rho = Math.PI*Math.sin(interval*4);// 0//Math.PI/4//Math.sin(interval*7);
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

    face.forEach(function(point,i){
      if(point.z<0){
        zBuffer = "red"
      }else if (Math.abs(point.z)==0) {
          zBuffer = "blue";
      } else {
          zBuffer = "green";
      }
      grp.append("circle")
        .attr("r", 0)
        .attr("cy",point.y)
        .attr("cx",point.x)
        .attr("fill", zBuffer);
    })
  });

  info.text(function(){return "theta (x): " + theta.toFixed(2)+ " rad"})
  info2.text(function(){return "rho (y): " + rho.toFixed(2)+ " rad"})

return false;
});
