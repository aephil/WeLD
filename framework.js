//import * as d3 from "./d3v3/d3.v3.min.js"

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

var onePointPerspective = function(d,interval,x,y,z){

  var deltaX = d.px - x;
  var deltaY = d.py - y;
  var deltaZ = d.pz - z;
  var r = Math.sqrt(Math.pow(deltaX,2) + Math.pow(deltaY,2) + Math.pow(deltaZ,2));
  var polar = Math.acos(d.pz/r);
  var azimuthal = Math.asin(d.py/r*Math.sin(polar));

  var contributionX = Math.sin(polar)*Math.cos(azimuthal)*d.vz*interval;
  var contributionY = Math.sin(polar)*Math.sin(azimuthal)*d.vz*interval;

  return [contributionX,contributionY];
}

var exchangeMomenta = function(p, n, data){
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

       p.vx = pvx;
       p.vy = pvy;
       p.vz = pvz;

       data[i].vx = qvx;
       data[i].vy = qvy;
       data[i].vz = qvz;

       skipOver.push(i);
      }
    }
  }
 }
