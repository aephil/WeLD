var Vector = function()
{
  this.normalise = function(v)
  {
    var norm = this.norm(v);

    if(norm===0){return v;}

    v.px /= norm;
    v.py /= norm;
    v.pz /= norm;
    return v;
  }

  this.scale = function(scalar, v)
    {
      return {px:v.px*scalar, py:v.py*scalar, pz:v.pz*scalar};
    }

  this.angle = function(v1, v2)
    {
      var denom =  this.norm(v1) * this.norm(v2)
      var num = (this.dot(v1,v2))
      return Math.acos( num / (denom===0?2*Math.pi:denom));
    }

  this.v3 = function()
    {
      return {px:0, py:0, pz:0};
    }

  this.makeV3 = function(d)
    {
      return {px:d.px, py:d.py, pz:d.pz}
    }

  this.dot = function(v1, v2)
    {
      return v1.px*v2.px + v1.py*v2.py + v1.pz*v2.pz;
    }

  this.norm = function(v1)
    {
      return Math.sqrt(this.dot(v1,v1))
    }

  this.add = function(v1, v2)
    {
      var _px, _py, _pz;
       _px = v1.px + v2.px
       _py = v1.py + v2.py
       _pz = v1.pz + v2.pz
      return {px:_px, py:_py, pz:_pz}
    }

  this.sub = function(v1, v2)
    {
      var _px, _py, _pz;
       _px = v1.px - v2.px
       _py = v1.py - v2.py
       _pz = v1.pz - v2.pz
      return {px:_px, py:_py, pz:_pz}
    }

  this.cross = function(v1,v2)
  {
    var _px = (v1.py * v2.pz) - (v1.pz * v2.py);
    var _py = (v1.pz * v2.px) - (v1.px * v2.pz);
    var _pz = (v1.px * v2.py) - (v1.py * v2.px);
    return {px:_px, py:_py, pz:_pz};
  }
}

Physics.Vector = new Vector()
