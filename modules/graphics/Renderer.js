
var Renderer = function () {

    var fps = 30; //private var
    var frames = 0;

    var update;
    var redraw;
    var data;
    var handle;

    this.setFPS = function(n, vtermObj=null){fps = n; if(vtermObj!==null){vtermObj.log("fps set to "+n)}};
    this.fps = function(){return fps;}

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
        if(elapsed > frames * (1/fps)){redraw(handle);   frames += 1;}

      })
      return timer;
    }

  return this;
};

Graphics.Renderer = new Renderer();
