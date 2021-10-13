/**
 * WeLD.js
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


 // setup simulation canvas and terminal ///////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////

 ui = Graphics.UserInterface;
 ui.loadBasic(); // loads divs for simulation, control and terminal, and initialises the terminal

 // load physics controls  /////////////////////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////

 // temperature
  tempController = Physics.Temperature;
  // ui controls for temperature
  tempSlider = ui.slider(0,1,0.001)

  tempSliderContainer = tempSlider[0];
  control.appendChild(tempSliderContainer);

  tempSliderInput = tempSlider[1];
  tempSliderLabel =  tempSlider[2];

  tempSliderInput.value = tempController.temp();
  tempSliderLabel.innerHTML = "Temperature: " + tempSliderInput.value;

  tempSliderInput.oninput = function(){
    var value = tempSliderInput.value;
    tempController.changeTemp(value);
    tempSliderLabel.innerHTML = "Temperature: " + value;
  }

    // spring constant
    harmonicController = Physics.Harmonic;

    // ui controls for spring constant
    springConstSlider = ui.slider(0,1,0.01)

    springConstSliderContainer = springConstSlider[0];
    control.appendChild(springConstSliderContainer);

    springConstSliderInput = springConstSlider[1];
    springConstSliderLabel =  springConstSlider[2];

    springConstSliderLabel.innerHTML = "k (spring): " + 0;

    springConstSliderInput.oninput = function(){
      var value = springConstSliderInput.value;
      harmonicController.changeKSpring(value);
      springConstSliderLabel.innerHTML = "k (spring): " + value;
    }

    // ui controls for valence angle constant
    valenceConstSlider = ui.slider(0,1, 0.01)
    valenceConstSliderContainer = valenceConstSlider[0];
    control.appendChild(valenceConstSliderContainer);

    valenceConstSliderInput = valenceConstSlider[1];
    valenceConstSliderLabel = valenceConstSlider[2];

    valenceConstSliderLabel.innerHTML = "k (valence): " + 0;

    valenceConstSliderInput.oninput = function(){
      var value = valenceConstSliderInput.value;
      harmonicController.changeKValence(value);
      valenceConstSliderLabel.innerHTML = "k (valence): " + value;
    }

  // setup physics resources ////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////

  var edgeLen = 50;

  lattice = Physics.Lattice;
  lattice.setUI(ui);
  lattice.setShowEdges(false);

  lattice.setPredicate(
    function(i,j){
      return Physics.Vector.norm(Physics.Vector.sub(i,j)) <= edgeLen && i !== j  && i.col == j.col && i.col!=="orange"
    });

  lattice.makePrimitive3D(5,5,5, edgeLen, ui.sim());

  ui.setData(lattice.data());
  ui.setNodes(lattice.nodes());

  var physics = [harmonicController.spring, harmonicController.valence, tempController.vibrate];

  // setup graphics resources ///////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////

  // set up camera controls
  sim.setAttribute("onload","makeDraggable(evt)");

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
      renderer.setRho( ((svgDragStartPosX - evt.clientX) * 0.01) );
      renderer.setTheta( ((svgDragStartPosY - evt.clientY) * 0.01) );
    }
  }
  function endDrag(evt) {
    selectedElement = null;
  }

}

  renderer = Graphics.Renderer;
  renderer.setFPS(60);

  renderer.addAnimation(physics, false, lattice, ui)
  animation = renderer.render(lattice);

 // non-essential WeLD banner //////////////////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////

var container = document.createElement("div");
container.setAttribute("id","weld");
control.appendChild(container);

container.style.position = "absolute";
container.style.bottom = "0%";
container.style.right = "0%";
container.style.width = "35%";
container.style.height = "7%";
container.style.color = "white";
container.style.fontFamily = "monospace";
container.style.overflowX = "scroll";
container.style.overflowY = "scroll";

var img = document.createElement("img");
img.style.position = "absolute";
img.style.padding = "2.5px"
img.style.maxWidth = "100%";
img.style.maxHeight = "100%";
img.style.right = "0%";
img.src = "weld.png";
document.getElementById("weld").appendChild(img);
