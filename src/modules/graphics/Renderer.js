import {rotX, rotY, centreToScreenXPeriodic, centreToScreenYPeriodic} from '../helpers.js'
import Vector from '../physics/Vector.js';

const Renderer = function () {

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

  this.setDebug = function(debugFunc) {
    debug = debugFunc
  }

  this.setNodeUpdates = function(u) {
    nodeUpdates = u;
  }

  this.setUI = function(u){

    ui=u

    ui.canvas.addEventListener(
      "mousemove",
      function(event) {

        const ClientRect = this.getBoundingClientRect();
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
      const active = []
      lattice.data.forEach(function(n) {
        const onScreenPos = cameraView(n.ri);
        const isHit = (Math.abs(centreToScreenXPeriodic(onScreenPos.x, ui.canvas.width) - mouseX) < n.r) && (Math.abs(centreToScreenYPeriodic(onScreenPos.y, ui.canvas.height)- mouseY) < n.r)
        if (isHit && n.visible){
          active.push(n)
        }
      });

      active.sort(function(a, b) {
          const onScreenPos1 = cameraView(a.ri);
          const onScreenPos2 = cameraView(b.ri);
          return onScreenPos1.z - onScreenPos2.z;
        });

      if(active.length!=0)
      {
        ui.highlight(active[0].id)
      }
    }, false)

    ui.canvas.addEventListener("mousedown", function(event){
      const ClientRect = this.getBoundingClientRect();
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
    let frames = 0;
    let elapsed = 0; // in seconds
    let start = performance.now(); // start timestamp

    let rho = 0
    let translate={x:0,y:0,z:0};
    let theta = 0
    let rhoLast = 0
    let thetaLast = 0
    let fps = 30
    let freq = 1 // in seconds^-1
    let updateCounter = 0;
    let highlighted = false;

    document.addEventListener("visibilitychange", event => {
      if (document.visibilityState == "visible") {
        ui.logWarning("starting live fps counter")
      } else {
        ui.logWarning("page was inactive, restarting fps counter");
        // restart the clock and frame counter
        start = performance.now();
        frames = 0;
      }
    })


    let lattice = false;
    let nodeUpdates;
    let updates = [];
    let debug = false;
    let mouseX = 0;
    let mouseY = 0;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragOn=false;
    let drawCall = false;
    let ui = false;

    const cameraView = function(pos){

      if(ui.highlighted()!==false)
      {
        const origin = Vector.scale(-1,lattice.data[ui.highlighted()].ri);
        const translated = Vector.translate(pos ,origin);
        return rotY(rotX(translated,theta),rho)
      }
      return rotY(rotX(pos,theta),rho);
    }

    const update = function(){
      // node updates
      lattice.data.forEach((d) => {
        nodeUpdates.forEach((fn) => {
          fn(d,lattice.data);
        });
      });
      // updates
      updates.forEach((fn) => {
        fn(lattice.data);
      });
      
      if (debug) {
        debug(lattice.data);
      }


    }
    const drawInfo = function(){

      ui.infoBox.innerHTML = "rho: " + parseFloat(rho).toFixed(2) +"</br> "
      ui.infoBox.innerHTML += "theta: " + parseFloat(theta).toFixed(2) + "</br>";
      const realFPS = (frames / elapsed).toFixed(2);
      const fpsRatio = (realFPS/fps)
      let fpsDisplay;
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
        const datapoint = lattice.data[ui.highlighted()];
        ui.infoBox.innerHTML +="<text class=green>Focused node id: #"+ui.highlighted()+"</text></br>";
        ui.infoBox.innerHTML += "name: "+datapoint.name+"</br>";
        ui.infoBox.innerHTML += "x: "+parseFloat(datapoint.ri.x).toFixed(2)+", y: "+parseFloat(datapoint.ri.y).toFixed(2)+", z: "+parseFloat(datapoint.ri.z).toFixed(2) + "</br>";
        ui.infoBox.innerHTML += "v: "+parseFloat(datapoint.vi.x).toFixed(2)+", y: "+parseFloat(datapoint.vi.y).toFixed(2)+", z: "+parseFloat(datapoint.vi.z).toFixed(2) + "</br>";
        ui.infoBox.innerHTML += "mass: "+parseFloat(datapoint.m).toFixed(2)+", radius: " + parseFloat(datapoint.r).toFixed(2)+"</br>";

        const forces = datapoint.forces;
        if(Array.isArray(forces) && forces.length)
        {
          ui.infoBox.innerHTML += "force(s): (<text class=green>" + forces.length + "</text>) total"
          for(let i = 0; i<forces.length; i++)
          {
            const force = forces[i];

            if(force.name=="spring")
            {
              ui.infoBox.innerHTML += "</br>&emsp;" +force.name + "</br>"
              ui.infoBox.innerHTML += "&emsp;&emsp;Neighbour: "+force.params[2] +" ("+lattice.data[force.params[2]].name+")"+"</br>"
              ui.infoBox.innerHTML += "&emsp;&emsp;equil. distance: "+(force.params[1]).toFixed(2) + "</br>"
              ui.infoBox.innerHTML += "&emsp;&emsp;Extension: "+ (force.params[1] - Vector.norm(Vector.sub(datapoint.ri, lattice.data[force.params[2]].ri)) ).toFixed(2)+"</br>"
              ui.infoBox.innerHTML += "&emsp;&emsp;K: "+force.params[0] + "</br>"
            }

            if(force.name=="valenceAngle")
            {
              const ba = Vector.sub(datapoint.ri,lattice.data[force.params[2]].ri);
              const bc = Vector.sub(datapoint.ri,lattice.data[force.params[3]].ri);
              const abc = Vector.angle(ba, bc);

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

      if(ui.infoBox.getBoundingClientRect().height>document.getElementById("control").getBoundingClientRect().height/2){
        ui.infoBox.style.height = document.getElementById("control").style.height/2;
      } else {
        ui.infoBox.style.height = "auto";
      }
    }
    const drawToolTip = function()
    {
      const active = []
      lattice.data.forEach(function(n) {
        const imagePos = cameraView(n.ri);
        const isHit = (Math.abs(centreToScreenXPeriodic(imagePos.x, ui.canvas.width) - mouseX) < n.r) && (Math.abs(centreToScreenYPeriodic(imagePos.y, ui.canvas.height) - mouseY) < n.r)
        if (isHit && n.visible){
          active.push(n)
        }
      });

      active.sort(function(a, b) {
          const imagePos1 = cameraView(a.ri);
          const imagePos2 = cameraView(b.ri);
          return imagePos1.z - imagePos2.z;
        });

      if(active.length!=0)
      {
        ui.showTooltip([mouseX,mouseY], active[0].id)
      } else {
        ui.hideTooltip()
      }
    }

    const defaultDrawCall = function(){

      const ctx = ui.canvas.getContext("2d");
      ctx.clearRect(0,0, ui.canvas.width, ui.canvas.height);

       ctx.fillStyle = "cornsilk";
       ctx.fillRect(0, 0, ui.canvas.width, ui.canvas.height);

       // need to copy and reorder ids for sorting draw order
       const forSort = [];
       lattice.data.forEach((node) => {
         forSort.push(node.id);
       });
       forSort.sort(
         function(a, b) {
           const imagePos1 = cameraView(lattice.data[a].ri);
           const imagePos2 = cameraView(lattice.data[b].ri);
           return imagePos2.z - imagePos1.z;
         });

       forSort.forEach((id) => {
         const n = lattice.data[id];
         if(n.visible){
           const imagePos = cameraView(n.ri);
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
                 const imagePos1 = cameraView(lattice.data[force.params[2]].ri)
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
    const redraw = function(){
       if(drawCall){
         drawCall()
       } else {
         defaultDrawCall();
       }
   }
    const animate = function(){
      const end = performance.now();
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

export const renderer = new Renderer();
export default renderer;
