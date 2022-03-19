import { Data, colouredText } from '../helpers.js'

export class Toolbar extends Data
{
    constructor(shared) {
        super(shared);

        // temperature shared variables
        this.sharedData.temperature = 0.1;
        this.sharedData.realTemp = 0;

        // spring shared variable
        this.sharedData.springK = 1;

        this.optionMap =  new Map(
            []
          );

        this.element = document.createElement("div");
        this.selection = "none";
      }

    springKSlider = ()=>
    {
      let container = document.createElement("div");
      this.element.appendChild(container);
      container.setAttribute("id", "spring_opt_ui");
      container.style.padding = "20px 10px";
      container.style.position = "absolute";
      container.style.width = (this.element.clientWidth/4) + "px";
      container.style.height = "50px";
      container.style.top = this.element.clientHeight + 10 + "px";
      container.style.left = 10 + "px";
      container.style.backgroundColor = "rgba(0,0,0,0.5)";
      container.style.borderRadius = "10px";

      const label = document.createElement("p");
      container.appendChild(label);
      label.innerHTML = `Spring Constant: ${this.sharedData.springK}`;

      const slider = document.createElement("input");
      container.appendChild(slider);
      slider.setAttribute("type","range");
      slider.setAttribute("min",0.01);
      slider.setAttribute("max",2);
      slider.setAttribute("step",0.01);
      slider.setAttribute("value",this.sharedData.springK);

      slider.oninput = ()=> {
        this.sharedData.springK = slider.value;
        label.innerHTML = `Spring Constant: ${this.sharedData.springK}`;
      }

    }

}

Toolbar.prototype.addSlider = function(name,variable, min, max, step)
{
  var fn = ()=>
  {
    let container = document.createElement("div");
    this.element.appendChild(container);
    container.setAttribute("id", name+"_opt_ui");
    container.style.padding = "20px 10px";
    container.style.position = "absolute";
    container.style.width = (this.element.clientWidth/4) + "px";
    container.style.height = "50px";
    container.style.top = this.element.clientHeight + 10 + "px";
    container.style.left = 10 + "px";
    container.style.backgroundColor = "rgba(0,0,0,0.5)";
    container.style.borderRadius = "10px";

    const label = document.createElement("p");
    container.appendChild(label);
    label.innerHTML = `${name}: ${this.sharedData[variable]}`;

    const slider = document.createElement("input");
    container.appendChild(slider);
    slider.setAttribute("type","range");
    slider.setAttribute("min",min);
    slider.setAttribute("max",max);
    slider.setAttribute("step",step);
    slider.setAttribute("value",this.sharedData[variable]);

    slider.oninput = ()=> {
      this.sharedData[variable] = slider.value;
      label.innerHTML = `${name}: ${this.sharedData[variable]}`;
    }

  }
  this.optionMap.set(name, fn);
}


Toolbar.prototype.init = function()
{

    const width  = (this.element.getClientWidth / this.optionMap.length) + "px" ;
    this.optionMap.forEach((fn, key)=>{
      
      let optTab = document.createElement("div");
      optTab.setAttribute("class", "noselect");
      optTab.setAttribute("id", "toolbar_opt_"+key);
      this.element.appendChild(optTab);
      optTab.style.height = "65%";
      optTab.style.width  = width;
      optTab.style.color = "black";
      optTab.style.float  = "left";
      optTab.style.padding = "2.5px"
      optTab.style.borderColor= "rgba(0,0,0,0.5)";
      optTab.style.borderStyle = "solid";
      optTab.style.borderWidth = "0.5px";

      optTab.innerHTML = key;
      optTab.addEventListener("mousedown", event => {

        // visuals
        optTab.style.borderColor= "rgba(255,255,0,0.5)";
        optTab.style.color = "black";
  
        if (this.selection == key){
          optTab.style.backgroundColor = "rgba(0,0,0,0)";
          this.selection = "none";
          this.element.removeChild(document.getElementById(key+"_opt_ui"))
        } else {
          if(this.selection!="none")
          {
            const selected = document.getElementById("toolbar_opt_"+(this.selection));
            selected.style.backgroundColor = "rgba(0,0,0,0)";
            selected.style.color = "black";
            let ui = document.getElementById(this.selection+"_opt_ui")
            if(ui!==null)
            {
              this.element.removeChild(ui);
            }
            
          }
          optTab.style.backgroundColor = "rgba(255, 255, 0, 0.5)";
          optTab.style.color = "blue";
          this.selection = key;

          // do something
          fn();
        }
  
      })

      optTab.addEventListener("mouseup", event => {
        optTab.style.borderColor= "rgba(0,0,0,0.5)";
      })

    })

}