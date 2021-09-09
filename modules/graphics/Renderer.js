
var Renderer = function () {

    var fps = 30; //private var
    var frames = 0;

    var update;
    var redraw;
    var data;
    var handle;

    this.addAnimation = function(u,r,h,d){
      onUpdate = u
      redraw = r
      handle = h
      data = d
    }

    var update = function()
    {
      handle.data(function(d){
      onUpdate(data)
      return data
      })
    }

    this.render = function() // public fn
    {
      timer = d3.timer(function(duration){
        elapsed = (duration * 0.001).toFixed(2)
        // do physics callbacks here
        update()
        // update graphics here
        if(elapsed > frames * (1/fps)){redraw(handle)}
      })
      return timer;
    }

  return this;
};

Graphics.Renderer = new Renderer();
