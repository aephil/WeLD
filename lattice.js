
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
 ///////////////////////////// setup svg ///////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////

var worldHeight = 900; // in pixels
var worldWidth = 1000;  // in pexels

//
var canvas = d3.select("body").append("svg")
  .style("width", "100%")
  .style("height","100%")
  .style("background-color", "grey");

// simulation occurs here
var sim = canvas
  .append("rect")
  .style("width", "70%")
  .style("height", "100%")
  .style("fill", "white")
  .style("stroke", "black");

///////////////////////////////////////////////////////////////////////////
///////////////////////////// setup the lattice ///////////////////////////
///////////////////////////////////////////////////////////////////////////

function testPredicate(i,j)
{
  // points that satisfy this condition will be bonded
  return pointLen3D(i,j) <= 50 && i != j
}

points = makeFCC2D(5,5,50, testPredicate)
var bond = canvas.selectAll("circle").data(points);

///////////////////////////////////////////////////////////////////////////
/////////////////// setup the controls and peripherals ////////////////////
///////////////////////////////////////////////////////////////////////////

var info = canvas
  .append("text")
  .attr("x",110)
  .attr("y", 110)
  .attr("fill","black")
  .attr("stroke","none")
  .text("info here");

var tempInfo = canvas
  .append("text")
  .attr("x",screenToCentreX(800))
  .attr("y", screenToCentreY(-850))
  .attr("fill","none")
  .attr("stroke","black");

function dragged(event, d) {
  bond.raise().attr("cx", d.px =  event.x - worldWidth/2).attr("cy", d.py = worldHeight/2 - event.y);
  }

bond.enter()
  .append("circle")
  .attr("r",function(d){return d.r})
  .attr("cx",function(d){return centreToScreenX(d.px)})
  .attr("cy", function(d){return centreToScreenY(d.py)})
  .attr("fill", function(d){return d.col})
  .attr("stroke", "black")
  .call(
  d3.drag()
  .on("drag", dragged));

  var N = 9;
  var temperature = 0
  var dT = 0;
  var tempUpdated = false
  let dof = 2;
  var kinetic = 0

  var avgKinEn = (dof/2) * temperature // natural units

  var tempButtonUp = canvas
    .append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .attr("y",screenToCentreY(-800-35))
    .attr("x",screenToCentreX(800 + 70))
    .attr("fill", "red")
    .on("click",
      function()
      {

          if(temperature<1000)
          {
            temperature += 1
            tempUpdated = true;
            console.log("heating up.")
            console.log("last temp: " + temperature.toString())
          }

      }
    )

    var tempButtonDown = canvas
      .append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("y",screenToCentreY(-800-35))
      .attr("x",screenToCentreX(800 + 85))
      .attr("fill", "blue")
      .on("click",
        function()
        {

            if(temperature>0)
            {
              temperature -= 1
              console.log("cooling down.")
              console.log("last temp: " + temperature.toString())
            }
            else
            {
              console.log("min temp reached")
              console.log("last temp: " + temperature.toString())
            }

        }
      )

var frames  = 0
var fps = 30

var breakLen = 1000
var k = 0.5

var lineFunction = d3.line()
  .x(function(d) { return d.x; })
  .y(function(d) { return d.y; });

d3.timer(function(duration){
  elapsed = (duration * 0.001).toFixed(2)
  bond.data(function(d){

      edgesData = []
      kinetic = 0
      points.forEach(function(d)
      {
        //d.px += randomNumber(-vib,vib)
        //d.py += randomNumber(-vib,vib)

            var rnd = randomNumber(0,1);
            avgKinEn = (dof/2) * (temperature) * 0.634; // new target K.E
            var vsquared = avgKinEn * 2 / d.m;
            d.vx = rnd * Math.sqrt(vsquared) * (randomNumber(0,1) > 0.5 ? -1 : 1);
            d.vy = (1-rnd) * Math.sqrt(vsquared) * (randomNumber(0,1) > 0.5 ? -1 : 1);

        for(var i = 0; i < d.neighbours.length; i++)
        {
          var neighbour = d.neighbours[i]
          bondLen = neighbour[1]; // bonded length between neighbour and particle
          nIndex = neighbour[0]; // index of neighbour in points
          if(neighbour == null)
          {
            continue;
          }

          dx = Math.abs(d.px - points[nIndex].px).toFixed(2)
          dy = Math.abs(d.py - points[nIndex].py).toFixed(2)

          // extension
          ext = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2)) - bondLen
          //if(ext>breakLen){
          //  delete d.neighbours[nIndex];
          //  continue;
          //}

          contract = !(ext > 0);
          extY = dx < 0.001 ? 0 : ext * dy/bondLen
          extX = ext * dx/bondLen

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

        //  edgesData.push(
        //  [
        //    {x:centreToScreenX(d.px), y:centreToScreenY(d.py)},
        //    {x:centreToScreenX(points[nIndex].px), y:centreToScreenY(points[nIndex].py)}
        //  ]
        //  )
        }
      })
    return points
  })

if(elapsed > frames * (1/fps))
{
  tempInfo.text(function () {return "T: " + temperature.toFixed(2) })
  bond
    .enter()
    .selectAll("circle")
    .attr("cx",function(d){
      return centreToScreenX(d.px)
    })
    .attr("cy",function(d){
      return centreToScreenY(d.py)
    })
  frames += 1;

  //svg.selectAll("path").remove()
  //edgesData.forEach(function(d){
  //  svg
  //  .append("path")
  //  .attr("stroke", "black")
  //  .attr("stroke-width", 1)
  //  .attr("d", lineFunction(d))
  //  .attr("fill", "none");
  //})

}
})
