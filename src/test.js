// testing canvas

var c = document.createElement("canvas");
ctx = c.getContext("2d");
c.width = 1000
c.height = 1000
document.body.appendChild(c);

/*
function newNode(val,zval,i)
{
  elapsed = 0
  var node = {
    x:val*50,
    s:randomNumber(-10,10),
    z:zval,
    id:i,
  }
  return node;
}

var arr = [];
for(let i = 0; i < 5; i++)
{
  arr[i] = new newNode(i,i,i);
}



arr.forEach((n) => {
  ctx.beginPath();
  ctx.arc(100+n.x, 75, 50, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.stroke();
});

c.addEventListener(
  "click",
  function(event) {
    mouse = oMousePos(c, event)
    var active = []
    ctx.clearRect(0, 0, c.width, c.height);
    arr.forEach(function(n) {
      drawElement(n, ctx);
      if(ctx.isPointInPath(mouse.x, mouse.y)){active.push(n)}
    });
    active.sort(function(a, b) {
        return a.z - b.z;
      });
    console.log(active[0].id)

  },
  false
);

function drawElement(n) {
  ctx.beginPath();
  ctx.arc(100+n.x, 75, 50, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function oMousePos(canvas, evt) {
  var ClientRect = canvas.getBoundingClientRect();
  return {
    x: Math.round(evt.clientX - ClientRect.left),
    y: Math.round(evt.clientY - ClientRect.top)
  }
}
*/

var lattice = Physics.Lattice
lattice.makePrimitive3D(10,10,10,20)

var elapsed = 0;

var rho = 0.6
var theta = 0.6

var start = 0;
frames = 0
fps = 60;

function drawCall(){

  ctx.clearRect(0,0, c.width, c.height);

  lattice.data.sort(function(a, b) {
    imagePos1 = rotY(rotX(a,theta),rho);
    imagePos2 = rotY(rotX(b,theta),rho);
      return imagePos1.z - imagePos2.z;
    });

  lattice.data.forEach((n) => {
    var imagePos = rotY(rotX(n,theta),rho);
    ctx.beginPath();
    ctx.arc( centreToScreenX(imagePos.x), centreToScreenY(imagePos.y), n.r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = "red";
    ctx.lineWidth = 0.5;
    ctx.fill();
    ctx.stroke();
  })

  rho+=0.01
}

function animate()
{
  requestAnimationFrame(animate);
  var end = performance.now();
  elapsed = (end - start)/1000;
  if (elapsed > frames * (1/fps))
  {
    drawCall();
    frames++;
  }
}

function render() {

  start = performance.now();
  animate();

  }

render();



setInterval(function () {

}, 10);
