
var Renderer = function () {

    // camera
    var rho = 0;
    var theta = 0;
    var terminalObj = false;
    var showInfo = true;

    var fps = 30; //private var
    var frames = 0;
    var freq = 1; //milliseconds
    var elapsed = 0;

    var updates;
    var redraw;
    var lattice;
    var sim;

    this.setRho = function(angle){rho=angle;}
    this.setTheta = function(angle){theta=angle;}
    this.setTerminal = function(termObj)
    {
      // typescript to check type maybe?
      terminalObj = termObj;
    }

    var cameraView = function(d){
      return rotY(rotX(d,theta),rho)
    }

    this.setSpeed = function(n, terminalObj=null){
      freq = n;
      if(terminalObj!==null)
      {
        terminalObj.log("frequency set to "+n +"/ms")
      }
    };

    this.setFPS = function(n){
      fps = n;
      if(terminalObj){
        terminalObj.log("fps set to "+terminalObj.colouredText(n,"blue"))}};

    this.fps = function(){return fps;}

    this.addAnimation = function(u,r,l,s){

      lattice = l;

      if(l.data().length !== l.nodes().length){
        terminalObj.logError("data and nodes must be same length.");
        return;
      }
      updates = u
      drawCall = r
      sim = s
    }

    var update = function()
    {
      lattice.data().forEach((d) => {
        updates.forEach((fn) => {
          fn(d,lattice.data());
        });
      });
    }

    var initInfo = function(){
        var infoBox = document.createElement("div");
        infoBox.setAttribute("id", "infoBox");
        infoBox.style.position = "fixed";
        infoBox.style.padding = "2.5px";
        infoBox.style.backgroundColor = "rgba(0,0,0,0.5)";
        infoBox.style.width = "15%";
        infoBox.style.color = "rgb(173,172,173)";
        infoBox.style.height = "7%";
        infoBox.style.top = lattice.nodes()[0].parentNode.style.top;
        infoBox.style.left = lattice.nodes()[0].parentNode.style.left;
        infoBox.style.zIndex = lattice.nodes()[0].parentNode.style.zIndex + 1;
        document.body.appendChild(infoBox);
    }

  var drawInfo = function(){
    var infoBox = document.getElementById("infoBox");
    infoBox.innerHTML = "Rho: " + parseFloat(rho).toFixed(2) +"</br> "
    infoBox.innerHTML += "Theta: " + parseFloat(theta).toFixed(2) + "</br>";
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

    var defaultDrawCall = function(node,datapoint)
    {
       var data = lattice.data();
       var imagePos = cameraView(datapoint);

       if(lattice.showEdges())
       {
         datapoint.valencePairs.forEach((vp) => {
           var nodeLine1 = vp[3];
           var nodeLine2 = vp[4];

           var imagePos1 = cameraView(data[vp[0]])
           var imagePos2 = cameraView(data[vp[1]])

           nodeLine1.setAttribute("stroke", datapoint.col);
           nodeLine2.setAttribute("stroke", datapoint.col);
           nodeLine1.setAttribute("stroke-width", 2);
           nodeLine2.setAttribute("stroke-width", 2);

           nodeLine1.setAttribute("x1",centreToScreenX(imagePos.x))
           nodeLine1.setAttribute("y1",centreToScreenY(imagePos.y))
           nodeLine1.setAttribute("x2",centreToScreenX(imagePos1.x))
           nodeLine1.setAttribute("y2",centreToScreenY(imagePos1.y))

           nodeLine2.setAttribute("x1",centreToScreenX(imagePos.x))
           nodeLine2.setAttribute("y1",centreToScreenY(imagePos.y))
           nodeLine2.setAttribute("x2",centreToScreenX(imagePos2.x))
           nodeLine2.setAttribute("y2",centreToScreenY(imagePos2.y))
         });
       }

          node.setAttribute("cx", centreToScreenX(imagePos.x) );
          node.setAttribute("cy", centreToScreenY(imagePos.y) );
          node.setAttribute("cz", centreToScreenY(imagePos.z) );
          node.setAttribute("fill", datapoint.col );
          node.setAttribute("stroke", datapoint.stroke );
          node.setAttribute("r", datapoint.r);
     }

      var redraw = function()
      {
        lattice.nodes().forEach((node) => {
          if(drawCall){
            drawCall(node, lattice.data()[parseInt(node.getAttribute("idx"))]);
          } else {
            defaultDrawCall(node, lattice.data()[parseInt(node.getAttribute("idx"))]);
          }
        });

      // need to reorder the nodes in the HTML by z value (z-index not supported by svg)

      lattice.nodes().sort(function(a, b) {
        return parseFloat(b.getAttribute("cz")).toFixed(3) - parseFloat(a.getAttribute("cz")).toFixed(3);
      });

      for (let item of lattice.nodes()) {
        sim.appendChild(item);
      }
    }

    this.render = function() // public fn
    {
      var start = performance.now();
      if (showInfo) initInfo();
      var timer = window.setInterval(function(){
      var end = performance.now();
      update();
      elapsed = (end - start)/1000;
      if(elapsed > frames * (1/fps)){ redraw(); if (showInfo) drawInfo(); frames += 1;}
    }, freq);
      return timer;
    }
  return this;
};

Graphics.Renderer = new Renderer();
