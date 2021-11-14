
var UserInterface = function()
{
  var focus = function(args){

    if(args.length > 0){
      // check input is int
      var selection = args[0];
      if( !isNaN(selection) && (parseFloat(selection) | 0) === parseFloat(selection))
      {
        if(parseInt(selection)<=(data.length -1))
        {
          //highlighted = selection;
          highlight(selection);
          log("focused node #"+selection);
        } else {
          logError("invalid range");
        }
      } else {
              logError("input is not an integer");
            }
  } else if(highlighted!==false) {

    log("focused highlighed node.")

  } else {
    logError("no user input or highlighted node.")
    return;
  }
    data[highlighted].edgeStroke = "red";
    data.forEach((node) => {
      var neighbours = data[highlighted].neighbours;
      var isNeighbour = false;

      for(let i = 0; i < neighbours.length; i++)
      {
        if(node.id === neighbours[i][0])
        {
          isNeighbour = true
        }
      }

      if(node.id != highlighted)
      {
        data[node.id].showEdges = false;

        if(!isNeighbour){
          node.visible = false;
        }
      }

    });


  }

  var unfocus = function(){
    data.forEach((node) => {
        node.showEdges = true;
        node.visible = true;
        node.edgeStroke = "black";
    });
    log("focus off")
  }

  var highlightCommand = function(args){
    var selection = args[0];
    if( !isNaN(selection) && (parseFloat(selection) | 0) === parseFloat(selection))
    {
      if(parseInt(selection)<=(data.length -1))
      {
        //highlighted = selection;
        highlight(selection);
        log("centred node #"+selection);
      } else {
        logError("invalid range");
      }
    } else {
            logError("input is not an integer");
          }
  }

  // move a node to the specified location
  // for debugging purposes
  const moveCommand = function(args) {
    let [nodeID, x, y, z] = args;
    let relative = false;

    if (args.length >= 5 && args[4] == "r") {
      relative = true;
    }

    console.log(args);
    if (nodeID && x && y && z) {
      nodeID = parseInt(nodeID)
      x = parseFloat(x);
      y = parseFloat(y);
      z = parseFloat(z);

      const node = data[nodeID];

      if (relative) {
        node.ri.x += x;
        node.ri.y += y;
        node.ri.z += z;
      }
      else {
        node.ri.x = x;
        node.ri.y = y;
        node.ri.z = z;
      }

    } else {
      logError("Usage: move [ID] [x] [y] [z] [r (optional)], e.g. move 0 -13 45 -279");
    }

    }

  var commandMap = new Map(
    [
      ["focus", focus],
      ["unfocus", unfocus],
      ["centre", highlightCommand],
      ["move", moveCommand]
    ]
  )

  var data=[]; //data associated with the simulation
  var nodes=[];
  var highlighted=false;

  var output = "";
  var input = "";

  this.canvas = false;
  this.infoBox;
  var control = false;

  var updateScroll = function(){
    terminal.scrollTop = terminal.scrollHeight;
  }
  var colouredText = function(msg, colour) {
    return "<text class='"+colour+"'>"+msg+"</text>";
  }
  var initTerminal = function(terminal){

    terminal = document.getElementById("terminal");

      terminal.focus();
      terminal.addEventListener("keydown", function( event ) {

        var key = event.keyCode;
        var char = String.fromCharCode((96 <= key && key <= 105) ? key-48 : key).toLowerCase();

        // If the user has pressed enter

        switch (key) {
          case 32 /*space*/:
          {
            input+=(input.slice(-1)===" "?"":" ");
            terminal.innerHTML = output + "UserIn: " + input + "<";;
            break;
          }
          case 13 /*enter*/:
          {
            var args = input.split(" ");
            var command = args[0]
            if(!commandMap.has(command))
            {
              input = "";
              logError("no such command.")
              break;
            } else {
              var fn = commandMap.get(command);
              fn(args.slice(1));
              input = "";
              terminal.innerHTML = output + "UserIn: " +input + "<";
              break;
            }
          }
          case 8/*backspace*/:
          {
            if(input.length>0)
            {
              input = input.slice(0, -1);
              terminal.innerHTML = output + "UserIn: " +input + "<";
            }
            break;
          }
          case 37/*left*/:
          {

            break;
          }
          case 39/*right*/:
          {

            break;
          }
            case 38/*up*/:
          {

            break;
          }
            case 40/*down*/:

              break;
          default:
          {
            input += char;
            terminal.innerHTML = output + "UserIn: " + input + "<";
          }

        }
      }, false);
    }
  this.colouredText = function(msg, colour){
    return colouredText(msg, colour);
  }
  var logWarning = function(msg, newline=true){
      output += colouredText("WeLD (warning): ","orange") + msg + (newline?"<br/>":"");
      document.getElementById("terminal").innerHTML = output + "UserIn: " + input + "<";
      updateScroll()
    }
  this.logWarning = function(msg,newline=true){logWarning(msg,newline)}

  var logError = function(msg, newline=true){
      output += colouredText("WeLD (error): ","red") + msg + (newline?"<br/>":"");
      document.getElementById("terminal").innerHTML = output + "UserIn: " + input + "<";
      updateScroll()
    }
  this.logError = function(msg,newline=true){logError(msg,newline)}

  var log = function (msg, newline=true) {
      output += colouredText("WeLD: ","green") + msg + (newline?"<br/>":"") ;
      document.getElementById("terminal").innerHTML = output + "UserIn: " + input + "<";
      updateScroll()
    };
  this.log = function(msg,newline=true){log(msg,newline)}

  this.setData = function(d){data=d}
  this.setNodes = function(n){nodes=n}
  var highlight = function(i){
    var datapoint = data[parseInt(i)];
    if(datapoint.stroke=="red")
    {
      datapoint.stroke="black";
      highlighted=false;
    } else {
        datapoint.stroke = "red";
        if(highlighted!==false){
          data[highlighted].stroke = "black";
        }
        highlighted=parseInt(i);
        log("selected node "+colouredText("#"+i,"green"))
      }
  }
  this.highlight = function(i){
    highlight(i);
  }
  this.highlighted = function(){
    return highlighted;
  }
  this.showTooltip = function(pos, i) {
    
    let tooltip = document.getElementById("tooltip");
    var datapoint = data[parseInt(i)];
    tooltip.innerHTML = datapoint.name + ", id: #"+i+"</br>";
    tooltip.innerHTML += "x: "+parseFloat(datapoint.ri.x).toFixed(2)+", y: "+parseFloat(datapoint.ri.y).toFixed(2)+", z: "+parseFloat(datapoint.ri.z).toFixed(2) + "</br>";
    tooltip.innerHTML += "mass: "+parseFloat(datapoint.m).toFixed(2)+", radius: " + parseFloat(datapoint.r).toFixed(2)+"</br>";

    var forces = datapoint.forces;
    if(Array.isArray(forces) && forces.length)
    {
      tooltip.innerHTML += "force(s): "
      for(let i = 0; i<forces.length; i++)
      {
        force = forces[i];
        if (i==4)
        {
            tooltip.innerHTML += "</br>&emsp;" + (forces.length - i) + " more...</br>";
            break;
        }

        if(force.name=="spring")
        {
          tooltip.innerHTML += "</br>&emsp;" +force.name + "</br>"
          tooltip.innerHTML += "&emsp;&emsp;Neighbour: "+force.params[2] + "</br>"
          tooltip.innerHTML += "&emsp;&emsp;equil. distance: "+(force.params[1]).toFixed(2) + "</br>"
          tooltip.innerHTML += "&emsp;&emsp;Extension: "+ Math.abs(Physics.Vector.norm(Physics.Vector.sub(datapoint.ri, data[force.params[2]].ri)) - force.params[1]).toFixed(2) + "</br>"
          tooltip.innerHTML += "&emsp;&emsp;K: "+force.params[0] + "</br>"
        }

        if(force.name=="valenceAngle")
        {

          var ba = Physics.Vector.sub(datapoint.ri,data[force.params[2]].ri);
          var bc = Physics.Vector.sub(datapoint.ri,data[force.params[3]].ri);
          var abc = Physics.Vector.angle(ba, bc);

          tooltip.innerHTML += "</br>&emsp;" + "valence angle" + "</br>"
          tooltip.innerHTML += "&emsp;&emsp;Neighbours: "+ force.params[2] +", "+ force.params[3]+ "</br>";
          tooltip.innerHTML += "&emsp;&emsp;equil. angle: "+(force.params[1]).toFixed(2) + "</br>"
          tooltip.innerHTML += "&emsp;&emsp;angle: "+ abc.toFixed(2) + "</br>"
          tooltip.innerHTML += "&emsp;&emsp;K: "+force.params[0] + "</br>"
        }

      }
    }
    tooltip.innerHTML += ""
    tooltip.style.display = "block";
    tooltip.style.left = (pos[0]) + 40 + 'px';
    tooltip.style.top =  (pos[1]) + 40 + 'px';

  }
  this.hideTooltip = function() {
    var tooltip = document.getElementById("tooltip");
    tooltip.style.display = "none";
  }
  this.loadBasic = function(){

    sim = document.createElement("div");
    document.body.appendChild(sim);
    sim.setAttribute("id","sim");
    sim.style.position = "fixed";
    sim.style.top = "2.5%";
    sim.style.left = "2.5%";
    sim.style.width = "70%";
    sim.style.height = "95%";
    sim.style.backgroundColor = "none";

    this.canvas = document.createElement("canvas");
    this.canvas.width = sim.clientWidth
    this.canvas.height = sim.clientHeight
    this.canvas.id = "canvas";
    this.canvas.style.cursor="crosshair";
    this.canvas.style.borderColor = "black";
    this.canvas.style.borderStyle = "solid";
    sim.appendChild(this.canvas);

    terminal = document.createElement("div");
    document.body.appendChild(terminal);
    terminal.setAttribute("tabindex","0");
    terminal.setAttribute("id","terminal");
    terminal.innerHTML = output + "User: " + input + "<";
    terminal.style.position = "fixed";
    terminal.style.top = "2.5%";
    terminal.style.right = "1.5%";
    terminal.style.width = "25%";
    terminal.style.height = "25%";
    terminal.style.color = "rgb(173,172,173)";
    terminal.style.padding = "2.5px";
    terminal.style.fontFamily = "monospace";
    terminal.style.overflowX = "scroll";
    terminal.style.overflowY = "scroll";
    terminal.addEventListener("focus",function(event){
        terminal.style.color = "black";
        terminal.innerHTML = output + "UserIn: " + input + "<";
    })
    terminal.addEventListener("focusout",function(event){
        terminal.style.backgroundColor = "white";
        terminal.style.color = "rgb(173,172,173)";
    });
    initTerminal(terminal);

    control = document.createElement("div");
    document.body.appendChild(control);
    control.setAttribute("id","control");
    control.style.position = "fixed";
    control.style.top = "28.0%";
    control.style.right = "1.5%";
    control.style.width = "25%";
    control.style.height = "68.5%";
    control.style.color = "rgb(173,172,173)";
    control.style.padding = "2.5px";
    control.style.fontFamily = "monospace";
    control.style.overflowX = "scroll";
    control.style.overflowY = "scroll";

    this.infoBox = document.createElement("div");
    this.infoBox.setAttribute("id", "infoBox");
    this.infoBox.style.position = "fixed";
    this.infoBox.style.padding = "2.5px";
    this.infoBox.style.backgroundColor = "rgba(0,0,0,0.7)";
    this.infoBox.style.width = "15%";
    this.infoBox.style.height = "auto";
    this.infoBox.style.color = "rgb(173,172,173)";
    this.infoBox.style.top = document.getElementById("sim").style.top;
    this.infoBox.style.left = document.getElementById("sim").style.left;
    this.infoBox.style.zIndex = document.getElementById("sim").style.zIndex + 1;
    this.infoBox.style.overflowX = "scroll";
    this.infoBox.style.overflowY = "scroll";
    document.body.appendChild(this.infoBox);

    sim.focus();

  }
  this.slider = function(min=0, max=100, step=1){

    // TODO remove d3 here too
    var container = document.createElement("div");
    container.style.position = "relative";
    container.style.width = "40%";
    container.style.height = "10%";
    container.style.top = "0%";
    container.style.right = "1%";
    container.style.padding = "5px";

    var slider = document.createElement("input");
    container.appendChild(slider);
    slider.setAttribute("type","range");
    slider.setAttribute("min",min);
    slider.setAttribute("max",max);
    slider.setAttribute("step",step);
    slider.setAttribute("value",min);
    //slider.style.backgroundColor = "blue";

    var label = document.createElement("p");
    container.appendChild(label);

      return [container, slider, label];
  }

  return this;
}

Graphics.UserInterface = new UserInterface();
