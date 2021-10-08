/**
 * WeLD.js
 *
 * Coyright (C) 06-09-2021, Author Takudzwa Makoni
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
 * You should have received a coy of the GNU General Public License
 * along with This Program. If not, see <http://www.gnu.org/licenses/>.
 *
 * @license GPL-3.0+ <http://spdx.org/licenses/GPL-3.0+>
 */

 // setup simulation canvas and terminal ///////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////

 ui = UserInterface.loadBasic();
 sim = ui[0];
 vterm = ui[1];

 terminalObj = UserInterface.VTerm;
 terminalObj.parent = vterm;
 terminalObj.log("User Interface is setup!");


 // load physics controls  /////////////////////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////

 // temperature
 tempController = Physics.Temperature;
    // ui controls for temperature
    tempSlider = UserInterface.slider()

    tempSliderContainer = tempSlider[0];
    tempSliderInput = tempSlider[1];
    tempSliderLabel =  tempSlider[2];

    tempSliderInput.value = tempController.temp()
    tempSliderLabel.innerHTML = "Temperature: " + tempSliderInput.value;

    tempSliderInput.oninput = function(){
      var value = tempSliderInput.value;
      tempController.changeTemp(value * (1/100))
      tempSliderLabel.innerHTML = "Temperature: " + value;
    }

    // spring constant
    harmonicController = Physics.Harmonic;

      // ui controls for spring constant
      springConstSlider = UserInterface.slider(1,200)
      springConstSliderContainer = springConstSlider[0];
      springConstSliderContainer.style.top = "30%";

      springConstSliderInput = springConstSlider[1];
      springConstSliderLabel =  springConstSlider[2];

      springConstSliderInput.value = harmonicController.kSpring() * 100;
      springConstSliderLabel.innerHTML = "k (spring): " + harmonicController.kSpring();
      springConstSliderInput.oninput = function(){
        var value = springConstSliderInput.value;
        harmonicController.changeKSpring(value * (1/100))
        springConstSliderLabel.innerHTML = "k (spring): " + ((value) * (1/100)).toFixed(2);
      }

      // ui controls for valence angle constant
      valenceConstSlider = UserInterface.slider(0,500)
      valenceConstSliderContainer = valenceConstSlider[0];
      valenceConstSliderContainer.style.top = "40%";

      valenceConstSliderInput = valenceConstSlider[1];
      valenceConstSliderLabel = valenceConstSlider[2];

      valenceConstSliderInput.value = harmonicController.kValence();
      valenceConstSliderLabel.innerHTML = "k (valence): " + harmonicController.kValence();
      valenceConstSliderInput.oninput = function(){
        var value = valenceConstSliderInput.value;
        harmonicController.changeKValence(value);
        valenceConstSliderLabel.innerHTML = "k (valence): " + value;
      }

  // setup physics resources ////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////

    var edgeLen = 20;

  lattice = Physics.Lattice;
  lattice.terminalObj = terminalObj;
  lattice.setPredicate(function(i,j){ return Physics.Vector.norm(Physics.Vector.sub(i,j)) <= edgeLen && i !== j && !lattice.hasNeighbour(j,i)});
  latticeData =  lattice.makePrimitive3D(5,5,5, edgeLen);

  var nodes = []
  nodesData = latticeData[0] // formatted dataset for nodes

  for(let i = 0; i < nodesData.length; i++)
  {
    var newNode = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    newNode.setAttribute("r",+2);
    newNode.setAttribute("stroke","red");
    newNode.setAttribute("fill","red");
    sim.appendChild(newNode);
    nodes.push(newNode);
  }

  var physics = [harmonicController.bond, harmonicController.valence, tempController.vibrate];

  // setup graphics resources ///////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////

  // set up camera controls
  sim.setAttribute("onload","makeDraggable(evt)");


  // camera angles
  var rho = 0;
  var theta = 0;

  var svgDragStartPosX = 0;
  var svgDragStartPosY = 0;

  var selectedElement = false;

  function makeDraggable(evt) {
    var svg = evt.target;
    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousemove', drag);
    svg.addEventListener('mouseup', endDrag);
    svg.addEventListener('mouseleave', endDrag);
    function startDrag(evt) {
      if (evt.target.classList.contains('sim'))
      {
        selectedElement = evt.target;
        svgDragStartPosX = evt.clientX;
        svgDragStartPosY = evt.clientY;
      }
    }
    function drag(evt) {
      if (selectedElement)
      {
        evt.preventDefault();
        rho = ((svgDragStartPosX - evt.clientX) * 0.01)
        theta = ((svgDragStartPosY - evt.clientY) * 0.01)
      }
    }
    function endDrag(evt) {
      selectedElement = null;
    }
  }


var cameraX = function(d){
  return rotY(rotX(d,theta),rho).x
}

var cameraY = function(d){
  return rotY(rotX(d,theta),rho).y;
}

 var redraw = function(node,datapoint)
 {
   node.setAttribute("cx", centreToScreenX(cameraX(datapoint)) )
   node.setAttribute("cy", centreToScreenY(cameraY(datapoint)) )
 }

 renderer = Graphics.Renderer;
 renderer.setFPS(60, terminalObj);
// renderer.setSpeed(60, terminalObj);
 renderer.addAnimation(physics, redraw, nodes, nodesData )
 animation = renderer.render(nodesData, nodes)


 // non-essential WeLD banner //////////////////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////
var container = document.createElement("div");
container.setAttribute("id","weld");
document.body.appendChild(container);

container.style.position = "fixed";
container.style.bottom = "2.5%"
container.style.right = "1.5%"
container.style.width = "25%"
container.style.height = "20%"
container.style.color = "white"
container.style.padding = "2.5 em"
container.style.fontFamily = "monospace"
container.style.backgroundColor = "white"
container.style.overflowX = "scroll"
container.style.overflowY = "scroll"


var img = document.createElement("img");
img.style.maxWidth = "100%"
img.style.maxHeight = "100%"

img.src = "weld.png";

document.getElementById("weld").appendChild(img);
