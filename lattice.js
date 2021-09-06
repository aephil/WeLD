
/**
 * Lattice.js / WeLD
 *
 * Copyright (C) 2019-07-13, Author Takudzwa Makoni
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

 ///////////////////////////////////////////////////////////////////////////
 ///////////////////////// setup physics ///////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////

 // exponential repulsion

 function repulsionExp(d){

   for(var i = 0; i < d.neighbours.length; i++)
    {
      var neighbour = d.neighbours[i]
      var nIndex = neighbour[0]; // index of neighbour in points
      if(pointLen3D(i,nIndex) < 1)
      {
        // f = 1 / pointLen3D(i,nIndex)
        // resolve
      }
    }

 }

 // Temperature ////////////////////////////////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////

 var temperature = 0
 let dof = 2;
 var kinetic = 0
 var avgKinEn = (dof/2) * temperature // natural units

 function updateTemperature(d){
   var rnd = randomNumber(0,1);
   avgKinEn = (dof/2) * (temperature) * 0.634; // new target K.E
   var vsquared = avgKinEn * 2 / d.m;
   d.vx = rnd * Math.sqrt(vsquared) * (randomNumber(0,1) > 0.5 ? -1 : 1);
   d.vy = (1-rnd) * Math.sqrt(vsquared) * (randomNumber(0,1) > 0.5 ? -1 : 1);
 }

 // Springs ////////////////////////////////////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////

 function springPotentials(d, i){

     var neighbour = d.neighbours[i]
     nodesLen = neighbour[1]; // node length between neighbour and particle
     nIndex = neighbour[0]; // index of neighbour in points

     dx = Math.abs(d.px - points[nIndex].px).toFixed(2)
     dy = Math.abs(d.py - points[nIndex].py).toFixed(2)

     // extension
     ext = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2)) - nodesLen

     contract = !(ext > 0);
     extY = dx < 0.001 ? 0 : ext * dy/nodesLen
     extX = ext * dx/nodesLen

     // fix one atom!

     directionX = contract ? (d.px < points[nIndex].px ? -1 : 1) : (d.px < points[nIndex].px ? 1 : -1)
     directionY = contract ? (d.py < points[nIndex].py ? -1 : 1) : (d.py < points[nIndex].py ? 1 : -1)

     ax = (k * Math.abs(extX).toFixed(2) / d.m ).toFixed(2)
     ay = (k * Math.abs(extY).toFixed(2) / d.m ).toFixed(2)

     var px = (0.5*ax) * directionX
     var pxN = (0.5*ax) * (-1 * directionX)

     // new image dx
     var idx = Math.abs(px - pxN)

     var py = (0.5*ay) * directionY
     var pyN = (0.5*ay) * (-1 * directionY)

     // new image dy
     var idy = Math.abs(py - pyN)

     // new image distance between
     var id = Math.sqrt(Math.pow(idx,2) + Math.pow(idy,2))

       d.px += px
       points[nIndex].px += pxN

       d.py += py
       points[nIndex].py += pyN

     //inter-particle kinematics
     updateVerletP(d,0.01,0,0);
     //exchangeMomenta(d,points)

     //kinetic +=  0.5 * d.m * (Math.pow(d.vx,2) + Math.pow(d.vy,2));

      edgesData.push(
      [
        {
          x1:centreToScreenX(d.px),
          y1:centreToScreenY(d.py),
          x2:centreToScreenX(points[nIndex].px),
          y2:centreToScreenY(points[nIndex].py)
        }
      ]
     )


   }

 ///////////////////////////////////////////////////////////////////////////
 ///////////////////////////// setup svg ///////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////

var worldHeight = 900; // in pixels
var worldWidth = 1000;  // in pexels

var body = d3.select("body");

var world = body.append("svg")
  .style("position", "fixed")
  .style("top", "2.5%")
  .style("left", "2.5%")
  .style("width", "95%")
  .style("height","95%")
  .style("border-color","black")
  .style("border-style","solid")
  .style("background-color", "grey");

// the simulation world
var sim = body
  .append("svg")
  .style("position", "fixed")
  .style("top", "2.5%")
  .style("left", "2.5%")
  .style("width", "70.5%")
  .style("height","95.0%")
  .style("border-color","black")
  .style("border-style","solid")
  .style("background-color", "white");

///////////////////////////////////////////////////////////////////////////
///////////////////////////// setup the lattice ///////////////////////////
///////////////////////////////////////////////////////////////////////////

var lineFunction = d3.line()
 .x(function(d) { return d.x; })
 .y(function(d) { return d.y; });

function testPredicate(i,j)
{
  // points that satisfy this condition will be nodesed
  return vec.norm(vec.sub(i,j)) <= 50 && i != j
}

latticeData = Lattice.makeFCC2D(2,2,50, testPredicate)

points = latticeData[0]
edgesData = latticeData[1]


var nodes = sim.selectAll("circle").data(points);
var edges = sim.selectAll("line").data(edgesData);

///////////////////////////////////////////////////////////////////////////
/////////////////// setup the controls and peripherals ////////////////////
///////////////////////////////////////////////////////////////////////////

// Info canvas ////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

var infoBuffer = "";
var infoContainer = body
  .append("div")
  .attr("id","vterm")
  .style("position", "fixed")
  .style("width", "24%")
  .style("height","20%")
  .style("top", "2.5%")
  .style("right", "2%")
  .style("border-color","black")
  .style("border-style","dashed")
  .style("color", "white")
  .style("padding","1.5 em")
  .style("overflow-y","scroll")
  .style("overflow-x","scroll")
  .style("background-color", "black")

function updateScroll(){
  var element = document.getElementById("info");
  element.scrollTop = element.scrollHeight;
}

function infoLog(msg)
  {
    infoBuffer += msg + "<br/>";
    infoContainer.html(infoBuffer)
    updateScroll()
  }

// Temperature ////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

var tempContainer = body
  .append("div")
  .style("position", "fixed")
  .style("width", "24%")
  .style("height","10%")
  .style("top", "22.5%")
  .style("right", "2.0%")
  .style("border-color","black")
  .style("border-style","dashed")
  .style("background-color", "grey");

tempControlObj = confirmDialogue(tempContainer)
tempContainerDiv = tempControlObj[0]
tempCtlTextBox = tempControlObj[1]
tempCtlBtn1 = tempControlObj[2]
tempCtlBtn2 = tempControlObj[3]

tempContainerDiv
  .style("background-color","rgba(0,0,0,0.5)")
tempCtlTextBox
  .style("background-color","rgba(0,0,0,0.0)")
  .attr("text","white")
  .style("font-family","monospace")
  .html("Temp: "+ temperature.toString())
tempCtlBtn1
  .style("background-color","red")
  .on("click", function(){
    if(temperature<1000)
    {
      temperature += 0.01
      infoLog("info: heating up.")
      infoLog("last temp: "+ temperature.toFixed(2).toString())
      tempCtlTextBox.html("Temp: "+temperature.toFixed(2).toString())

    }
  })
tempCtlBtn2
  .style("background-color","blue")
  .on("click", function(){
    if(temperature>0)
    {
      temperature -= 0.01
      // sometimes temperature still becomes negative, such as -0.0
      temperature = Math.abs(temperature)

      infoBuffer += "info: cooling down." + "<br/>" + "last temp: "+ temperature.toFixed(2).toString() + "<br/>";
      infoContainer.html(infoBuffer)
      updateScroll()
      tempCtlTextBox.html("Temp: "+temperature.toFixed(2).toString())
    }
    else
    {
      infoBuffer += "info: min temp reached" + "<br/>"
      infoContainer.html(infoBuffer)
      updateScroll()
    }
  })

///////////////////////////////////////////////////////////////////////////
///////////////////////// draw the lattice to screen //////////////////////
///////////////////////////////////////////////////////////////////////////

// make nodes draggable
function dragged(event, d) {
  nodes.raise()
  .selectAll("circle")
  .attr("cx", d.px =  event.x - worldWidth/2).attr("cy", d.py = worldHeight/2 - event.y);
  }

// generate nodes using lattice data
nodes.enter()
  .append("circle")
  .attr("r",function(d){return d.r})
  .attr("cx",function(d){return centreToScreenX(d.px)})
  .attr("cy", function(d){return centreToScreenY(d.py)})
  .attr("fill", function(d){return d.col})
  .attr("stroke", "black")
  .call(
  d3.drag()
  .on("drag", dragged));

var edges = sim.selectAll("line").data(edgesData);
edges.enter()
  .append("line")
  .style("stroke", "blue")  // colour the line
  .attr("x1", function(d){return centreToScreenX(d.x1)})     // x position of the first end of the line
  .attr("y1", function(d){return centreToScreenY(d.y1)})     // y position of the first end of the line
  .attr("x2", function(d){return centreToScreenX(d.x2)})     // x position of the second end of the line
  .attr("y2", function(d){return centreToScreenY(d.y2)});

var frames  = 0
var fps = 30
var breakLen = 1000
var k = 0.01

d3.timer(function(duration){
  elapsed = (duration * 0.001).toFixed(2)
  nodes.data(function(d){
      newEdgesData = []
      points.forEach(function(d)
      {

        updateTemperature(d)
        //springPotentials(d)
        physics.springPotentials(d,i)


      })


    return points
  })

  if(elapsed > frames * (1/fps))
  {
  nodes
    .enter()
    .selectAll("circle")
    .attr("cx",function(d){
      return centreToScreenX(d.px)
    })
    .attr("cy",function(d){
      return centreToScreenY(d.py)
    })

  frames += 1;
  }
  d3.timer.stop()
})
