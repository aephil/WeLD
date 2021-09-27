VerletP = function(d, data)
{
   d.x += d.vx //+ (0.5*Math.pow(t,2)*ax);
   d.y += d.vy //+ (0.5*Math.pow(t,2)*ay);
   d.z += d.vz //+ (0.5*Math.pow(t,2)*az);
}

Physics.VerletP = VerletP;
