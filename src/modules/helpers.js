// helper functions
export const meanOf = function(arr) {
    const sum = arr.reduce((a, b) => a + b, 0);
    const mean = (sum / arr.length) || 0;
    return mean;
}

export const getStd = function(arr) {
    const mean = meanOf(arr);
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += (arr[i] - mean) ** 2;
    }
    sum = Math.sqrt(sum);
    sum /= arr.length;
    return sum
}

export const centreToScreenY = function(y, worldHeight=1000){
    return (worldHeight/2) - y;
}
export const centreToScreenX = function(x, worldWidth=1000){
    return  x + worldWidth/2;
}

export const centreToScreenYPeriodic = function(y, worldHeight=1000){
    let pos = (worldHeight/2) - y;
    pos = pos > 0 ? pos : worldHeight + pos;
    return pos % worldHeight;
}
export const centreToScreenXPeriodic = function(x, worldWidth=1000){
    let pos =  x + (worldWidth/2);
    pos = pos > 0 ? pos : worldWidth + pos;
return pos % worldWidth;
}

export const screenToCentreX = function(x, worldWidth = 1000){
    return x - worldWidth/2;
}

export const screenToCentreXPeriodic = function(x, worldWidth = 1000){
    let pos = x - worldWidth/2;
    pos = pos > 0 ? pos : worldWidth + pos;
    return pos % worldWidth;
}

export const screenToCentreYPeriodic = function(y, worldHeight = 1000){
    let pos = (worldHeight/2) - y;
    pos = pos > 0 ? pos : worldHeight + pos;
    return pos % worldHeight;
  }

// returns the screen y coordinate equivalent of the user defined coordinate system
export const screenToCentreY = function(y, worldHeight = 1000){
    return (worldHeight/2) - y;
  }

 export const randomNumber = function(min, max) {
    return Math.random() * (max - min) + min;
 }

 export const randomColour = function(){
    return "rgb("+randomNumber(0,255)+","+randomNumber(0,255)+","+randomNumber(0,255)+")";
 }

 export const rotX = function(d,theta){
    return {x:d.x,y:d.y*Math.cos(theta)-d.z*Math.sin(theta),z:d.z*Math.cos(theta)+d.y*Math.sin(theta)};
 }
 export const rotY = function(d,rho){
    return {x:Math.cos(rho)*d.x + Math.sin(rho)*d.z,y:d.y,z:(Math.cos(rho)*d.z)-(Math.sin(rho)*d.x)}
 }
 export const rotZ = function(d,gamma){
    return {x:Math.cos(gamma)*d.x - Math.sin(gamma)*d.y,y:Math.sin(gamma)*d.x+Math.cos(gamma)*d.y,z:d.z}
 }

export const colouredText = function(msg, colour) {
    return "<text class='"+colour+"'>"+msg+"</text>";
}

export const assert = function(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

// container for sharing data accross classes
export class Data {
    constructor(shared) {
        this.sharedData = shared;
    }
}


