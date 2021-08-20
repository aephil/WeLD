
var rectangularButton = function(text, styles, active, hover){

var button_data =
{
  _element:'div',
  _styles: styles,
  _active: active,
  _hover: hover,
};
  return button_data
}

var division = function(width, height, x, y, text ,bg){
  {
    var div = body.append("div")
    .text(text)
    //.attr('class', function (d) { return d.class; })
    .style('position','absolute')
    .style('top',  y + "px")
    .style('left', x + "px")
    .style('width', width + "px")
    .style('height', height + "px")
    .style('background-color', bg)
    .style('text-decoration-line', 'none')
    .style('color', 'red')
    .style('display', 'flex')
    .style('text-align','center')
    .style('justify-content', 'center')
    .style('align-content','center')
    .style('flex-direction','column')
    //.style('user-select' ,'none');
    return div
  }
}

var terminal = function(){
  var herminal = division(worldWidth,worldHeight, 0,550,"","black");
  herminal
  .style("word-wrap", "break-word")
  .style("white-space", "-moz-pre-wrap")
  .style("white-space", "pre-wrap")
  .style("hyphens", "auto")
  .style('color', 'white')
  .style('display', 'flex')
  .style('text-align','left')
  .style('justify-content', 'left')
  .style('align-content','left')
  .style('flex-direction','row')

  return herminal;
}

var confirmDialogue = function(parent){

    var div = parent.append("div")

    // main parent window
    .style('position','absolute')
    .style('overflow','hidden')
    .style('top',  0 + "px")
    .style('left', 0 + "px")
    .style('width', 100 + "%")
    .style('height', 100 + "%")
    .style('background-color', 'white')
    .style('text-decoration-line', 'none')
    .style('color', 'red')
    .style('display', 'flex')
    .style('text-align','center')
    .style('justify-content', 'center')
    .style('align-content','center')
    .style('flex-direction','column')
    .style('overflow','hidden');

    // textbox

    textbox = parent.append("div")

    .attr("id", "dialogue-textbox")
    .style('position','relative')
    .style('top',  0 + "%")
    .style('left', 0 + "%")
    .style('width',"80%")
    .style('height', "100%")
    .style('font-size','150%')
    .style('background-color', 'white')
    .style('text-decoration-line', 'none')
    .style('color', 'white')
    .style('display', 'flex')
    .style('text-align','center')
    .style('justify-content', 'center')
    .style('align-content','center')
    .style('flex-direction','column')
    .style('user-select','none')

    var style1 = {
        'position':'absolute',
        'user-select':'none',
        'width':'20%',
        'height':'20%',
        'font-size':'100%',
        'background-color':'grey',
        'color':'white',
        'right':'0%',
        'top':'0%',
        'text-align':'center',
        'justify-content':'center',
        'display':'flex',
        'flex-direction':'column',
    }

    var style2 = {
        'position':'absolute',
        'user-select':'none',
        'width':'20%',
        'height':'20%',
        'font-size':'100%',
        'background-color':'grey',
        'color':'white',
        'right':'0%',
        'bottom':'0%',
        'text-align':'center',
        'justify-content':'center',
        'display':'flex',
        'flex-direction':'column',
    }

    //button 1
  button_1 = parent.append('div')

  for (var key of Object.keys(style1)) {
  button_1.style(key, style1[key])
  }

  //button 1
  button_2 = parent.append('div')

  for (var key of Object.keys(style2)) {
  button_2.style(key, style2[key])
  }

return [div, textbox, button_1, button_2];
}

function dragElement(elmnt,handle) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    // otherwise, move the DIV from anywhere inside the DIV:
  handle.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:

    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    elmnt.style('z-index','2');
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

var promptDialogue = function(parent){

    var div = parent.append("div")
    // main parent window
    .style('position','absolute')
    .style('overflow','hidden')
    .style('top',  "0%")
    .style('left', "0&")
    .style('width', "100%")
    .style('height', "100%")
    .style('background-color', "rgb(0,0,0,0.2)")
    .style('text-decoration-line', 'none')
    .style('display', 'flex')
    .style('text-align','center')
    .style('justify-content', 'center')
    .style('align-content','center')
    .style('flex-direction','column')
    .style('overflow','hidden');

    // textbox

    textbox = parent.append("div")
    .attr("id", "dialogue-textbox")
    .style('position','absolute')
    .style('top',  0 + "%")
    .style('left', 0 + "%")
    .style('width',"80%")
    .style('height', "80%")
    .style('font-size','150%')
    .style('background-color', "rgba(0,0,0,0.2)")
    .style('text-decoration-line', 'none')
    .style('color', 'black')
    .style('display', 'flex')
    .style('text-align','center')
    .style('justify-content', 'center')
    .style('align-content','center')
    .style('flex-direction','column')
    .style('user-select','none')

    input = parent.append("input")
    .style('placeholder','text here!')
    .style('position','absolute')
    .style('type','text')
    .style('outline','none')
    .style('border','0')
    .style('bottom',"0%")
    .style('left',  "0%")
    .style('width',"80%")
    .style('height', "20%")
    .style('font-size','150%')
    .style('background-color', "rgba(0,0,0,0.2)")
    .style('text-decoration-line', 'none')
    .style('color', 'white')
    .style('display', 'flex')
    .style('text-align','center')
    .style('justify-content', 'center')
    .style('align-content','center')
    .style('flex-direction','column')
    //.style('user-select','none');

    var style1 = {
        'position':'absolute',
        'user-select':'none',
        'width':'20%',
        'height':'20%',
        'font-size':'100%',
        'background-color':'rgba(0,50,0,0.7)',
        'color':'white',
        'right':'0%',
        'bottom':'0%',
        'text-align':'center',
        'justify-content':'center',
        'display':'flex',
        'flex-direction':'column',
    }

    var style2 = {
        'position':'absolute',
        'user-select':'none',
        'width':'20%',
        'height':'20%',
        'font-size':'100%',
        'background-color':'rgba(255,0,0,0.7)',
        'color':'white',
        'right':'0%',
        'top':'0%',
        'text-align':'center',
        'justify-content':'center',
        'display':'flex',
        'flex-direction':'column',
    }

  //button 1
  button_1 = parent.append('div')

  for (var key of Object.keys(style1)) {
    button_1.style(key, style1[key])
  }
  //button 2
  button_2 = parent.append('div')

  for (var key of Object.keys(style2)) {
    button_2.style(key, style2[key])
  }
  return [div, textbox, input, button_1, button_2]
}
