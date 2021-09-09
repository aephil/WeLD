var Temperature = function()
{
  var temperature = 1;
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
    var rnd = randomNumber(0,1);
    avgKinEn = (dof/2) * (temperature) * 0.634; // new target K.E
    var vsquared = avgKinEn * 2 / d.m;
    d.vx = rnd * Math.sqrt(vsquared) * (randomNumber(0,1) > 0.5 ? -1 : 1);
    d.vy = (1-rnd) * Math.sqrt(vsquared) * (randomNumber(0,1) > 0.5 ? -1 : 1);
  }

  return this;
}

Physics.Temperature = new Temperature()
