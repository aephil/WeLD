/**
 * Renderer.js
 *
 * Copyright (C) 06-09-2021, Author Takudzwa Makoni
 * <https://github.com/aephil/WeLD>
 *
 * This Program is free software: you can redistribute
 * it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *
 * This Program is distributed in the hope that it will
 * be useful, but WITHOUT ANY WARRANTY; without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with This Program. If not, see <http://www.gnu.org/licenses/>.
 *
 * @license GPL-3.0+ <http://spdx.org/licenses/GPL-3.0+>
 */

var Renderer = function () {

  // public member variables


  // public member functions
  this.setSpeed = function(n){
    freq = n;
    if(ui)
    {
      ui.log("frequency set to "+n +"/ms")
    }
  };
  this.setFPS = function(n){
    fps = n;
    if(this.ui){
      this.ui.log("fps set to "+this.ui.colouredText(n,"blue"))
    }
  };
  this.render = function(){
    if (showInfo) initInfo();
    start = performance.now();
    animate();
  };
  this.setLattice = function(l){

    lattice = l
  }
  this.setCanvas = function(c){
    ui.canvas = c
  }
  this.setDrawCall = function(d){
    drawCall = d;
  }
  this.setShowInfo = function(b){
    showInfo = b
  }
  this.setRho = function(angle){
    rho = angle
  }
  this.setTheta = function(angle){
    theta = angle
  }
  this.setUI = function(u){

    ui=u
  }
  this.setUpdates = function(u){

    updates = u
  }

    // private member variables
    var frames = 0;
    var elapsed = 0; // in milliseconds
    var start = 0; // start timestamp
    var rho = 0
    var theta = 0.5
    var lattice = false;
    var xcanvas = false;
    var drawCall = false;
    var showInfo = true;
    var updates = [];
    var lattice = false;
    var ui = false;

    // private member functions
    var initInfo = function(){
        var infoBox = document.createElement("div");
        infoBox.setAttribute("id", "infoBox");
        infoBox.style.position = "fixed";
        infoBox.style.padding = "2.5px";
        infoBox.style.backgroundColor = "rgba(0,0,0,0.5)";
        infoBox.style.width = "15%";
        infoBox.style.color = "rgb(173,172,173)";
        infoBox.style.height = "7%";
        infoBox.style.top = document.getElementById("sim").style.top;
        infoBox.style.left = document.getElementById("sim").style.left;
        infoBox.style.zIndex = document.getElementById("sim").style.zIndex + 1;
        document.body.appendChild(infoBox);
    }
    var cameraView = function(d){
      return rotY(rotX(d,theta),rho);
    }
    var update = function(){
      lattice.data.forEach((d) => {
        updates.forEach((fn) => {
          fn(d,lattice.data);
        });
      });
    }
    var drawInfo = function(){
      var infoBox = document.getElementById("infoBox");
      infoBox.innerHTML = "rho: " + parseFloat(rho).toFixed(2) +"</br> "
      infoBox.innerHTML += "theta: " + parseFloat(theta).toFixed(2) + "</br>";
      var realFPS = (frames / elapsed).toFixed(2);
      var fpsRatio = (realFPS/fps)
      var fpsDisplay;
      if(fpsRatio > 0.7){
        fpsDisplay = "<text class='green'>"+realFPS+"</text>"
      } else if(fpsRatio > 0.5){
        fpsDisplay = "<text class='orange'>"+realFPS+"</text>"
      } else {
        fpsDisplay = "<text class='red'>"+realFPS+"</text>"
      }
      infoBox.innerHTML += "fps: " + fpsDisplay + "</br>";
    }
    var defaultDrawCall = function(){

    var ctx = ui.canvas.getContext("2d");
       ctx.clearRect(0,0, ui.canvas.width, ui.canvas.height);

       ctx.fillStyle = "rgb(33,33,37)";
       ctx.fillRect(0, 0, ui.canvas.width, ui.canvas.height);

       lattice.data.sort(
         function(a, b) {

           imagePos1 = rotY(rotX(a,theta),rho);
           imagePos2 = rotY(rotX(b,theta),rho);
           return imagePos1.z - imagePos2.z;
         });

       lattice.data.forEach((n) => {
         var imagePos = cameraView(n);
         ctx.beginPath();
         ctx.arc( centreToScreenX(imagePos.x, ui.canvas.width), centreToScreenY(imagePos.y, ui.canvas.height), n.r, 0, 2 * Math.PI);
         ctx.closePath();
         ctx.fillStyle = n.col;
         ctx.lineWidth = 0.5;
         ctx.fill();
         ctx.stroke();

         if(lattice.showEdges())
         {

           n.neighbours.forEach((neighbour) => {


             if(n.showEdges)
             {
               var imagePos1 = cameraView(lattice.data[neighbour[0]])

               ctx.beginPath();       // Start a new path
               ctx.moveTo(centreToScreenX(imagePos.x, ui.canvas.width), centreToScreenY(imagePos.y, ui.canvas.height));
               ctx.lineTo(centreToScreenX(imagePos1.x, ui.canvas.width), centreToScreenY(imagePos1.y, ui.canvas.height));
               ctx.stroke();
             }
           });
         }
       })
       rho+=0.01



     }
    var redraw = function(){
       if(drawCall){
         drawCall()
       } else {
         defaultDrawCall();
       }
   }
    var animate = function(){
     update();
     requestAnimationFrame(animate);

     var end = performance.now();
     elapsed = (end - start)/1000;
     if (elapsed > frames * (1/fps))
     {
       var x = showInfo;
       if (showInfo) drawInfo();
       redraw();
       frames++;
     }
   }

  return this;
};

Graphics.Renderer = new Renderer();
