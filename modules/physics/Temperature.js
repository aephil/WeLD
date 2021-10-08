var Temperature = function()
{
  var temperature = 0;
  var dof = 2;
  var kinetic = 0
  var avgKinEn = (dof/2) * temperature // natural units


  this.temp = function(){return temperature;}

  this.changeTemp = function(n){
    temperature = n;
  }
  this.changeDOF = function(n){
    dof = n;
  }
  this.vibrate = function (d, data){
    var partition0 = randomNumber(0,1);
    var partition1 = randomNumber(0,1) * (1 - partition0)
    var partition2 = 1 - partition1 - partition0

    avgKinEn = (dof/2) * (temperature) * 0.634; // new target K.E
    var vsquared = avgKinEn * 2 / d.m;

    // verlet calculation
    d.x += partition0 * Math.sqrt(vsquared) * (randomNumber(0,1) > 0.5 ? -1 : 1);
    d.y += partition1 * Math.sqrt(vsquared) * (randomNumber(0,1) > 0.5 ? -1 : 1);
    d.z += partition2 * Math.sqrt(vsquared) * (randomNumber(0,1) > 0.5 ? -1 : 1);
  }
  return this;
}

Physics.Temperature = new Temperature()
