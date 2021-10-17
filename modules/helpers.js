
// helper functions

var centreToScreenY = function(y, worldHeight=1000){
  return (worldHeight/2) - y;
}
var centreToScreenX = function(x, worldWidth=1000){
return  x + worldWidth/2;
}

var screenToCentreX = function(x, worldWidth = 1000){ 
  return x - worldWidth/2;
}
// returns the screen y coordinate equivalent of the user defined coordinate system
var screenToCentreY = function(y, worldHeight = 1000){
  return (worldHeight/2) - y;
  }

 var randomNumber = function(min, max) {
   return Math.random() * (max - min) + min;
 }

 var randomColour = function(){
   return "rgb("+randomNumber(0,255)+","+randomNumber(0,255)+","+randomNumber(0,255)+")";
 }

 var rotX = function(d,theta){
   return {x:d.x,y:d.y*Math.cos(theta)-d.z*Math.sin(theta),z:d.z*Math.cos(theta)+d.y*Math.sin(theta)};
 }
 var rotY = function(d,rho){
   return {x:Math.cos(rho)*d.x + Math.sin(rho)*d.z,y:d.y,z:(Math.cos(rho)*d.z)-(Math.sin(rho)*d.x)}
 }
 var rotZ = function(d,gamma){
   return {x:Math.cos(gamma)*d.x - Math.sin(gamma)*d.y,y:Math.sin(gamma)*d.x+Math.cos(gamma)*d.y,z:d.z}
 }
