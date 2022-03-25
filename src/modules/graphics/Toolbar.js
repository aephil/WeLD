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

        this.buttonMap = new Map(
            []
          );

        this.element = document.createElement("div");
        this.selection = "none";
        this.id = "";
      }
}

Toolbar.prototype.addSlider = function(name,variable, min, max, step)
{
  const fn = ()=>
  {
    let container = document.createElement("div");
    this.element.appendChild(container);
    container.setAttribute("id", this.id +"_"+name+"_sliderContainer");
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
    slider.setAttribute("id", this.id +"_"+name+"_slider");
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
  this.buttonMap.set([name, "slider"], fn);
}

Toolbar.prototype.addSwitch = function(name, variable)
{
  const fn = ()=>{}; 
  this.buttonMap.set([name, "switch", variable], fn);
}


Toolbar.prototype.init = function()
{
    const width  = (this.element.getClientWidth / this.buttonMap.length) + "px" ;
    this.buttonMap.forEach((fn, metadata)=>{

      const [name, type] = metadata;

      let button = document.createElement("div");
      button.setAttribute("class", "noselect");
      this.element.appendChild(button);
      button.style.height = "65%";
      button.style.width  = width;
      button.style.color = "black";
      button.style.float  = "left";
      button.style.padding = "2.5px"
      button.style.borderColor= "rgba(0,0,0,0.5)";
      button.style.borderStyle = "solid";
      button.style.borderWidth = "0.5px";

      button.innerHTML = name;
      if ( type == "slider")
      {
        button.addEventListener("mousedown", event => {

          // visuals
          button.style.borderColor= "rgba(255,255,0,0.5)";
          button.style.color = "black";
    
          if (this.selection == name){

            button.style.backgroundColor = "rgba(0,0,0,0)";
            this.selection = "none";
            this.element.removeChild(document.getElementById(this.id +"_"+name+"_sliderContainer"))

          } else {

            if(this.selection!="none")
            {

              const selected = document.getElementById(this.id+"_"+(this.selection)+"_sliderContainer");
              selected.style.backgroundColor = "rgba(0,0,0,0)";
              selected.style.color = "black";
              let ui = document.getElementById(this.id+"_"+this.selection+"_sliderContainer")
              if(ui!==null)
              {
                this.element.removeChild(ui);
              }
              
            }

            button.style.backgroundColor = "rgba(255, 255, 0, 0.5)";
            button.style.color = "blue";
            this.selection = name;
  
            // do something
            fn();
          }
    
        })

        button.addEventListener("mouseup", event => {
          button.style.borderColor= "rgba(0,0,0,0.5)";
        })
      }
      else if ( type == "switch" )
      {
        const variable = metadata[2];

        if ( this.sharedData[variable] )
        {
          button.style.borderColor= "rgba(255,255,0,0.5)";
          button.style.backgroundColor = "rgba(255, 255, 0, 0.5)";
        }

        button.addEventListener("mousedown", event =>
        {
          this.sharedData[variable] = !(this.sharedData[variable]);

          if ( this.sharedData[variable] )
          {
            button.style.borderColor= "rgba(255,255,0,0.5)";
            button.style.backgroundColor = "rgba(255, 255, 0, 0.5)";
          }
          else
          {
            button.style.borderColor= "rgba(0,0,0,0.5)";
            button.style.backgroundColor = "rgba(0, 0, 0, 0)";
          }

        })
      }
    })

}