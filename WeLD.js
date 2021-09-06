
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

 // load lattice assets (basic nodes and edges data) ///////////////////////
 latticeData = Lattice.makeFCC2D(5,5,50, false)
 nodesData = latticeData[0] // formatted dataset for nodes
 edgesData = latticeData[1] // formatted dataset for edges

 terminalObj.log("loaded nodes and edges")
 terminalObj.log("num nodes: " + nodesData.length)
 terminalObj.log("num edges: " + edgesData.length)

 // setup graphics /////////////////////////////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////

 // bind nodes dataset with svg circle assets using d3 and draw to screen
 nodes = Lattice.draw(sim, nodesData) // handle for d3 object
 physEngine = Physics.Engine;

 testFunction = function(p){
   terminalObj.log(p.px)
 }
 physEngine.addCallBack(testFunction)

 renderer = Graphics.Renderer;
 renderer.update = physEngine.update

 renderer.render(nodesData, nodes)
