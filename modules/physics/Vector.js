var Vector = function()
{
  this.normalise = function(v)
  {
    var norm = this.norm(v);

    if(norm===0){return v;}

    v.x /= norm;
    v.y /= norm;
    v.z /= norm;
    return v;
  }

  this.scale = function(scalar, v)
    {
      return {x:v.x*scalar, y:v.y*scalar, z:v.z*scalar};
    }

  this.angle = function(v1, v2)
    {
      var denom =  this.norm(v1) * this.norm(v2)
      var num = (this.dot(v1,v2))
      return Math.acos( num / (denom===0?2*Math.pi:denom));
    }

  this.v3 = function(a=0,b=0,c=0)
    {
      return {x:a, y:b, z:c};
    }

  this.makeV3 = function(d)
    {
      return {x:d.x, y:d.y, z:d.z}
    }

  this.dot = function(v1, v2)
    {
      return v1.x*v2.x + v1.y*v2.y + v1.z*v2.z;
    }

  this.norm = function(v1)
    {
      return Math.sqrt(this.dot(v1,v1))
    }

  this.add = function(v1, v2)
    {
      var _x, _y, _z;
       _x = v1.x + v2.x
       _y = v1.y + v2.y
       _z = v1.z + v2.z
      return {x:_x, y:_y, z:_z}
    }

  this.sub = function(v1, v2)
    {
      var _x, _y, _z;
       _x = v1.x - v2.x
       _y = v1.y - v2.y
       _z = v1.z - v2.z
      return {x:_x, y:_y, z:_z}
    }

  this.cross = function(v1,v2)
  {
    var _x = (v1.y * v2.z) - (v1.z * v2.y);
    var _y = (v1.z * v2.x) - (v1.x * v2.z);
    var _z = (v1.x * v2.y) - (v1.y * v2.x);
    return {x:_x, y:_y, z:_z};
  }

  this.distance = function(v1,v2)
  {
    return this.norm(this.sub(v1,v2))
  }

  this.unitVector = function(v)
  {
    n = Physics.Vector.norm(v);
    u = Physics.Vector.scale(1/n, v)
    return u;
  }
}

Physics.Vector = new Vector()
