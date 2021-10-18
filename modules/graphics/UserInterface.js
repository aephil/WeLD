
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

  var commandMap = new Map(
    [
      ["focus", focus],
      ["unfocus", unfocus],
    ]
  )

  var data=[]; //data associated with the simulation
  var nodes=[];
  var highlighted=false;

  var output = "";
  var input = "";

  this.canvas = false;
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
          console.log(input);

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
  this.showTooltip = function(pos, i) {
    let tooltip = document.getElementById("tooltip");
    var datapoint = data[parseInt(i)];
    tooltip.innerHTML = datapoint.name + ", id: #"+i+"</br>";
    tooltip.innerHTML += "x: "+parseFloat(datapoint.x).toFixed(2)+", y: "+parseFloat(datapoint.y).toFixed(2)+", z: "+parseFloat(datapoint.z).toFixed(2) + "</br>";
    tooltip.innerHTML += "mass: "+parseFloat(datapoint.m).toFixed(2)+", radius: " + parseFloat(datapoint.r).toFixed(2)+"</br>";

    var neighbours = datapoint.neighbours;
    if(Array.isArray(neighbours) && neighbours.length)
    {
      tooltip.innerHTML += "neighbour(s): "
      neighbours.forEach((neighbour) => {
          tooltip.innerHTML += "#"+ neighbour[0] + " ";
      });
    }
    tooltip.innerHTML += ""
    tooltip.style.display = "block";
    tooltip.style.left = centreToScreenX(pos[0]) + 10 + 'px';
    tooltip.style.top =  centreToScreenY(pos[1]) + 10 + 'px';
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
