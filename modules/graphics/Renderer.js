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

  // public member functions
  this.setSpeed = function(n){
    freq = n;
    if(ui)
    {
      ui.log("frequency set to "+n +" updates/s")
    }
  };
  this.setFPS = function(n){
    fps = n;
    if(ui){
      ui.log("fps set to "+ui.colouredText(n,"blue"))
    }
  };
  this.render = function(){
    start = performance.now();
    animate();
  };
  this.setLattice = function(l){

    lattice = l
  }
  //this.setCanvas = function(c){
  //  ui.canvas = c
  //}
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
  this.setUpdates = function(u)
  {
    updates = u;
  }
  this.setUI = function(u){

    ui=u

    ui.canvas.addEventListener(
      "mousemove",
      function(event) {

        var ClientRect = this.getBoundingClientRect();
        mouseX = (event.clientX - ClientRect.left);
        mouseY = (event.clientY - ClientRect.top);

        if(dragOn){
          rho = rhoLast+((mouseX - dragStartX) * 0.01);
          theta = thetaLast+((mouseY - dragStartY) * 0.01);
        }
      },
      false
    );

    ui.canvas.addEventListener("click", function(event){

      event.preventDefault();
      var active = []
      lattice.data.forEach(function(n) {
        var onScreenPos = cameraView(n.ri);
        var isHit = (Math.abs(centreToScreenXPeriodic(onScreenPos.x, ui.canvas.width) - mouseX) < n.r) && (Math.abs(centreToScreenYPeriodic(onScreenPos.y, ui.canvas.height)- mouseY) < n.r)
        if (isHit && n.visible){
          active.push(n)
        }
      });

      active.sort(function(a, b) {
          var onScreenPos1 = cameraView(a.ri);
          var onScreenPos2 = cameraView(b.ri);
          return onScreenPos1.z - onScreenPos2.z;
        });

      if(active.length!=0)
      {
        ui.highlight(active[0].id)
      }
    }, false)

    ui.canvas.addEventListener("mousedown", function(event){
      var ClientRect = this.getBoundingClientRect();
      dragOn = true;
      event.preventDefault();
      dragStartX = (event.clientX - ClientRect.left);
      dragStartY = (event.clientY - ClientRect.top);
    }, false)

    ui.canvas.addEventListener("mouseout",function(event){
      dragOn = false;
      rhoLast = rho;
      thetaLast = theta;
    },false)

    ui.canvas.addEventListener("mouseup", function(event){
      dragOn = false;
      rhoLast = rho;
      thetaLast = theta;
    }, false)

  }

    // private member variables
    var frames = 0;
    var elapsed = 0; // in seconds
    var start = 0; // start timestamp
    var rho = 0
    var translate={x:0,y:0,z:0};
    var theta = 0
    var rhoLast = 0
    var thetaLast = 0
    var fps = 30
    var freq = 1 // in seconds^-1
    var updateCounter = 0;
    var highlighted = false;


    var lattice = false;
    var updates;
    var mouseX = 0;
    var mouseY = 0;
    var dragStartX = 0;
    var dragStartY = 0;
    var dragOn=false;

    var drawCall = false;
    var updates = [];
    var lattice = false;
    var ui = false;

    var cameraView = function(d){

      if(ui.highlighted()!==false)
      {
        var origin = lattice.data[ui.highlighted()];
        var translated = translateVec(d, {x:(-origin.ri.x),y:(-origin.ri.y),z:(-origin.ri.z)})
        return rotY(rotX(translated,theta),rho)
      }
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

      ui.infoBox.innerHTML = "rho: " + parseFloat(rho).toFixed(2) +"</br> "
      ui.infoBox.innerHTML += "theta: " + parseFloat(theta).toFixed(2) + "</br>";
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
      ui.infoBox.innerHTML += "fps: " + fpsDisplay + "</br>";

      if(ui.highlighted()!==false)
      {
        var datapoint = lattice.data[ui.highlighted()];

        ui.infoBox.innerHTML +="<text class=green>Focused node id: #"+ui.highlighted()+"</text></br>";
        ui.infoBox.innerHTML += "name: "+datapoint.name+"</br>";
        ui.infoBox.innerHTML += "x: "+parseFloat(datapoint.ri.x).toFixed(2)+", y: "+parseFloat(datapoint.ri.y).toFixed(2)+", z: "+parseFloat(datapoint.ri.z).toFixed(2) + "</br>";
        ui.infoBox.innerHTML += "mass: "+parseFloat(datapoint.m).toFixed(2)+", radius: " + parseFloat(datapoint.r).toFixed(2)+"</br>";

        var forces = datapoint.forces;
        if(Array.isArray(forces) && forces.length)
        {
          ui.infoBox.innerHTML += "force(s): (<text class=green>" + forces.length + "</text>) total"
          for(let i = 0; i<forces.length; i++)
          {
            force = forces[i];

            if(force.name=="spring")
            {
              ui.infoBox.innerHTML += "</br>&emsp;" +force.name + "</br>"
              ui.infoBox.innerHTML += "&emsp;&emsp;Neighbour: "+force.params[2] +" ("+lattice.data[force.params[2]].name+")"+"</br>"
              ui.infoBox.innerHTML += "&emsp;&emsp;equil. distance: "+(force.params[1]).toFixed(2) + "</br>"
              ui.infoBox.innerHTML += "&emsp;&emsp;Extension: "+ (force.params[1] - Physics.Vector.norm(Physics.Vector.sub(datapoint.ri, lattice.data[force.params[2]].ri)) ).toFixed(2)+"</br>"
              ui.infoBox.innerHTML += "&emsp;&emsp;K: "+force.params[0] + "</br>"
            }

            if(force.name=="valenceAngle")
            {
              var ba = Physics.Vector.sub(datapoint.ri,lattice.data[force.params[2]].ri);
              var bc = Physics.Vector.sub(datapoint.ri,lattice.data[force.params[3]].ri);
              var abc = Physics.Vector.angle(ba, bc);

              ui.infoBox.innerHTML += "</br>&emsp;" + "valence angle" + "</br>"
              ui.infoBox.innerHTML += "&emsp;&emsp;Neighbours:</br>&emsp;&emsp;&emsp;"+force.params[2]
              +" ("+lattice.data[force.params[2]].name+")"+", "+force.params[3]+" ("+lattice.data[force.params[3]].name+")"+"</br>";
              ui.infoBox.innerHTML += "&emsp;&emsp;equil. angle: "+(force.params[1]).toFixed(2) + "</br>"
              ui.infoBox.innerHTML += "&emsp;&emsp;angle: "+ abc.toFixed(2) + "</br>"
              ui.infoBox.innerHTML += "&emsp;&emsp;K: "+force.params[0] + "</br>"
            }
          }
        }
      }

      if(ui.infoBox.getBoundingClientRect().height>document.getElementById("sim").getBoundingClientRect().height){
        ui.infoBox.style.height = document.getElementById("sim").style.height;
      } else {
        ui.infoBox.style.height = "auto";
      }
    }
    var drawToolTip = function()
    {
      var active = []
      lattice.data.forEach(function(n) {
        var imagePos = cameraView(n.ri);
        var isHit = (Math.abs(centreToScreenXPeriodic(imagePos.x, ui.canvas.width) - mouseX) < n.r) && (Math.abs(centreToScreenYPeriodic(imagePos.y, ui.canvas.height) - mouseY) < n.r)
        if (isHit && n.visible){
          active.push(n)
        }
      });

      active.sort(function(a, b) {
          var imagePos1 = cameraView(a.ri);
          var imagePos2 = cameraView(b.ri);
          return imagePos1.z - imagePos2.z;
        });

      if(active.length!=0)
      {
        ui.showTooltip([mouseX,mouseY], active[0].id)
      } else {
        ui.hideTooltip()
      }
    }

    var defaultDrawCall = function(){

      var ctx = ui.canvas.getContext("2d");
      ctx.clearRect(0,0, ui.canvas.width, ui.canvas.height);

       ctx.fillStyle = "cornsilk";
       ctx.fillRect(0, 0, ui.canvas.width, ui.canvas.height);

       // need to copy and reorder ids for sorting draw order
       var forSort = [];
       lattice.data.forEach((node) => {
         forSort.push(node.id);
       });
       forSort.sort(
         function(a, b) {
           var imagePos1 = cameraView(lattice.data[a].ri);
           var imagePos2 = cameraView(lattice.data[b].ri);
           return imagePos2.z - imagePos1.z;
         });

       forSort.forEach((id) => {
         var n = lattice.data[id];
         if(n.visible){
           var imagePos = cameraView(n.ri);
         ctx.beginPath();
         ctx.arc( centreToScreenXPeriodic(imagePos.x, ui.canvas.width), centreToScreenYPeriodic(imagePos.y, ui.canvas.height), n.r, 0, 2 * Math.PI);
         ctx.closePath();
         ctx.fillStyle = n.col;
         ctx.lineWidth = 1;
         ctx.strokeStyle = n.stroke;
         ctx.fill();
         ctx.stroke();

         if(lattice.showEdges())
         {
           n.forces.forEach((force) => {
             if(force.name=="spring"){
               if(n.showEdges)
               {
                 var imagePos1 = cameraView(lattice.data[force.params[2]].ri)
                 ctx.beginPath();       // Start a new path
                 ctx.moveTo(centreToScreenXPeriodic(imagePos.x, ui.canvas.width), centreToScreenYPeriodic(imagePos.y, ui.canvas.height));
                 ctx.lineTo(centreToScreenXPeriodic(imagePos1.x, ui.canvas.width), centreToScreenYPeriodic(imagePos1.y, ui.canvas.height));
                 ctx.closePath();
                 ctx.strokeStyle = n.edgeStroke;
                 ctx.stroke();
                }
           }
           });
         }
       }
     }
     )
     }
    var redraw = function(){
       if(drawCall){
         drawCall()
       } else {
         defaultDrawCall();
       }
   }
    var animate = function(){
      var end = performance.now();
      elapsed = (end - start)/1000;

      if(elapsed > (1/freq* updateCounter)){
        update();
        updateCounter++;
      }
      requestAnimationFrame(animate);
     if (elapsed > frames * (1/fps))
     {
       drawInfo();
       drawToolTip();
       redraw();
       frames++;
     }
   }

  return this;
};

Graphics.Renderer = new Renderer();
