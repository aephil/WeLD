VerletP = function(d, data)
{
   d.px += d.vx //+ (0.5*Math.pow(t,2)*ax);
   d.py += d.vy //+ (0.5*Math.pow(t,2)*ay);
   d.pz += d.vz //+ (0.5*Math.pow(t,2)*az);
}

Physics.VerletP = VerletP;
