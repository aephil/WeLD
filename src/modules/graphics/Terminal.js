import { Data, colouredText } from '../helpers.js'

export class Terminal extends Data {

    constructor(shared) {
      super(shared);

      this.sharedData.highlighted = false;
      this.commandMap = new Map(
        [
          ["focus", this.focusCommand],
          ["unfocus", this.unfocus],
          ["move", this.moveCommand],
          ["sample", this.setSampleSizeCommand],
          ["probe",this.setProbeRateCommand],
          ["fps", this.setFPSCommand],
          ["clear", this.clearTerminalCommand],
          ["chartheight", this.setChartHeightCommand]
        ]
      );
      this.output = "";
      this.input = "";
      this.element = document.createElement("div");
    }

    // Commands ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    clearTerminalCommand = (args) =>
    {
      this.clearTerminal();
    }

    setFPSCommand = (args) =>
    {
      // TODO formalise commands
      var value = args[0];
      if( !isNaN(value) && (parseFloat(value) | 0) === parseFloat(value))
      {
          value = parseInt(value)
          this.sharedData.fps = value;
          this.sharedData.frames = 0;
          this.sharedData.fstart = performance.now();
          this.log(`framerate is now ${value}`);
      }
      else
      {
          this.logError("input is not an integer");
      }
    }


    setProbeRateCommand = (args) =>
    {
      var size = args[0];
      if( !isNaN(size) && (parseFloat(size) | 0) === parseFloat(size))
      {
          size = parseInt(size)
          this.sharedData.probeRate = size;
          this.log(`lattice probe rate is now ${size}`);
      }
      else
      {
          this.logError("input is not an integer");
      }
    }

    setSampleSizeCommand = (args) =>
    {
      var size = args[0];
      if( !isNaN(size) && (parseFloat(size) | 0) === parseFloat(size))
      {
          size = parseInt(size)
          if(this.sharedData.sampleSize > size){
            this.sharedData.analysisCharts.forEach(
              (chart)=>
              {
                chart.data = chart.data.slice(-size, -1);
              }
            )
          }
          this.sharedData.sampleSize = size;
          this.log(`lattice sample size is now ${size}`);
      }
      else
      {
          this.logError("input is not an integer");
      }
    }

    setChartHeightCommand = (args) =>
    {
      var size = args[0];
      if( !isNaN(size) && (parseFloat(size) | 0) === parseFloat(size))
      {
          size = parseInt(size)
          this.sharedData.analysisChartsLargest = size/100;
          this.log(`chart height is now ${size/100}`);
      }
      else
      {
          this.logError("input is not an integer");
      }
    }

    focusCommand = (args) =>
    {
      if(args.length > 0)
      {
        // check input is int
        const selection = args[0];
        if (!isNaN(selection) && (parseFloat(selection) | 0) === parseFloat(selection))
        {
          if (parseInt(selection)<=(this.sharedData.nodes.length -1))
          {
            const datapoint = this.sharedData.nodes[parseInt(selection)];
            if(datapoint.stroke=="red")
            {
              datapoint.stroke="black";
              this.sharedData.highlighted=false;
            }
            else
            {
              datapoint.stroke = "red";
              if(this.sharedData.highlighted!==false)
              {
                this.sharedData.nodes[this.sharedData.highlighted].stroke = "black";
              }
              this.sharedData.highlighted=parseInt(selection);
              this.log("selected node "+colouredText("#"+selection,"green"))
            }
          }
          else
          {
            this.logError("invalid range");
          }
        }
        else
        {
          this.logError("input is not an integer");
        }
      }
      else if (this.sharedData.highlighted!==false)
      {
        this.log("focused on existing highlighed node.")
      }
      else
      {
        this.logError("no user input or highlighted node.")
        return;
      }
  
      //TODO: neighbours are now stored in forces, check for springs...
      this.sharedData.nodes.forEach((node) => {
        const neighbours = this.sharedData.nodes[this.sharedData.highlighted].neighbours;
        let isNeighbour = false;
        debugger;
        for(let i = 0; i < neighbours.length; i++)
        {
          if(node.id === neighbours[i][0])
          {
            isNeighbour = true
          }
        }
  
        if(node.id != highlighted)
        {
          this.sharedData.nodes[node.id].showEdges = false;
  
          if(!isNeighbour){
            node.visible = false;
          }
        }
  
      });
    }

    // TODO: fix highlighting on/off between ui click and commands
    unfocus = (args) =>
    {
      this.sharedData.nodes.forEach((node) => {
          node.showEdges = true;
          node.visible = true;
          node.edgeStroke = "black";
      });

      this.sharedData.highlighted = false;
      this.log("focus off")
    }

    moveCommand = (args) =>
{
    var [nodeID, x, y, z] = args;
    let relative = false;

    if (args.length >= 5 && args[4] == "r") {
        relative = true;
    }

    if (nodeID && x && y && z)
    {
        nodeID = parseInt(nodeID)
        x = parseFloat(x);
        y = parseFloat(y);
        z = parseFloat(z);

        const node = this.sharedData.nodes[nodeID];

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
    }
    else
    {
        this.logError("Usage: move [ID] [x] [y] [z] [r (optional)], e.g. move 0 -13 45 -279");
    }
}

    ////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////// Commands //

}

Terminal.prototype.clearTerminal = function()
{
  this.output = this.input = "";
}

Terminal.prototype.logDebug = function(msg, newline=true)
{
  this.output += colouredText("WeLD (debug): ","blue") + msg + (newline?"<br/>":"");
  this.element.innerHTML = this.output + "UserIn: " + this.input + "<";
  this.updateScroll()
}

Terminal.prototype.logWarning = function(msg, newline=true)
{
  this.output += colouredText("WeLD (warning): ","orange") + msg + (newline?"<br/>":"");
  this.element.innerHTML = this.output + "UserIn: " + this.input + "<";
  this.updateScroll();
}


Terminal.prototype.logError = function(msg, newline=true)
{
  this.output += colouredText("WeLD (error): ","red") + msg + (newline?"<br/>":"");
  this.element.innerHTML = this.output + "UserIn: " + this.input + "<";
  this.updateScroll();
}


Terminal.prototype.log = function(msg, newline=true)
{
  this.output += colouredText("WeLD: ","green") + msg + (newline?"<br/>":"") ;
  this.element.innerHTML = this.output + "UserIn: " + this.input + "<";
  this.updateScroll();
};


Terminal.prototype.updateScroll = function()
{
  this.element.scrollTop = this.element.scrollHeight;
}

Terminal.prototype.init = function()
{
  this.element.addEventListener("focus", (event) =>{
    this.element.style.color = "black";
    this.element.innerHTML = this.output + "UserIn: " + this.input + "<";
  })

  this.element.addEventListener("focusout", (event) => {
    this.element.style.color = "rgb(173,172,173)";
  });

  this.element.addEventListener("keydown", (event) => {

    const key = event.keyCode;
    const char = String.fromCharCode((96 <= key && key <= 105) ? key-48 : key).toLowerCase();

    // If the user has pressed enter
    
    switch (key) {
      case 32 /*space*/:
      {
        this.input+=(this.input.slice(-1)===" "?"":" ");
        this.element.innerHTML = this.output + "UserIn: " + this.input + "<";;
        break;
      }
      case 13 /*enter*/:
      {
        const args = this.input.split(" ");
        const command = args[0]
        if(!this.commandMap.has(command))
        {
          this.input = "";
          this.logError("no such command.")
          break;
        } else {
          const fn = this.commandMap.get(command);
          fn(args.slice(1));
          this.input = "";
          this.element.innerHTML = this.output + "UserIn: " + this.input + "<";
          break;
        }
      }
      case 8/*backspace*/:
      {
        if(this.input.length>0)
        {
          this.input = this.input.slice(0, -1);
          this.element.innerHTML = this.output + "UserIn: " + this.input + "<";
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
        this.input += char;
        this.element.innerHTML = this.output + "UserIn: " + this.input + "<";
      }

    }
  }, false);
}

