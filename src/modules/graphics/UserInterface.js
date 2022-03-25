import Vector from '../physics/Vector.js';
import { Data } from '../helpers.js';
import { Terminal } from './Terminal.js';
import { Toolbar } from './Toolbar.js';

export class UserInterface extends Data
{

  constructor(shared){
    super(shared);

    this.canvas = false;
    this.chart = false;
    this.chartDesc = false;
    this.infoBox;
    this.textInfo;
    this.graphicInfo;
    this.control = false;
    this.terminal = new Terminal(shared);
    this.canvasToolbar = new Toolbar(shared);
    this.chartToolbar = new Toolbar(shared);
  }

  showTooltip(pos, i)
  {

    const tooltip = document.getElementById("tooltip");
    const datapoint = this.sharedData.nodes[parseInt(i)];
    const nodes = this.sharedData.nodes;
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
          tooltip.innerHTML += "&emsp;&emsp;Neighbour: "+force.params[2] +" ("+nodes[force.params[2]].name+")"+"</br>"
          tooltip.innerHTML += "&emsp;&emsp;equil. distance: "+(force.params[1]).toFixed(2) + "</br>"
          tooltip.innerHTML += "&emsp;&emsp;Extension: "+ Math.abs(Vector.norm(Vector.sub(datapoint.ri, nodes[force.params[2]].ri)) - force.params[1]).toFixed(2)+"</br>"
          tooltip.innerHTML += "&emsp;&emsp;K: "+force.params[0] + "</br>"
        }
        else
        if(force.name=="valenceAngle")
        {

          const ba = Vector.sub(datapoint.ri,nodes[force.params[2]].ri);
          const bc = Vector.sub(datapoint.ri,nodes[force.params[3]].ri);
          const abc = Vector.angle(ba, bc);

          tooltip.innerHTML += "</br>&emsp;" + "valence angle" + "</br>"
          tooltip.innerHTML += "&emsp;&emsp;Neighbours:</br>&emsp;&emsp;&emsp;"+force.params[2]+" ("+nodes[force.params[2]].name+")"+", "+force.params[3]+" ("+nodes[force.params[3]].name+")"+"</br>";
          tooltip.innerHTML += "&emsp;&emsp;equil. angle: "+(force.params[1]).toFixed(2) + "</br>"
          tooltip.innerHTML += "&emsp;&emsp;angle: "+ abc.toFixed(2) + "</br>"
          tooltip.innerHTML += "&emsp;&emsp;K: "+force.params[0] + "</br>"
        }
        else
        if(force.name=="lennardJones")
        {
          tooltip.innerHTML += "</br>&emsp;" + "lennard jones" + "</br>"
          tooltip.innerHTML += "&emsp;&emsp;Neighbours:</br>&emsp;&emsp;&emsp;"+force.params[2]
          +" ("+nodes[force.params[2]].name+")"+"</br>";
          tooltip.innerHTML += "&emsp;&emsp;&emsp;&emsp;epsilon: "+(force.params[0]).toFixed(2) + "</br>"
          tooltip.innerHTML += "&emsp;&emsp;&emsp;&emsp;sigma: "+(force.params[1]).toFixed(2) + "</br>"
        }

      }
    }
    tooltip.innerHTML += ""
    tooltip.style.display = "block";
    tooltip.style.left = (pos[0]) + 50 + 'px';
    tooltip.style.top =  (pos[1]) + 50 + 'px';

  }

  hideTooltip()
  {
    const tooltip = document.getElementById("tooltip");
    tooltip.style.display = "none";
  }

  loadBasic(){

    const sim = document.createElement("div");
    document.body.appendChild(sim);
    sim.setAttribute("id","sim");
    sim.style.position = "fixed";
    sim.style.top = "2.5%";
    sim.style.left = "2.5%";
    sim.style.width = "69%";
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

    this.control = document.createElement("div");
    document.body.appendChild(this.control);
    this.control.setAttribute("id","control");
    this.control.style.position = "absolute";
    this.control.style.top = "2.5%";
    this.control.style.right = "2.5%";
    this.control.style.width = "25%";
    this.control.style.height = "95%";
    this.control.style.color = "rgb(173,172,173)";
    this.control.style.padding = "2.5px";
    this.control.style.fontFamily = "monospace";
    this.control.style.overflowX = "hidden";
    this.control.style.overflowY = "hidden";

    control.appendChild(this.terminal.element);
    this.terminal.element.setAttribute("tabindex","0");
    this.terminal.element.setAttribute("id","terminal");
    this.terminal.element.innerHTML = this.terminal.output + "User: " + this.terminal.input + "<";
    this.terminal.element.style.position = "static";
    this.terminal.element.style.right = "0%";
    this.terminal.element.style.width = "100%";
    this.terminal.element.style.height = "33.333%";
    this.terminal.element.style.color = "rgb(173,172,173)";
    this.terminal.element.style.padding = "2.5px";
    this.terminal.element.style.fontFamily = "monospace";
    this.terminal.element.style.overflowX = "hidden";
    this.terminal.element.style.overflowY = "auto";
    this.terminal.element.style.backgroundColor = "white";

    // initialise terminal after styling;
    this.terminal.init();

    sim.appendChild(this.canvasToolbar.element);
    this.canvasToolbar.element.setAttribute("id", "canvasToolbar");
    this.canvasToolbar.element.style.position = "absolute";
    this.canvasToolbar.element.style.width = (sim.clientWidth)+"px"
    this.canvasToolbar.element.style.height = "auto";
    this.canvasToolbar.element.style.top = 3 + "px";
    this.canvasToolbar.element.style.left = 3 + "px";
    this.canvasToolbar.element.style.backgroundColor = "rgba(255, 255, 255, 0.5)";

    this.infoBox = document.createElement("div");
    control.appendChild(this.infoBox);
    this.infoBox.setAttribute("id", "infoBox");
    this.infoBox.style.position = "static";
    this.infoBox.style.padding = "2.5px";
    this.infoBox.style.backgroundColor = "rgba(0,0,0,0.2)";
    this.infoBox.style.width = "100%";
    this.infoBox.style.height = "66.6666%";
    this.infoBox.style.color = "black"//"rgb(173,172,173)";
    this.infoBox.style.zIndex = document.getElementById("control").style.zIndex + 1;
    this.infoBox.style.overflowX = "hidden";
    this.infoBox.style.overflowY = "auto";

    this.textInfo = document.createElement("div");
    this.infoBox.appendChild(this.textInfo);
    this.textInfo.setAttribute("id", "textInfo");
    this.textInfo.style.position = "static";
    this.textInfo.style.width = "99%";
    this.textInfo.style.height = "40%";
    this.textInfo.style.overflowX = "hidden";
    this.textInfo.style.overflowY = "auto";

    this.graphicInfo = document.createElement("div");
    this.infoBox.appendChild(this.graphicInfo);
    this.graphicInfo.setAttribute("id", "graphicInfo");
    this.graphicInfo.style.position = "static";
    this.graphicInfo.style.top = "0%";
    this.graphicInfo.style.width = "99%";
    this.graphicInfo.style.height = "auto";
    this.graphicInfo.style.overflowX = "hidden";
    this.graphicInfo.style.overflowY = "hidden";
    this.graphicInfo.style.backgroundColor = "white";

    this.chart = document.createElement("canvas");
    this.graphicInfo.appendChild(this.chart);
    this.chart.style.position = "static";
    this.chart.style.top = "0%";
    this.chart.width = this.graphicInfo.clientWidth * 0.99;
    this.chart.height = 2*this.graphicInfo.clientHeight/2;
    this.chart.id = "chart";
    this.chart.style.cursor= "crosshair";
    this.chart.style.borderColor = "black";
    this.chart.style.borderStyle = "solid";

    this.graphicInfo.appendChild(this.chartToolbar.element);
    this.chartToolbar.element.setAttribute("id", "chartToolbar");
    this.chartToolbar.element.style.position = "static";
    this.chartToolbar.element.style.width = (sim.clientWidth)+"px"
    this.chartToolbar.element.style.height = "20px";
    this.chartToolbar.element.style.top = 3 + "px";
    this.chartToolbar.element.style.left = 3 + "px";
    this.chartToolbar.element.style.backgroundColor = "none";

    this.chartDesc = document.createElement("div");
    this.graphicInfo.appendChild(this.chartDesc);
    this.chartDesc.setAttribute("id", "chartDesc");
    this.chartDesc.style.position = "static";
    this.chartDesc.style.bottom = "0%";
    this.chartDesc.style.display = "inline-block";
    this.chartDesc.style.verticalAlign = "top";
    this.chartDesc.style.textAlign = "right";
    this.chartDesc.style.right = "0%";
    this.chartDesc.style.width = "99%";
    this.chartDesc.style.height = "auto";
    this.chartDesc.style.fontSize = "16px";
    this.chartDesc.style.backgroundColor = "none";
  
  }

  slider(min=0, max=100, step=1){

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

  drawChart(chart)
  {

    var dataArr = chart.data;
    var col = chart.col;
    var largest = this.sharedData.analysisChartsLargest;

    var canvas = document.getElementById( "chart" );
    var context = canvas.getContext( "2d" );

    var PADDING = 10;
    var GRAPH_TOP = PADDING;
    var GRAPH_BOTTOM = this.chart.clientHeight - PADDING;
    var GRAPH_HEIGHT = GRAPH_BOTTOM - GRAPH_TOP;
    var GRAPH_LEFT = PADDING;
    var GRAPH_RIGHT = this.chart.clientWidth - PADDING;
    var arrayLen = dataArr.length;

    if (!(chart.onto)) {
      context.clearRect( 0, 0, GRAPH_RIGHT+PADDING, GRAPH_BOTTOM +PADDING);
      context.fillStyle = "cornsilk";
      context.fillRect( 0, 0, GRAPH_RIGHT + PADDING, GRAPH_BOTTOM + PADDING );
    }

  

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
    context.stroke();

    // draw reference line
    context.beginPath();
    context.moveTo( GRAPH_LEFT, ( GRAPH_HEIGHT ) / 4 * 3 + GRAPH_TOP );
    context.lineTo( GRAPH_RIGHT, ( GRAPH_HEIGHT ) / 4 * 3 + GRAPH_TOP );
    // draw reference value for hours
    context.stroke();

    // draw reference line
    context.beginPath();
    context.moveTo( GRAPH_LEFT, ( GRAPH_HEIGHT ) / 2 + GRAPH_TOP );
    context.lineTo( GRAPH_RIGHT, ( GRAPH_HEIGHT ) / 2 + GRAPH_TOP );
    // draw reference value for hours
    context.stroke();

    // draw reference line
    context.beginPath();
    context.moveTo( GRAPH_LEFT, ( GRAPH_HEIGHT ) / 4 + GRAPH_TOP );
    context.lineTo( GRAPH_RIGHT, ( GRAPH_HEIGHT ) / 4 + GRAPH_TOP );
    // draw reference value for hours
    context.stroke();

    context.beginPath();
    context.lineJoin = "round";
    context.strokeStyle = col;

    context.moveTo( GRAPH_LEFT, ( GRAPH_HEIGHT - dataArr[ 0 ] / largest * GRAPH_HEIGHT ) + GRAPH_TOP );
    for( var i = 1; i < arrayLen; i++ ){
        context.lineTo( GRAPH_RIGHT / arrayLen * i + GRAPH_LEFT, ( GRAPH_HEIGHT - dataArr[ i ] / largest * GRAPH_HEIGHT ) + GRAPH_TOP );
    }

    context.stroke();
  }
}
