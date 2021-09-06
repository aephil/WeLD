
var Renderer = function () {

    var fps = 10; //private var
    var frames = 0;


    this.update = ()=>{};
    this.reDraw = function(handle, type){

      handle
        .enter()
        .selectAll(type)
        .attr("cx",function(d){
          return centreToScreenX(d.px)
        })
        .attr("cy",function(d){
          return centreToScreenY(d.py)
        })

    };
    this.render = function(data, handle, type="circle") // public fn
    {
      timer = d3.timer(function(duration){
        elapsed = (duration * 0.001).toFixed(2)

        // do physics callbacks here
        this.update(data)

        // update graphics here
        if(elapsed > frames * (1/fps)){this.reDraw(handle, type)}

      })

      return timer;
    }
};

Graphics.Renderer = new Renderer();
