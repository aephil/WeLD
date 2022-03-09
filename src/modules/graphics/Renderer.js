import {assert, Data, rotX, rotY, centreToScreenXPeriodic, centreToScreenYPeriodic, colouredText} from '../helpers.js'
import Vector from '../physics/Vector.js';

export class Renderer extends Data
{
  constructor(shared)
  {
    super(shared);

    // expected shared member variables
    assert(this.sharedData!==undefined, "expected shared data");

    // shared member variables
    this.sharedData.highlighted = false;

    // private member variables
    this.frames = 0;
    this.elapsed = 0; // in seconds
    this.start = performance.now(); // start timestamp
    this.rho = 0
    this.translate={x:0,y:0,z:0};
    this.theta = 0;
    this.rhoLast = 0
    this.thetaLast = 0
    this.fps = 30 // framerate for drawing graphics
    this.freq = 1 // do physics updates at this rate in seconds^-1
    this.updateCounter = 0;
    this.pause = false;

    this.updates = [];
    this.nodeUpdates = [];
    this.debug;
    this.probe = true;
    this.probeCounter = 0;
    this.sharedData.sampleSize = 100;
    this.probeRate = 50;
    this.sharedData.samples1 = [];
    this.sharedData.samples2 = [];
    this.sharedData.samples3 = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.dragOn=false;
    this.drawCall = false;
    this.ui;

    document.addEventListener("visibilitychange", (event) => {
      if (document.visibilityState == "visible") {
        this.pause = false;
        this.start = performance.now(); // add small delay from end.
        this.frames = 0;
      } else {
        this.pause = true;
      }
    })

  }

  setSpeed(n){
    this.freq = n;
    if(this.ui)
    {
      this.ui.terminal.log("frequency set to "+n +" updates/s")
    }
  };

  setFPS(n){
    this.fps = n;
    if(this.ui){
      this.ui.terminal.log("fps set to "+colouredText(n,"blue"))
    }
  };

  animate = () =>
  {
    if (!(this.pause))
    {
      const end = performance.now();
      this.elapsed = (end - this.start)/1000;

      if(this.elapsed > (1/this.freq* this.updateCounter)){
        this.update();
        this.updateCounter++;
      }
      requestAnimationFrame(this.animate);
      if (this.elapsed > this.frames * (1/this.fps))
      {
        this.drawInfo();
        this.drawToolTip();
        this.redraw();
        if (this.probe) {
            this.ui.drawChart(this.sharedData.samples1, 'red', 0);
            this.ui.drawChart(this.sharedData.samples2, 'blue', 0, true);
            this.ui.drawChart(this.sharedData.samples3, 'green', 0, true);
          }
        this.frames++;
      }
    }
  }

  render(){
    this.start = performance.now();
    this.animate();
  };

  setRho(angle){
    this.rho = angle
  }

  setTheta(angle){
    this.theta = angle
  }

  setUpdates(u)
  {
    this.updates = u;
  }

  setNodeUpdates(u)
  {
    this.updates = u;
  }

  setDebug(debugFunc) {
    this.debug = debugFunc
  }

  setUI(u)
  {

    this.ui=u

    this.ui.canvas.addEventListener(
      "mousemove",
      (event) => {

        const ClientRect = this.ui.canvas.getBoundingClientRect();
        this.mouseX = (event.clientX - ClientRect.left);
        this.mouseY = (event.clientY - ClientRect.top);

        if(this.dragOn){
          this.rho = this.rhoLast+((this.mouseX - this.dragStartX) * 0.01);
          this.theta = this.thetaLast+((this.mouseY - this.dragStartY) * 0.01);
        }
      },
      false
    );

    this.ui.canvas.addEventListener("click", (event) => {

      event.preventDefault();
      const active = []
      this.sharedData.nodes.forEach( (n) => {
        const onScreenPos = this.cameraView(n.ri);

        const isHit = (Math.abs(centreToScreenXPeriodic(onScreenPos.x, this.ui.canvas.width) - this.mouseX) < n.r)
        && (Math.abs(centreToScreenYPeriodic(onScreenPos.y, this.ui.canvas.height)- this.mouseY) < n.r)

        if (isHit && n.visible){
          active.push(n)
        }
      });

      active.sort((a, b)=> {
          const onScreenPos1 = this.cameraView(a.ri);
          const onScreenPos2 = this.cameraView(b.ri);
          return onScreenPos1.z - onScreenPos2.z;
        });

      if(active.length!=0)
      {
        const i = parseInt(active[0].id);
        const datapoint = this.sharedData.nodes[i];

        if(datapoint.stroke=="red")
        {
          datapoint.stroke="black";
          this.sharedData.highlighted=false;
        }
        else
        {
          datapoint.stroke = "red";
          if (this.sharedData.highlighted!==false)
          {
            const j = this.sharedData.highlighted;
            this.sharedData.nodes[j].stroke = "black";
          }
          this.sharedData.highlighted=i;
          this.ui.terminal.log("selected node "+colouredText("#"+i,"green"))
        }
      }
    }, false)

    this.ui.canvas.addEventListener("mousedown", (event) => {
      const ClientRect = this.ui.canvas.getBoundingClientRect();
      this.dragOn = true;
      event.preventDefault();
      this.dragStartX = (event.clientX - ClientRect.left);
      this.dragStartY = (event.clientY - ClientRect.top);
    }, false)

    this.ui.canvas.addEventListener("mouseout", (event) => {
      this.dragOn = false;
      this.rhoLast = this.rho;
      this.thetaLast = this.theta;
    },false)

    this.ui.canvas.addEventListener("mouseup", (event) => {
      this.dragOn = false;
      this.rhoLast = this.rho;
      this.thetaLast = this.theta;
    }, false)

  }

cameraView(pos)
{
  if(this.sharedData.highlighted!==false)
  {
    const highlighted = this.sharedData.highlighted;
    const origin = Vector.scale(-1,this.sharedData.nodes[highlighted].ri);
    const translated = Vector.translate(pos ,origin);
    return rotY(rotX(translated,this.theta),this.rho)
  }
  return rotY(rotX(pos,this.theta),this.rho);
}

  update(){
    // node updates
    this.sharedData.nodes.forEach((d) => {
      this.nodeUpdates.forEach((fn) => {
        fn(d,this.sharedData);
      });
    });
    // updates
    this.updates.forEach((fn) => {
      fn(this.sharedData);
    });

    if (this.debug) {
      //this.debug(lattice);
    }

    if (this.probe) {

      if (this.sharedData.samples1.length>this.sharedData.sampleSize)
      {
        this.sharedData.samples1.shift();
      }
      if (this.sharedData.samples2.length>this.sharedData.sampleSize)
      {
        this.sharedData.samples2.shift();
      }
      if (this.sharedData.samples3.length>this.sharedData.sampleSize)
      {
        this.sharedData.samples3.shift();
      }

      if (this.sharedData.highlighted===false)
      {
        const KE = this.sharedData.quantities[0].value;
        const PE = this.sharedData.quantities[1].value;

        this.sharedData.samples1.push(KE);
        this.sharedData.samples2.push(PE);
        this.sharedData.samples3.push(KE+PE);

        if (this.probeCounter % this.probeRate === 0)
        {
          this.ui.chartDesc.innerHTML =
          `
          <p>
          <text class="grey">Probing lattice every ${this.probeRate} updates</text><br>
          <text class="red">Kinetic Energy</text> ${KE.toPrecision(5)}<br>
          <text class="blue">Potential Energy</text> ${PE.toPrecision(5)}<br>
          <text class="green">Total Energy</text> ${(KE+PE).toPrecision(5)}<br>
          </p>
          `
        }
      }
      else
      {
        const i = this.sharedData.highlighted;
        const d = this.sharedData.nodes[i];
        const KE = 0.5 * d.m *  (d.vi.x ** 2 + d.vi.y ** 2 + d.vi.z ** 2);
        const PE = this.sharedData.nodes[i].potential;

        this.sharedData.samples1.push(KE);
        this.sharedData.samples2.push(PE);
        this.sharedData.samples3.push(KE+PE);

        if (this.probeCounter % (this.probeRate/10.) === 0)
        {

          this.ui.chartDesc.innerHTML =
          `
          <p>
          <text class="grey">Probing node #${i} every ${(this.probeRate/10.)} updates</text><br>
          <text class="red">Kinetic Energy</text> ${KE.toPrecision(5)}<br>
          <text class="blue">Potential Energy</text> ${PE.toPrecision(5)}<br>
          <text class="green">Total Energy</text> ${(KE+PE).toPrecision(5)}<br>
          </p>
          `
        }
      }


      this.probeCounter++;
    }
  }

  redraw()
  {
    const ctx = this.ui.canvas.getContext("2d");
    ctx.clearRect(0,0, this.ui.canvas.width, this.ui.canvas.height);

    ctx.fillStyle = "cornsilk";
    ctx.fillRect(0, 0, this.ui.canvas.width, this.ui.canvas.height);

     // need to copy and reorder ids for sorting draw order
    const forSort = [];
    this.sharedData.nodes.forEach((node) => {
      forSort.push(node.id);
    });

    forSort.sort(
      (a, b) => {
        const imagePos1 = this.cameraView(this.sharedData.nodes[a].ri);
        const imagePos2 = this.cameraView(this.sharedData.nodes[b].ri);
        return imagePos2.z - imagePos1.z;
      });

     forSort.forEach( (id) => {

       const n = this.sharedData.nodes[id];

       if (n.visible)
       {
        const imagePos = this.cameraView(n.ri);

        ctx.beginPath();
        ctx.arc( centreToScreenXPeriodic(imagePos.x, this.ui.canvas.width),
        centreToScreenYPeriodic(imagePos.y, this.ui.canvas.height), n.r, 0, 2 * Math.PI);
        ctx.closePath();

        ctx.fillStyle = n.col;
        ctx.lineWidth = 1;
        ctx.strokeStyle = n.stroke;

        ctx.fill();
        ctx.stroke();

       if(this.sharedData.showingEdges)
       {
         n.forces.forEach((force) => {
           if(force.name=="spring")
           {
             if(n.showEdges)
             {
               const imagePos1 = this.cameraView(this.sharedData.nodes[force.params[2]].ri);
               ctx.beginPath();       // Start a new path
               ctx.moveTo(centreToScreenXPeriodic(imagePos.x, this.ui.canvas.width), centreToScreenYPeriodic(imagePos.y, this.ui.canvas.height));
               ctx.lineTo(centreToScreenXPeriodic(imagePos1.x, this.ui.canvas.width), centreToScreenYPeriodic(imagePos1.y, this.ui.canvas.height));
               ctx.closePath();
               ctx.strokeStyle = n.edgeStroke;
               ctx.stroke();
              }
            }
         });
       }
     }
   })
  }

drawInfo(){

    this.ui.textInfo.innerHTML = "rho: " + parseFloat(this.rho).toFixed(2) +"</br> "
    this.ui.textInfo.innerHTML += "theta: " + parseFloat(this.theta).toFixed(2) + "</br>";
    const realFPS = (this.frames / this.elapsed).toFixed(2);
    const fpsRatio = (realFPS/this.fps)
    let fpsDisplay;
    if(fpsRatio > 0.7){
      fpsDisplay = "<text class='green'>"+realFPS+"</text>"
    } else if(fpsRatio > 0.5){
      fpsDisplay = "<text class='orange'>"+realFPS+"</text>"
    } else {
      fpsDisplay = "<text class='red'>"+realFPS+"</text>"
    }
    this.ui.textInfo.innerHTML += "fps: " + fpsDisplay + "</br>";

    if(this.sharedData.highlighted!==false)
    {
      const highlighted = this.sharedData.highlighted;
      const nodes = this.sharedData.nodes;
      const datapoint = nodes[highlighted];
      this.ui.textInfo.innerHTML +="<text class=green>Focused node id: #"+this.sharedData.highlighted+"</text></br>";
      this.ui.textInfo.innerHTML += "name: "+datapoint.name+"</br>";
      this.ui.textInfo.innerHTML += "x: "+parseFloat(datapoint.ri.x).toFixed(2)+", y: "+parseFloat(datapoint.ri.y).toFixed(2)+", z: "+parseFloat(datapoint.ri.z).toFixed(2) + "</br>";
      this.ui.textInfo.innerHTML += "v: "+parseFloat(datapoint.vi.x).toFixed(2)+", y: "+parseFloat(datapoint.vi.y).toFixed(2)+", z: "+parseFloat(datapoint.vi.z).toFixed(2) + "</br>";
      this.ui.textInfo.innerHTML += "mass: "+parseFloat(datapoint.m).toFixed(2)+", radius: " + parseFloat(datapoint.r).toFixed(2)+"</br>";


      // variable for counting the number of valence interaction
      // a node is part of
      let nValence = 0;
      const forces = datapoint.forces;
      if(Array.isArray(forces) && forces.length)
      {
        this.ui.textInfo.innerHTML += "force(s): (<text class=green>" + forces.length + "</text>) total"
        for(let i = 0; i<forces.length; i++)
        {
          const force = forces[i];

          if(force.name=="spring")
          {
            this.ui.textInfo.innerHTML += "</br>&emsp;" +force.name + "</br>"
            this.ui.textInfo.innerHTML += "&emsp;&emsp;Neighbour: "+force.params[2] +" ("+nodes[force.params[2]].name+")"+"</br>"
            this.ui.textInfo.innerHTML += "&emsp;&emsp;equil. distance: "+(force.params[1]).toFixed(2) + "</br>"
            this.ui.textInfo.innerHTML += "&emsp;&emsp;Extension: "+ (force.params[1] - Vector.norm(Vector.sub(datapoint.ri, nodes[force.params[2]].ri)) ).toFixed(2)+"</br>"
            this.ui.textInfo.innerHTML += "&emsp;&emsp;K: "+force.params[0] + "</br>"
          }

          if(force.name=="valenceAngle")
            nValence++;
            // commented this out because it causes way too much lag
          {
              //            const ba = Vector.sub(datapoint.ri,nodes[force.params[2]].ri);
              //            const bc = Vector.sub(datapoint.ri,nodes[force.params[3]].ri);
              //            const abc = Vector.angle(ba, bc);
              //
              //            this.ui.textInfo.innerHTML += "</br>&emsp;" +force.name + "</br>"
              //            // this.ui.textInfo.innerHTML += "&emsp;&emsp;Neighbour: "+force.params[2] +" ("+nodes[force.params[2]].name+")"+"</br>"
              //            // this.ui.textInfo.innerHTML += "&emsp;&emsp;equil. distance: "+(force.params[1]).toFixed(2) + "</br>"
              //            // this.ui.textInfo.innerHTML += "&emsp;&emsp;Extension: "+ (force.params[1] - Vector.norm(Vector.sub(datapoint.ri, nodes[force.params[2]].ri)) ).toFixed(2)+"</br>"
              //            // this.ui.textInfo.innerHTML += "&emsp;&emsp;K: "+force.params[0] + "</br>"
              //
              //              this.ui.textInfo.innerHTML += `&emsp;&emsp;equilibrium angle: ${force.params[1]}`;
              //              this.ui.textInfo.innerHTML += "<br>";
              //              this.ui.textInfo.innerHTML += `&emsp;&emsp;Neighbours: <br>&emsp;&emsp;${force.params[2]}`
              //            // this.ui.textInfo.innerHTML += "&emsp;&emsp;Neighbours:</br>&emsp;&emsp;&emsp;"+force.params[2]
              //            // +" ("+nodes[force.params[2]].name+")"+", "+force.params[3]+" ("+nodes[force.params[3]].name+")"+"</br>";
              //            // this.ui.textInfo.innerHTML += "&emsp;&emsp;equil. angle: "+(force.params[1]).toFixed(2) + "</br>"
              //            // this.ui.textInfo.innerHTML += "&emsp;&emsp;angle: "+ abc.toFixed(2) + "</br>"
              //            // this.ui.textInfo.innerHTML += "&emsp;&emsp;K: "+force.params[0] + "</br>"
          }
        }
      }

      this.ui.textInfo.innerHTML += `${nValence} different valence interactions`
    }

  }

drawToolTip()
  {
    const active = []
    this.sharedData.nodes.forEach((n) => {
      const imagePos = this.cameraView(n.ri);
      const isHit = (Math.abs(centreToScreenXPeriodic(imagePos.x, this.ui.canvas.width) - this.mouseX) < n.r)
      && (Math.abs(centreToScreenYPeriodic(imagePos.y, this.ui.canvas.height) - this.mouseY) < n.r)
      if (isHit && n.visible){
        active.push(n)
      }
    });

    active.sort( (a, b) => {
        const imagePos1 = this.cameraView(a.ri);
        const imagePos2 = this.cameraView(b.ri);
        return imagePos1.z - imagePos2.z;
      });

    if(active.length!=0)
    {
      this.ui.showTooltip([this.mouseX,this.mouseY], active[0].id)
    } else {
      this.ui.hideTooltip();
    }
  }



}

const Renderer2 = function () {



  // public member functions



  this.setLattice = function(l){

    // inspect lattice settings
    if (this.ui)
    {
      this.ui.terminal.log("loaded " + this.colouredText(this.sharedData.name, "blue")
       + " lattice data with " + this.colouredText(this.sharedData.sizeX, "blue")
        + " x " + this.colouredText(this.sharedData.sizeY, "blue")
         + " x " + this.colouredText(this.sharedData.sizeY, "blue")
          + " unit cells. Total of " + this.colouredText(this.sharedData.nodes.length, "blue")
           + " nodes.");

        if(this.sharedData.showEdges){
          this.ui.terminal.logWarning(
            `enabling edges may cause a significant
            hit to the frame rate.`
           );
        }
      }
  }

};
