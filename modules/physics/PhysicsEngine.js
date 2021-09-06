// In order to use this fine you must include the physics.js script in your HTML

var Engine = function () {

    var callBacks = []; //private var
    this.update = function(data) // private fn
    {
      for(i = 0; i < callBacks.length; i++)
      {
        for(j = 0; j < data.length; j++)
        {
          callBacks[i](data[j]);
        }
      }
    }

    this.addCallBack = function (fn) {  //public fn
      callBacks.push(fn)
    };

};

Physics.Engine = new Engine();
