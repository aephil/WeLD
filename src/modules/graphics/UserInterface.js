import Vector from '../physics/Vector.js';

const UserInterface = function()
{
  const focus = function(args){

    if(args.length > 0){
      // check input is int
      const selection = args[0];
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
      const neighbours = data[highlighted].neighbours;
      let isNeighbour = false;

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

  const unfocus = function(){
    data.forEach((node) => {
        node.showEdges = true;
        node.visible = true;
        node.edgeStroke = "black";
    });
    log("focus off")
  }

  const highlightCommand = function(args){
    const selection = args[0];
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
    const [nodeID, x, y, z] = args;
    let relative = false;

    if (args.length >= 5 && args[4] == "r") {
      relative = true;
    }

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

  const commandMap = new Map(
    [
      ["focus", focus],
      ["unfocus", unfocus],
      ["centre", highlightCommand],
      ["move", moveCommand]
    ]
  )

  let data=[]; //data associated with the simulation
  let nodes=[];
  let highlighted=false;

  let output = "";
  let input = "";

  this.canvas = false;
  this.chart = false;
  this.chartDesc = false;

  this.infoBox;
  this.textInfo;
  this.graphicInfo;
  let control = false;

  const updateScroll = function(){
    terminal.scrollTop = terminal.scrollHeight;
  }
  const colouredText = function(msg, colour) {
    return "<text class='"+colour+"'>"+msg+"</text>";
  }
  const initTerminal = function(terminal){

    terminal = document.getElementById("terminal");

      terminal.focus();
      terminal.addEventListener("keydown", function( event ) {

        const key = event.keyCode;
        const char = String.fromCharCode((96 <= key && key <= 105) ? key-48 : key).toLowerCase();

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
            const args = input.split(" ");
            const command = args[0]
            if(!commandMap.has(command))
            {
              input = "";
              logError("no such command.")
              break;
            } else {
              const fn = commandMap.get(command);
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

  const clearTerminal = function(){
    output = input = "";
  }
  this.clearTerminal = function(){clearTerminal()};

  this.colouredText = function(msg, colour){
    return colouredText(msg, colour);
  }
  const logDebug = function(msg, newline=true){
      output += colouredText("WeLD (debug): ","blue") + msg + (newline?"<br/>":"");
      document.getElementById("terminal").innerHTML = output + "UserIn: " + input + "<";
      updateScroll()
  }
  this.logDebug = function(msg, newline=true){logDebug(msg, newline)};

  const logWarning = function(msg, newline=true){
      output += colouredText("WeLD (warning): ","orange") + msg + (newline?"<br/>":"");
      document.getElementById("terminal").innerHTML = output + "UserIn: " + input + "<";
      updateScroll()
    }
  this.logWarning = function(msg,newline=true){logWarning(msg,newline)}

  const logError = function(msg, newline=true){
      output += colouredText("WeLD (error): ","red") + msg + (newline?"<br/>":"");
      document.getElementById("terminal").innerHTML = output + "UserIn: " + input + "<";
      updateScroll()
    }
  this.logError = function(msg,newline=true){logError(msg,newline)}

  const log = function (msg, newline=true) {
      output += colouredText("WeLD: ","green") + msg + (newline?"<br/>":"") ;
      document.getElementById("terminal").innerHTML = output + "UserIn: " + input + "<";
      updateScroll()
    };
  this.log = function(msg,newline=true){log(msg,newline)}

  this.setData = function(d){data=d}
  this.setNodes = function(n){nodes=n}
  const highlight = function(i){
    const datapoint = data[parseInt(i)];
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
    const datapoint = data[parseInt(i)];
    tooltip.innerHTML = datapoint.name + ", id: #"+i+"</br>";
    tooltip.innerHTML += "x: "+parseFloat(datapoint.ri.x).toFixed(2)+", y: "+parseFloat(datapoint.ri.y).toFixed(2)+", z: "+parseFloat(datapoint.ri.z).toFixed(2) + "</br>";
    tooltip.innerHTML += "v: "+parseFloat(datapoint.vi.x).toFixed(2)+", y: "+parseFloat(datapoint.vi.y).toFixed(2)+", z: "+parseFloat(datapoint.vi.z).toFixed(2) + "</br>";
    tooltip.innerHTML += "mass: "+parseFloat(datapoint.m).toFixed(2)+", radius: " + parseFloat(datapoint.r).toFixed(2)+"</br>";

    const forces = datapoint.forces;
    if(Array.isArray(forces) && forces.length)
    {
      tooltip.innerHTML += "force(s):"
      for(let i = 0; i<forces.length; i++)
      {
        let force = forces[i];
        if (i==2)
        {
            tooltip.innerHTML += "</br>&emsp;" + (forces.length - i) + " more...</br>";
            break;
        }

        if(force.name=="spring")
        {
          tooltip.innerHTML += "</br>&emsp;" +force.name + "</br>"
          tooltip.innerHTML += "&emsp;&emsp;Neighbour: "+force.params[2] +" ("+data[force.params[2]].name+")"+"</br>"
          tooltip.innerHTML += "&emsp;&emsp;equil. distance: "+(force.params[1]).toFixed(2) + "</br>"
          tooltip.innerHTML += "&emsp;&emsp;Extension: "+ Math.abs(Vector.norm(Vector.sub(datapoint.ri, data[force.params[2]].ri)) - force.params[1]).toFixed(2)+"</br>"
          tooltip.innerHTML += "&emsp;&emsp;K: "+force.params[0] + "</br>"
        }

        if(force.name=="valenceAngle")
        {

          const ba = Vector.sub(datapoint.ri,data[force.params[2]].ri);
          const bc = Vector.sub(datapoint.ri,data[force.params[3]].ri);
          const abc = Vector.angle(ba, bc);

          tooltip.innerHTML += "</br>&emsp;" + "valence angle" + "</br>"
          tooltip.innerHTML += "&emsp;&emsp;Neighbours:</br>&emsp;&emsp;&emsp;"+force.params[2]+" ("+data[force.params[2]].name+")"+", "+force.params[3]+" ("+data[force.params[3]].name+")"+"</br>";
          tooltip.innerHTML += "&emsp;&emsp;equil. angle: "+(force.params[1]).toFixed(2) + "</br>"
          tooltip.innerHTML += "&emsp;&emsp;angle: "+ abc.toFixed(2) + "</br>"
          tooltip.innerHTML += "&emsp;&emsp;K: "+force.params[0] + "</br>"
        }

      }
    }
    tooltip.innerHTML += ""
    tooltip.style.display = "block";
    tooltip.style.left = (pos[0]) + 50 + 'px';
    tooltip.style.top =  (pos[1]) + 50 + 'px';

  }
  this.hideTooltip = function() {
    const tooltip = document.getElementById("tooltip");
    tooltip.style.display = "none";
  }
  this.loadBasic = function(){

    const sim = document.createElement("div");
    document.body.appendChild(sim);
    sim.setAttribute("id","sim");
    sim.style.position = "fixed";
    sim.style.top = "2.5%";
    sim.style.left = "2.5%";
    sim.style.width = "60%";
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

    control = document.createElement("div");
    document.body.appendChild(control);
    control.setAttribute("id","control");
    control.style.position = "absolute";
    control.style.top = "2.5%";
    control.style.right = "2.5%";
    control.style.width = "33.5%";
    control.style.height = "95%";
    control.style.color = "rgb(173,172,173)";
    control.style.padding = "2.5px";
    control.style.fontFamily = "monospace";
    control.style.overflowX = "hidden";
    control.style.overflowY = "hidden";

    const terminal = document.createElement("div");
    control.appendChild(terminal);
    terminal.setAttribute("tabindex","0");
    terminal.setAttribute("id","terminal");
    terminal.innerHTML = output + "User: " + input + "<";
    terminal.style.position = "static";
    terminal.style.right = "0%";
    terminal.style.width = "100%";
    terminal.style.height = "33.333%";
    terminal.style.color = "rgb(173,172,173)";
    terminal.style.padding = "2.5px";
    terminal.style.fontFamily = "monospace";
    terminal.style.overflowX = "hidden";
    terminal.style.overflowY = "scroll";
    terminal.style.backgroundColor = "white";
    terminal.addEventListener("focus",function(event){
        terminal.style.color = "black";
        terminal.innerHTML = output + "UserIn: " + input + "<";
    })
    terminal.addEventListener("focusout",function(event){
        terminal.style.color = "rgb(173,172,173)";
    });
    initTerminal(terminal);
    sim.focus();
    

    
    this.infoBox = document.createElement("div");
    control.appendChild(this.infoBox);
    this.infoBox.setAttribute("id", "infoBox");
    this.infoBox.style.position = "static";
    this.infoBox.style.padding = "2.5px";
    this.infoBox.style.backgroundColor = "rgba(0,0,0,0.7)";
    this.infoBox.style.width = "100%";
    this.infoBox.style.height = "33.333%";
    this.infoBox.style.color = "rgb(173,172,173)";
    this.infoBox.style.zIndex = document.getElementById("control").style.zIndex + 1;
    this.infoBox.style.overflowX = "hidden";
    this.infoBox.style.overflowY = "scroll";
    
    this.textInfo = document.createElement("div");
    this.infoBox.appendChild(this.textInfo);
    this.textInfo.setAttribute("id", "textInfo");
    this.textInfo.style.position = "static";
    this.textInfo.style.width = "100%";
    this.textInfo.style.height = "50%";
    this.textInfo.style.overflowX = "hidden";
    this.textInfo.style.overflowY = "auto";

    this.graphicInfo = document.createElement("div");
    this.infoBox.appendChild(this.graphicInfo);
    this.graphicInfo.setAttribute("id", "graphicInfo");
    this.graphicInfo.style.position = "static";
    this.graphicInfo.style.top = 0;
    this.graphicInfo.style.width = "100%";
    this.graphicInfo.style.height = "50%";
    this.graphicInfo.style.overflowX = "hidden";
    this.graphicInfo.style.overflowY = "hidden";

    this.chart = document.createElement("canvas");
    this.graphicInfo.appendChild(this.chart);
    this.chart.style.position = "static";
    this.chart.style.bottom = 0;
    this.chart.width = this.graphicInfo.clientWidth / 2;
    this.chart.height = this.graphicInfo.clientHeight;
    this.chart.id = "chart";
    this.chart.style.cursor= "crosshair";
    this.drawChart([], 0);
    this.drawChart([], 1);
    
    this.chartDesc = document.createElement("div");
    this.graphicInfo.appendChild(this.chartDesc);
    this.chartDesc.setAttribute("id", "chartDesc");
    this.chartDesc.style.position = "static";
    this.chartDesc.style.top = "0%";
    this.chartDesc.style.display = "inline-block";
    this.chartDesc.style.verticalAlign = "top";
    this.chartDesc.style.textAlign = "right";
    this.chartDesc.style.right = "0%";
    this.chartDesc.style.width = "49%";
    this.chartDesc.style.height = "100%"

    this.chartDesc.innerHTML =
    `
    <p>
    <text class="red">Kinetic Energy</text><br>
    <text class="blue">Potential Energy</text><br>
    <text class="green">Total Energy</text><br>
    </p>
    `
    
  }

  this.slider = function(min=0, max=100, step=1){

    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.width = "40%";
    container.style.height = "10%";
    container.style.top = "0%";
    container.style.right = "1%";
    container.style.padding = "5px";

    const slider = document.createElement("input");
    container.appendChild(slider);
    slider.setAttribute("type","range");
    slider.setAttribute("min",min);
    slider.setAttribute("max",max);
    slider.setAttribute("step",step);
    slider.setAttribute("value",min);
    //slider.style.backgroundColor = "blue";

    const label = document.createElement("p");
    container.appendChild(label);

      return [container, slider, label];
  }

   this.drawChart = function(dataArr, col='black', pos=0, onto=false, div=1)
  {
    var canvas = document.getElementById( "chart" );  
    var context = canvas.getContext( "2d" );
    
    var GRAPH_HEIGHT = (this.chart.clientHeight / div) - 5;
    var GRAPH_TOP = 5 + (pos * GRAPH_HEIGHT);  
    var GRAPH_BOTTOM = 375;  
    var GRAPH_LEFT = 5;  
    var GRAPH_RIGHT = 475;  
  
    var GRAPH_WIDTH = this.chart.clientWidth;  
    var arrayLen = dataArr.length;  
  
    var largest = 0;  
    for( var i = 0; i < arrayLen; i++ ){  
        if( dataArr[ i ] > largest ){  
            largest = dataArr[ i ];  
        }  
    }  
  
    if (!onto) {
      context.clearRect( 0, 0, 500, 400 );  
    }
    // set font for fillText()  
    context.font = "16px Arial";  
       
    // draw X and Y axis  
    context.beginPath();  
    context.moveTo( GRAPH_LEFT, GRAPH_BOTTOM );  
    context.lineTo( GRAPH_RIGHT, GRAPH_BOTTOM );  
    context.lineTo( GRAPH_RIGHT, GRAPH_TOP );  
    context.stroke();
       
    // draw reference line  
    context.beginPath();  
    context.strokeStyle = "#BBB";  
    context.moveTo( GRAPH_LEFT, GRAPH_TOP );  
    context.lineTo( GRAPH_RIGHT, GRAPH_TOP );  
    // draw reference value for hours  
    context.fillText( largest, GRAPH_RIGHT + 15, GRAPH_TOP);  
    context.stroke();  
   
    // draw reference line  
    context.beginPath();  
    context.moveTo( GRAPH_LEFT, ( GRAPH_HEIGHT ) / 4 * 3 + GRAPH_TOP );  
    context.lineTo( GRAPH_RIGHT, ( GRAPH_HEIGHT ) / 4 * 3 + GRAPH_TOP );  
    // draw reference value for hours  
    context.fillText( largest / 4, GRAPH_RIGHT + 15, ( GRAPH_HEIGHT ) / 4 * 3 + GRAPH_TOP);  
    context.stroke();  
   
    // draw reference line  
    context.beginPath();  
    context.moveTo( GRAPH_LEFT, ( GRAPH_HEIGHT ) / 2 + GRAPH_TOP );  
    context.lineTo( GRAPH_RIGHT, ( GRAPH_HEIGHT ) / 2 + GRAPH_TOP );  
    // draw reference value for hours  
    context.fillText( largest / 2, GRAPH_RIGHT + 15, ( GRAPH_HEIGHT ) / 2 + GRAPH_TOP);  
    context.stroke();  
   
    // draw reference line  
    context.beginPath();  
    context.moveTo( GRAPH_LEFT, ( GRAPH_HEIGHT ) / 4 + GRAPH_TOP );  
    context.lineTo( GRAPH_RIGHT, ( GRAPH_HEIGHT ) / 4 + GRAPH_TOP );  
    // draw reference value for hours  
    context.fillText( largest / 4 * 3, GRAPH_RIGHT + 15, ( GRAPH_HEIGHT ) / 4 + GRAPH_TOP);  
    context.stroke();  
  
    // draw titles  
    context.fillText( "Day of the week", GRAPH_RIGHT / 3, GRAPH_BOTTOM + 50);  
    context.fillText( "Hours", GRAPH_RIGHT + 30, GRAPH_HEIGHT / 2);  
  
    context.beginPath();  
    context.lineJoin = "round";  
    context.strokeStyle = col;  
  
    context.moveTo( GRAPH_LEFT, ( GRAPH_HEIGHT - dataArr[ 0 ] / largest * GRAPH_HEIGHT ) + GRAPH_TOP );  
    // draw reference value for day of the week  
    context.fillText( "1", 15, GRAPH_BOTTOM + 25);  
    for( var i = 1; i < arrayLen; i++ ){  
        context.lineTo( GRAPH_RIGHT / arrayLen * i + GRAPH_LEFT, ( GRAPH_HEIGHT - dataArr[ i ] / largest * GRAPH_HEIGHT ) + GRAPH_TOP );  
        // draw reference value for day of the week  
        context.fillText( ( i + 1 ), GRAPH_RIGHT / arrayLen * i, GRAPH_BOTTOM + 25);  
    }  
    context.stroke();  
  }

  return this;
}

export const userInterface = new UserInterface();
export default userInterface;
