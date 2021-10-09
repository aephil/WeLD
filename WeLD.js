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
 terminalObj.log("User Interface is setup.");


 // load physics controls  /////////////////////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////

 // temperature
 tempController = Physics.Temperature;
    // ui controls for temperature
    tempSlider = UserInterface.slider(0,1,0.001)

    tempSliderContainer = tempSlider[0];
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
      springConstSlider = UserInterface.slider(0,1,0.01)
      springConstSliderContainer = springConstSlider[0];
      springConstSliderContainer.style.top = "30%";

      springConstSliderInput = springConstSlider[1];
      springConstSliderLabel =  springConstSlider[2];

      springConstSliderLabel.innerHTML = "k (spring): " + 0;
      springConstSliderInput.oninput = function(){
        var value = springConstSliderInput.value;
        harmonicController.changeKSpring(value);
        springConstSliderLabel.innerHTML = "k (spring): " + value;
      }

      // ui controls for valence angle constant
      valenceConstSlider = UserInterface.slider(0,1, 0.01)
      valenceConstSliderContainer = valenceConstSlider[0];
      valenceConstSliderContainer.style.top = "38%";

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
  lattice.setTerminal(terminalObj);
  lattice.setShowEdges(false);

  lattice.setPredicate(
    function(i,j){
      return Physics.Vector.norm(Physics.Vector.sub(i,j)) <= edgeLen && i !== j && i.col == j.col && i.col!=="orange"
    });

  lattice.makePrimitive3D(5,5,5, edgeLen, sim);
  var physics = [harmonicController.spring, harmonicController.valence, tempController.vibrate];

  // setup graphics resources ///////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////

  // set up camera controls
  sim.setAttribute("onload","makeDraggable(evt)");

  var svgDragStartPosX = 0;
  var svgDragStartPosY = 0;
  var selectedElement = false;

  renderer = Graphics.Renderer;
  renderer.setTerminal(terminalObj);
  renderer.setFPS(60);

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

 renderer.addAnimation(physics, false, lattice )
 animation = renderer.render(lattice)

 // non-essential WeLD banner //////////////////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////
var container = document.createElement("div");
container.setAttribute("id","weld");
document.body.appendChild(container);

container.style.position = "fixed";
container.style.bottom = "2.5%";
container.style.right = "1.5%";
container.style.width = "25%";
container.style.height = "20%";
container.style.color = "white";
container.style.padding = "2.5 em";
container.style.fontFamily = "monospace";
container.style.backgroundColor = "white";
container.style.overflowX = "scroll";
container.style.overflowY = "scroll";

var img = document.createElement("img");
img.style.maxWidth = "100%";
img.style.maxHeight = "100%";

img.src = "weld.png";
document.getElementById("weld").appendChild(img);
