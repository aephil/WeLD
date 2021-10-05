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


 // load physics resources /////////////////////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////

 physEngine = Physics.Engine;

 // temperature
 tempController = Physics.Temperature;
    // ui controls for temperature
    tempSlider = UserInterface.slider()

    tempSliderContainer = tempSlider[0];
    tempSliderInput = tempSlider[1];
    tempSliderLabel =  tempSlider[2];

    tempSliderInput.node().value = tempController.temp()
    tempSliderLabel.html("Temperature: " + tempSliderInput.node().value )

    tempSliderInput.node().oninput = function(){
      var value = tempSliderInput.node().value;
      tempController.changeTemp(value * (1/100))
      tempSliderLabel.html("Temperature: " + value )
    }

    // spring constant
    harmonicController = Physics.Harmonic;

      // ui controls for spring constant
      springConstSlider = UserInterface.slider(1,200)
      springConstSliderContainer = springConstSlider[0];
      springConstSliderContainer.style("top","30%")

      springConstSliderInput = springConstSlider[1];
      springConstSliderLabel =  springConstSlider[2];

      springConstSliderInput.node().value = harmonicController.kSpring() * 100;
      springConstSliderLabel.html("k (spring): " + harmonicController.kSpring() )
      springConstSliderInput.node().oninput = function(){
        var value = springConstSliderInput.node().value;
        harmonicController.changeKSpring(value * (1/100))
        springConstSliderLabel.html("k (spring): " + ((value) * (1/100)).toFixed(2))
      }

      // ui controls for valence angle constant
      valenceConstSlider = UserInterface.slider(0,500)
      valenceConstSliderContainer = valenceConstSlider[0];
      valenceConstSliderContainer.style("top","40%")

      valenceConstSliderInput = valenceConstSlider[1];
      valenceConstSliderLabel = valenceConstSlider[2];

      valenceConstSliderInput.node().value = harmonicController.kValence();
      valenceConstSliderLabel.html("k (valence): " + harmonicController.kValence() )
      valenceConstSliderInput.node().oninput = function(){
        var value = valenceConstSliderInput.node().value;
        harmonicController.changeKValence(value);
        console.log(value);
        valenceConstSliderLabel.html("k (valence): " + value);
      }

    var edgeLen = 20;

    function hasNeighbour(i,j){
      i.neighbours.forEach(function(el, i){
        if(j[0]==el[0]){return true};
      })
      return false;
    }

  lattice = Physics.Lattice;
  lattice.setPredicate(function(i,j){ return Physics.Vector.norm(Physics.Vector.sub(i,j)) <= edgeLen && i !== j && !hasNeighbour(j,i)});
  latticeData =  lattice.makePrimitive2D(100, 10, edgeLen);

  var nodes = []
  nodesData = latticeData[0] // formatted dataset for nodes
  for(let i = 0; i < nodesData.length; i++)
  {
    var newNode = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    newNode.setAttribute("r",+5);
    newNode.setAttribute("stroke","red");
    newNode.setAttribute("fill","red");
    sim.appendChild(newNode);
    nodes.push(newNode);
  }

    var physics = [harmonicController.bond, harmonicController.valence, tempController.vibrate];

 /////////

 var redraw = function(node,datapoint)
 {
   node.setAttribute("cx", centreToScreenX(datapoint.x) )
   node.setAttribute("cy", centreToScreenY(datapoint.y) )
 }

 renderer = Graphics.Renderer;
// renderer.setFPS(60, terminalObj);
 renderer.setSpeed(30, terminalObj);
 renderer.addAnimation(physics, redraw, nodes, nodesData )
 animation = renderer.render(nodesData, nodes)
