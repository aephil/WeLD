
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

 d3.select("body").style("background-color","grey")
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

 physEngine.addCallBack(harmonicController.bond)
 physEngine.addCallBack(harmonicController.valence)
 physEngine.addCallBack(tempController.vibrate)

 var edgeLen = 20;

 // checks if i includes j as a neighbour;
 function hasNeighbour(i,j){
   i.neighbours.forEach(function(el, i){
     if(j[0]==el[0]){return true};
   })
   return false;
 }

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

 //latticeData = Lattice.makeFCC2D(5,5, edgeLen, edgePredicate)
  lattice = Physics.Lattice;
  lattice.setPredicate(function(i,j){ return Physics.Vector.norm(Physics.Vector.sub(i,j)) <= edgeLen && i !== j && !hasNeighbour(j,i)});
  latticeData =  lattice.makePrimitive2D(10, 10, edgeLen);

 nodesData = latticeData[0] // formatted dataset for nodes
 edgesData = latticeData[1] // formatted dataset for edges
 edgesGroup = sim.append("svg");

 terminalObj.log("loaded nodes and edges")
 terminalObj.log("num nodes: " + nodesData.length)
 terminalObj.log("num edges: " + edgesData.length)

 // setup graphics /////////////////////////////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////

 // bind nodes dataset with svg circle assets using d3 and draw to screen
 nodes = lattice.draw(sim, nodesData) // handle for d3 object

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

 var svgClickX = 0;
 var svgClickY = 0;
 var rho = 0;
 var theta = 0;

 var info = sim
   .append("text")
   .attr("x",50)
   .attr("y", 50)
   .attr("fill","black")
   .attr("stroke","none");

 var info2 = sim
   .append("text")
   .attr("x",50)
   .attr("y", 70)
   .attr("fill","black")
   .attr("stroke","none");


 d3.select("svg").call(d3.drag().on("start",function(){
   svgClickX = d3.pointer(event)[0];
   svgClickY = d3.pointer(event)[1];
 })
 .on("drag",function(){

   rho = ((svgClickX - d3.pointer(event)[0]) * 0.01)
   theta = ((svgClickY - d3.pointer(event)[1]) * 0.01)
  // rho %= Math.PI * 2
  // theta %= Math.PI * 2

    //update the window

   }));

// define how the renderer should redraw to screen each frame
 var redraw = function(handle)
 {

  // edgesGroup.remove();
  // edgesGroup = sim.append("svg");

  info.text(function(){return "theta (x): " + theta.toFixed(2)+ " rad"})
  info2.text(function(){return "rho (y): " + rho.toFixed(2)+ " rad"})


   handle
     .enter()
     .selectAll("circle")
     .attr("cx",function(d){

  //     d.neighbours.forEach(function(el){
  //       edgesGroup.append("path")
  //       .attr("d", function(){
  //         var x1 = centreToScreenX(rotY(rotX(d,theta),rho).x);
  //         var y1 = centreToScreenY(rotY(rotX(d,theta),rho).y);
  //         var x2 = centreToScreenX(rotY(rotX(nodesData[el[0]],theta),rho).x);
  //         var y2 = centreToScreenY(rotY(rotX(nodesData[el[0]],theta),rho).y);
  //         var line =  lineFunction([{x:x1,y:y1},{x:x2,y:y2}]);
  //         return line;
  //       })

  //       .attr("stroke", "black")
  //       .attr("stroke-width", 0.1)
        // .attr("fill", "rgb(0,255,255,0.2)");
  //      })


       //var x = Math.cos(rho)*d.x + Math.sin(rho)*d.z
       var x = rotY(rotX(d,theta),rho).x
       return centreToScreenX(x)
     })
     .attr("cy",function(d){
       //var y = d.y*Math.cos(theta)-d.z*Math.sin(theta);
       var y = rotY(rotX(d,theta),rho).y;
       return centreToScreenY(y);
     })
     .attr("r",function(d){
       return d.r
     })
 }

 renderer = Graphics.Renderer;
 //renderer.setFPS(60, terminalObj);
 renderer.setSpeed(60, terminalObj);
 renderer.addAnimation(physEngine.update, redraw, nodes, nodesData )
 animation = renderer.render(nodesData, nodes)
 //animation.stop()
