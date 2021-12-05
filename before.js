ui = Graphics.UserInterface;
ui.loadBasic(); // loads divs for simulation, control and terminal, and initialises the terminal

// load physics controls  /////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

// temperature
tempController = Physics.Temperature;
// ui controls for temperature
tempSlider = ui.slider(1e-10,1e-1,1e-10)

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

harmonicController.changeKSpring(0.5);
springConstSliderLabel.innerHTML = "k (spring): " + harmonicController.kSpring();
springConstSliderInput.value = 0.5

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

// Spring neighbour predicate
const springPredicate = (d1, d2) => {
if (d1.id === d2.id) return false;

const dx2 = (d2.ri.x - d1.ri.x) ** 2;
const dy2 = (d2.ri.y - d1.ri.y) ** 2;
const dz2 = (d2.ri.z - d1.ri.z) ** 2;
const distanceSquared = dx2 + dy2 + dz2;

return distanceSquared <= edgeLen ** 2;
}

lattice = Physics.Lattice;
lattice.setUI(ui);
lattice.setShowEdges(true);

ui.setData(lattice.data);
