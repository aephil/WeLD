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

 import ForceMap, {initValence} from './modules/physics/ForceMap.js';

 const ui = Graphics.UserInterface;
 ui.loadBasic(); // loads divs for simulation, control and terminal, and initialises the terminal

 // load physics controls  /////////////////////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////


 // temperature
const tempController = Physics.Temperature;
// ui controls for temperature
const tempSlider = ui.slider(1e-10,1e-1,1e-10)

const tempSliderContainer = tempSlider[0];
control.appendChild(tempSliderContainer);

const tempSliderInput = tempSlider[1];
const tempSliderLabel =  tempSlider[2];

tempSliderInput.value = tempController.temp();
tempSliderLabel.innerHTML = "Temperature: " + tempSliderInput.value;

tempSliderInput.oninput = function(){
    const value = tempSliderInput.value;
    tempController.changeTemp(value);
    tempSliderLabel.innerHTML = "Temperature: " + value;
  }

// spring constant
const harmonicController = Physics.Harmonic;
// ui controls for spring constant
const springConstSlider = ui.slider(0,1,0.01)

const springConstSliderContainer = springConstSlider[0];
control.appendChild(springConstSliderContainer);

const springConstSliderInput = springConstSlider[1];
const springConstSliderLabel =  springConstSlider[2];

harmonicController.changeKSpring(0.5);
springConstSliderLabel.innerHTML = "k (spring): " + harmonicController.kSpring();
springConstSliderInput.value = 0.5

springConstSliderInput.oninput = function(){
  const value = springConstSliderInput.value;
  harmonicController.changeKSpring(value);
  springConstSliderLabel.innerHTML = "k (spring): " + value;
}

// ui controls for valence angle constant
const valenceConstSlider = ui.slider(0,1, 0.01)
const valenceConstSliderContainer = valenceConstSlider[0];
control.appendChild(valenceConstSliderContainer);

const valenceConstSliderInput = valenceConstSlider[1];
const valenceConstSliderLabel = valenceConstSlider[2];

valenceConstSliderLabel.innerHTML = "k (valence): " + 0;

valenceConstSliderInput.oninput = function(){
  const value = valenceConstSliderInput.value;
  harmonicController.changeKValence(value);
  valenceConstSliderLabel.innerHTML = "k (valence): " + value;
}

// setup physics resources ////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

const edgeLen = 20;
const lattice = Physics.Lattice;
lattice.setUI(ui);
lattice.setShowEdges(true);

// Make neighbours
const springPredicate = (d1, d2) => {
  if (d1.id === d2.id) return false;

  const dx2 = (d2.ri.x - d1.ri.x) ** 2;
  const dy2 = (d2.ri.y - d1.ri.y) ** 2;
  const dz2 = (d2.ri.z - d1.ri.z) ** 2;
  const distanceSquared = dx2 + dy2 + dz2;

  return distanceSquared == edgeLen ** 2;
}

// This sets lattice.data
lattice.makePrimitive3D(2,1,1,edgeLen);
tempController.changeDOF(3*lattice.data.length);

ui.setData(lattice.data);
const verletController = Physics.Verlet;

//lattice.setForces({name: "Test Force", params: [], color: "red"})
// lattice.setInterAtomicForces(
//  {
//    name: "spring",
//    params: [1e-1,edgeLen],
//    color: "red"
//  },
//  springPredicate
//);

// Setup valence angles
initValence(lattice, 1);
// Physics.initValence(lattice, 1);

// Each function here is called by the renderer every frame
const physics = [tempController.thermostat, verletController.velocityVerlet, verletController.updateState];

// setup graphics resources ///////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

const renderer = Graphics.Renderer;
renderer.setUI(ui);
renderer.setUpdates(physics);
renderer.setLattice(lattice);
renderer.setFPS(30);
renderer.setSpeed(10000);
renderer.ui = ui;
renderer.render();

// non-essential WeLD banner //////////////////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////

const container = document.createElement("div");
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

const img = document.createElement("img");
img.style.position = "absolute";
img.style.padding = "2.5px"
img.style.maxWidth = "100%";
img.style.maxHeight = "100%";
img.style.right = "0%";
img.src = "weld.png";
document.getElementById("weld").appendChild(img);
