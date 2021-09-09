
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

 ui = UserInterface.loadBasic();
 sim = ui[0];
 vterm = ui[1];

 sim.attr("id", "sim")
 simWidth = document.getElementById('sim').clientWidth
 simHeight = document.getElementById('sim').clientHeight

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
    harmonicController = Physics.Spring;

      // ui controls for spring constant
      springConstSlider = UserInterface.slider(1,100)


      springConstSliderContainer = springConstSlider[0];
      springConstSliderContainer.style("top","30%")

      springConstSliderInput = springConstSlider[1];
      springConstSliderLabel =  springConstSlider[2];

      springConstSliderInput.node().value = harmonicController.k();
      springConstSliderLabel.html("k: " + harmonicController.k() * (1/100))
      springConstSliderInput.node().oninput = function(){
        var value = springConstSliderInput.node().value;
        harmonicController.changeK(value * (1/100))
        springConstSliderLabel.html("k: " + ((value) * (1/100)).toFixed(2))
      }

 physEngine.addCallBack(harmonicController.linear)
 physEngine.addCallBack(tempController.vibrate)
 physEngine.addCallBack(Physics.VerletP)

 var edgeLen = 20;
 var edgePredicate = function(i,j){ return Physics.Vector.norm(Physics.Vector.sub(i,j)) <= edgeLen && i != j}
 latticeData = Lattice.makeFCC2D(10,5,edgeLen, edgePredicate )
 //latticeData = Lattice.makePrimitive2D(10,5,edgeLen, edgePredicate )

 nodesData = latticeData[0] // formatted dataset for nodes
 edgesData = latticeData[1] // formatted dataset for edges

 terminalObj.log("loaded nodes and edges")
 terminalObj.log("num nodes: " + nodesData.length)
 terminalObj.log("num edges: " + edgesData.length)

 // setup graphics /////////////////////////////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////

 // bind nodes dataset with svg circle assets using d3 and draw to screen
 nodes = Lattice.draw(sim, nodesData) // handle for d3 object

 function dragged(event, d) {
   nodes.raise()
   .selectAll("circle")
   .attr("cx", d.px =  event.x - worldWidth/2).attr("cy", d.py = worldHeight/2 - event.y);
   }

 nodes
 .selectAll("circle")
 .call(
 d3.drag()
 .on("drag", dragged));

 tempController.changeTemp(0.01)
 tempController.changeDOF(47 /*2N - 3*/)

// define how the renderer should redraw to screen each frame
 var redraw = function(handle)
 {
   handle
     .enter()
     .selectAll("circle")
     .attr("cx",function(d){
       return centreToScreenX(d.px)
     })
     .attr("cy",function(d){
       return centreToScreenY(d.py)
     })
 }

 renderer = Graphics.Renderer;
 renderer.setFPS(30, terminalObj);
 renderer.addAnimation(physEngine.update, redraw, nodes, nodesData )
 animation = renderer.render(nodesData, nodes)
 //animation.stop()
