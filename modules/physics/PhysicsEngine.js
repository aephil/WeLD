// In order to use this fine you must include the physics.js script in your HTML

var Engine = function () {

    var callBacks = []; //private var

    this.update = function(data) // public fn
    {
      for(var i = 0; i < callBacks.length; i++)
      {
        for(var j = 0; j < data.length; j++)
        {
          fn = callBacks[i]
          point = data[j]
          fn(point, data);
          console.log("running...")
        }
      }
    }

    this.addCallBack = function (fn) {  //public fn
      callBacks.push(fn)
    };

  return this;

};

Physics.Engine = new Engine();
