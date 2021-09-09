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
      buffer += " WelD/: " + msg + "<br/>";
      this.parent.html(buffer)
      updateScroll()
    };
    return this;
};

UserInterface.VTerm = new VTerm();

UserInterface.loadBasic = function()
{

  var sim = d3.select("body")
    .append("svg")
    .style("position", "fixed")
    .style("top", "2.5%")
    .style("left", "2.5%")
    .style("width", "70%")
    .style("height","95%")
    .style("border-color","black")
    .style("border-style","solid")
    .style("background-color", "white");

  var vterm = d3.select("body")
    .append("div")
    .attr("id","vterm")
    .style("position", "fixed")
    .style("width", "25%")
    .style("height","20%")
    .style("top", "2.5%")
    .style("right", "2%")
    .style("color", "white")
    .style("font-family","monospace")
    .style("padding","2.5 em")
    .style("overflow-y","scroll")
    .style("overflow-x","scroll")
    .style("background-color", "black")

  return [sim, vterm]
}

UserInterface.slider = function()
{

  var container = d3.select("body")
    .append("div")
    .style("position", "fixed")
    .style("width", "25%")
    .style("height","20%")
    .style("top", "22.5%")
    .style("right", "2%")

  var slider = container.append("input")
    .property("type","range")
    .property("min",0)
    .property("max",100)
    .property("value",0)

  var label = container.append("p")
  

    return [container, slider, label];
}
