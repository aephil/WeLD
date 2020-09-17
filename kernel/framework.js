//import * as d3 from "./d3v3/d3.v3.min.js"

// returns the screen x coordinate equivalent of the user defined coordinate system
var screenToCentreX = function(x, worldWidth = 1000){
  var screenToCentreOffX = worldWidth/2;
  return (x + screenToCentreOffX);
}
// returns the screen y coordinate equivalent of the user defined coordinate system
var screenToCentreY = function(y, worldHeight = 1000){
  var screenToCentreOffY = worldHeight/2;
  return (screenToCentreOffY - y);
  }

// returns the bottom coordinates
var screenToBottomLeftX = function(x){
  // they are the same!
  return x;
}
var screenToBottomLeftY = function(y, worldHeight = 1000){
  return worldHeight - y ;
}

var centreToBottomLeftX = function(x, worldWidth = 1000){
  return x + worldWidth/2;
}
var centreToBottomLeftY = function(y,worldHeight=1000){
  return (worldHeight/2) + y;
}

var bottomLeftToCentreX = function(x,worldWidth=1000){
  return (-worldWidth/2) + x;
}

var bottomLeftToCentreY = function(x,worldHeight=1000){
  return (-worldHeight/2) + y;
}

// establish a coordinate system
var centreToScreenY = function(y, worldHeight=1000){
  return (worldHeight/2) - y;
}
var centreToScreenX = function(x, worldWidth=1000){
return  x + worldWidth/2;
}

var bottomLeftToScreenX = function(x, worldWidth=1000){
  // they are the same!
  return x;
}

var bottomLeftToScreenY = function(y,worldHeight=1000){
  return worldHeight - y;
}

var bottomLeftToCentreZ = function(z, worldDepth = 1000){
  return z + worldDepth/2;
}
var centrToBottomLeftZ = function(z, worldDepth = 1000){
  return z - worldDepth/2; 
}



var updateVerletV = function(d,t,ax=0,ay=0,az=0){
  d.vx += ax*t;
  d.vy += ay*t;
  d.vz += az*t;
}

var updateVerletP = function(d,t,ax=0, ay=0,az=0){
  d.px += d.vx + (0.5*Math.pow(t,2)*ax);
  d.py += d.vy + (0.5*Math.pow(t,2)*ay);
  d.pz += d.vz + (0.5*Math.pow(t,2)*az);
}

var randomNumber = function(min, max) {
  return Math.random() * (max - min) + min;
}

var onePointPerspectiveCentred = function(d,alphaZero,alphaFinal,point){

  var dx = d.px - point[0];
  var dy = d.py - point[1];
  var dz = d.pz - point[2];

  var depth = Math.abs(alphaZero[2] - alphaFinal[2]);

  var r = Math.sqrt(Math.pow(dy,2) + Math.pow(dx,2));

  var zFactor = Math.abs(alphaZero[2] - d.pz)/depth;
  var theta = Math.atan(dy/dx);

  var alphaX = alphaZero[0] + zFactor*Math.abs(alphaZero[0] - alphaFinal[0])
  var alphaY = alphaZero[1] +  zFactor*Math.abs(alphaZero[1] - alphaFinal[1])

  var betaX = Math.abs(d.px - alphaX)/ (2*Math.abs(alphaX));
  var betaY = Math.abs(d.px - alphaY)/ (2*Math.abs(alphaY));

  var newX = alphaX //+ betaX*Math.abs(2*alphaX);
  var newY = alphaY //+ betaY*Math.abs(2*alphaY);

  return [newX,newY,Math.abs(d.pz)];


}

var exchangeMomenta = function(p, n, data, cOfR){
  var dataLength = data.length;
  var skipOver = [n];
   for(var i = 0; i < dataLength; i++ ){
     if(!skipOver.includes(i)){
     var q = data[i];

     var dx = p.px - q.px;
     var dy = p.py - q.py;
     var dz = p.pz - q.pz;
     var r = Math.sqrt(Math.pow(dy,2) + Math.pow(dx,2) + Math.pow(dz,2));
     if(r <= (p.r+q.r)){
       // elastic
       var alpha = (p.m - q.m) / (p.m + q.m);
       var beta =  (2*q.m) / (p.m + q.m);
       var gamma = (q.m - p.m) / (p.m + q.m);
       var delta = (2*p.m) / (q.m + p.m);

       var pvx = alpha*p.vx + beta*q.vx;
       var pvy = alpha*p.vy + beta*q.vy;
       var pvz =  alpha*p.vz + beta*q.vz;

       var qvx = gamma*q.vx + delta*p.vx;
       var qvy = gamma*q.vy + delta*p.vy;
       var qvz = gamma*q.vz + delta*p.vz;

       p.vx = pvx*cOfR;
       p.vy = pvy*cOfR;
       p.vz = pvz*cOfR;

       data[i].vx = qvx*cOfR;
       data[i].vy = qvy*cOfR;
       data[i].vz = qvz*cOfR;

       skipOver.push(i);
      }
    }
  }
 }
