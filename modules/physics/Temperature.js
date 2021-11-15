var Temperature = function()
{
  var temperature = 1e-10;
  var realTemp = 0;
  var dof = 3;
  var kinetic = 0
  var avgKinEn = 0;


  this.temp = function(){return temperature;}

  this.changeTemp = function(n){
    temperature = n;
  }

  this.changeDOF = function(n){
    dof = n;
  }

  this.thermostat = function (d, data){
    // calculate the average temperature
    avgKinEn = 0;
    data.forEach(d => {
      avgKinEn += 0.5 * d.m * Physics.Vector.dot(d.vi, d.vi);
    });
    avgKinEn /= data.length;
    realTemp = (2 * avgKinEn) / (dof /* * Physics.boltzmann*/);

    var targetAvgKinEn = (dof/2) * (temperature)
    var speed = Math.sqrt(targetAvgKinEn * 2 / d.m);

    data.forEach((d) => {
      d.vi = Physics.Vector.scale(speed, Physics.Vector.unitVector(d.vi))
    });
  }
  return this;
}

Physics.Temperature = new Temperature();
