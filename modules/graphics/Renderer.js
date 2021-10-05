
var Renderer = function () {

    var fps = 30; //private var
    var frames = 0;

    var freq = 1000;
    var seconds = 0;

    var updates;
    var redraw;
    var data;
    var nodes;

    this.setSpeed = function(n, vtermObj=null){
      freq = n;
      if(fps>n){
        if(vtermObj!==null)
        {
          vtermObj.log("fps cannot be less than frequency. setting fps to new frequency.")
          vtermObj.log("fps set to "+n)
          vtermObj.log("frequency set to "+n)
        }
        fps = n;
    } else {
      if(vtermObj!==null)
      {
        vtermObj.log("frequency set to "+n)
      }
    }
    };
    this.setFPS = function(n, vtermObj=null){fps = n; if(vtermObj!==null){vtermObj.log("fps set to "+n)}};
    this.fps = function(){return fps;}

    this.addAnimation = function(u,r,n,d){

      if(d.length !== n.length){
        console.log("ERR: data and nodes must be same length.");
        return;
      }

      updates = u
      drawCall = r
      nodes = n
      data = d
    }

    var update = function()
    {
      data.forEach((d) => {
        updates.forEach((fn) => {
          fn(d,data);
        });
      });


    }

    var redraw = function()
    {
      nodes.forEach((node, i) => {
        drawCall(node,data[i]);
      });

    }

    this.render = function() // public fn
    {
      var start = performance.now();
      var timer = window.setInterval(function(){
        /// call your function here
      update();
      elapsed = (performance.now() - start) / 1000;
      if(elapsed > frames * (1/fps)){ redraw(); frames += 1;}
    }, 1/(freq*1000));

      /*
      timer = d3.timer(function(duration){
        elapsed = (duration * 0.001).toFixed(2)
        // do physics callbacks here
        if(elapsed > seconds * (1/freq))
        {
          update()
          seconds +=1;
        }
        // update graphics here
        if(elapsed > frames * (1/fps)){redraw(handle);   frames += 1;}

      })
      */
      return timer;
    }

  return this;
};

Graphics.Renderer = new Renderer();
