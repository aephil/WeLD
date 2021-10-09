var UserInterface = {} // namespace

var VTerm = function () {

    var buffer = ""; //private var
    this.parent = null; // public var

    var updateScroll = function() // private fn
    {
      var element = document.getElementById("vterm");
      element.scrollTop = element.scrollHeight;
    }

    this.log = function (msg) {  //public fn
      buffer += " WeLD => " + msg + "<br/>";
      document.getElementById("vterm").innerHTML = buffer
      updateScroll()
    };
    return this;
};

UserInterface.VTerm = new VTerm();

UserInterface.loadBasic = function()
{

  var sim = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  document.body.appendChild(sim);
  sim.setAttribute("class","sim");
  sim.style.position = "fixed";
  sim.style.top = "2.5%"
  sim.style.left = "2.5%"
  sim.style.width = "70%"
  sim.style.height = "95%"
  sim.style.borderColor = "black"
  sim.style.borderStyle = "solid"
  sim.style.backgroundColor = "white"

  var vterm = document.createElement("div");
  document.body.appendChild(vterm);
  vterm.setAttribute("id","vterm");
  vterm.style.position = "fixed";
  vterm.style.top = "2.5%";
  vterm.style.right = "2%";
  vterm.style.width = "25%";
  vterm.style.height = "20%";
  vterm.style.color = "white";
  vterm.style.padding = "2.5 em";
  vterm.style.fontFamily = "monospace";
  vterm.style.backgroundColor = "black";
  vterm.style.overflowX = "scroll";
  vterm.style.overflowY = "scroll";


  return [sim, vterm]
}

UserInterface.slider = function(min=0, max=100)
{

  // TODO remove d3 here too

  var container = document.createElement("div");
  document.body.appendChild(container);
  container.style.position = "fixed";
  container.style.width = "25%";
  container.style.height = "20%";
  container.style.top = "22.5%";
  container.style.right = "1%";


  var slider = document.createElement("input");
  container.appendChild(slider);
  slider.setAttribute("type","range");
  slider.setAttribute("min",min);
  slider.setAttribute("max",max);
  slider.setAttribute("value",min);


  var label = document.createElement("p");
  container.appendChild(label);


    return [container, slider, label];
}
