var Vector = function()
{
  this.v3 = function()
    {
      return {px:0, py:0, pz:0 };
    }

  //this.v3 = function(_px,_py,_pz)
  //  {
  //    return {px:_px, py:_py, pz:_pz}
  //  }

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
