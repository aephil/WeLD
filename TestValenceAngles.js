
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
    harmonicController = Physics.Harmonic;

      // ui controls for spring constant
      springConstSlider = UserInterface.slider(1,100)


      springConstSliderContainer = springConstSlider[0];
      springConstSliderContainer.style("top","30%")

      springConstSliderInput = springConstSlider[1];
      springConstSliderLabel =  springConstSlider[2];

      springConstSliderInput.node().value = harmonicController.k() * 100;
      springConstSliderLabel.html("k: " + harmonicController.k() )
      springConstSliderInput.node().oninput = function(){
        var value = springConstSliderInput.node().value;
        harmonicController.changeK(value * (1/100))
        springConstSliderLabel.html("k: " + ((value) * (1/100)).toFixed(2))
      }

 physEngine.addCallBack(harmonicController.bond)
 //physEngine.addCallBack(harmonicController.valence)
 physEngine.addCallBack(tempController.vibrate)
 physEngine.addCallBack(Physics.VerletP)

 var edgeLen = 35;
 var edgePredicate = function(i,j){ return Physics.Vector.norm(Physics.Vector.sub(i,j)) <= edgeLen && i != j}

/*
 nodesData = [
   {
     vx:0, // velocity x
     vy:0, // velocity y
     vz:0, // velocity z

     x:0, // position x
     y:0, // position y
     z:0, // position z

     r:5,  // radius
     m:1,  // mass

     neighbours:[[1,edgeLen],[2,edgeLen]], // index of other atoms
     col:"red", // colour
   },

   {
     vx:0, // velocity x
     vy:0, // velocity y
     vz:0, // velocity z

     x: edgeLen* Math.cos(Math.PI/12), // position x
     y:-1*edgeLen * Math.sin(Math.PI/12), // position y
     z:0, // position z

     r:5,  // radius
     m:1,  // mass

     neighbours:[[0,edgeLen]], // index of other atoms
     col:"blue", // colour
   },

   {
     vx:0, // velocity x
     vy:0, // velocity y
     vz:0, // velocity z

     x:(edgeLen) * Math.cos(Math.PI/12), // position x
     y: edgeLen * Math.sin(Math.PI/12), // position y
     z:0, // position z

     r:5,  // radius
     m:1,  // mass

     neighbours:[[0,edgeLen]], // index of other atoms
     col:"green", // colour
   },

 ]
 edgesData = []
*/

 latticeData = Lattice.makeFCC2D(5,5, edgeLen, edgePredicate)
 //latticeData = Lattice.makePrimitive2D(10, 5, edgeLen, edgePredicate)

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
   terminalObj.log("here")

   nodes.raise()
   .selectAll("circle")
   .attr("cx", d.x =  event.x - simWidth/2).attr("cy", d.y = simHeight/2 - event.y);
   }

   nodes
   .selectAll("circle")
   .call(
     d3.drag()
   .on("drag", dragged));

 tempController.changeDOF(47 /*2N - 3*/)

 var svgClickX = 0
 var svgClickY = 0
 var rho = 0;
 var theta = 0;

 d3.select("svg").call(d3.drag().on("start",function(){
   svgClickX = d3.pointer(event)[0]
   svgClickY = d3.pointer(event)[1]
 })
 .on("drag",function(){

   rho = (svgClickX - d3.pointer(event)[0]) * 0.01;
   theta = (svgClickY - d3.pointer(event)[1]) * 0.01;

   terminalObj.log("rho: "+rho)
   terminalObj.log("theta: "+theta)

    //update the window

   }));

// define how the renderer should redraw to screen each frame
 var redraw = function(handle)
 {
   handle
     .enter()
     .selectAll("circle")
     .attr("cx",function(d){
       var x = Math.cos(rho)*d.x + Math.sin(rho)*d.z
       return centreToScreenX(x)
     })
     .attr("cy",function(d){
       var y = d.y*Math.cos(theta)-d.z*Math.sin(theta);
       return centreToScreenY(y)
     })
     .attr("r",function(d){
       return d.r
     })
 }

 renderer = Graphics.Renderer;
 //renderer.setFPS(60, terminalObj);
 renderer.setSpeed(10, terminalObj);
 renderer.addAnimation(physEngine.update, redraw, nodes, nodesData )
 animation = renderer.render(nodesData, nodes)
 //animation.stop()
