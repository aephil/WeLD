vec = {}

vec.v3 = function()
  {
    return {x:0, y:0, z:0 };
  }

vec.v3 = function(_x,_y,_z)
  {
    return {x:_x, y:_y, z:_z}
  }

vec.dot = function(v1, v2)
  {
    return v1.x*v2.x + v1.y*v2.y + v1.z*v2.z;
  }

vec.norm = function(v1)
  {
    return Math.sqrt(vec.dot(v1,v1))
  }

vec.add = function(v1, v2)
  {
    var _x, _y, _z;
     _x = v1.x + v2.x
     _y = v1.y + v2.y
     _z = v1.z + v2.z
    return {x:_x, y:_y, z:_z}
  }

vec.sub = function(v1, v2)
  {
    var _x, _y, _z;
     _x = v1.x - v2.x
     _y = v1.y - v2.y
     _z = v1.z - v2.z
    return {x:_x, y:_y, z:_z}
  }
