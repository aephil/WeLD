var container = document.createElement("div");
container.setAttribute("id","weld");
control.appendChild(container);

container.style.position = "absolute";
container.style.bottom = "0%";
container.style.right = "0%";
container.style.width = "35%";
container.style.height = "7%";
container.style.color = "white";
container.style.fontFamily = "monospace";
container.style.overflowX = "scroll";
container.style.overflowY = "scroll";

var img = document.createElement("img");
img.style.position = "absolute";
img.style.padding = "2.5px"
img.style.maxWidth = "100%";
img.style.maxHeight = "100%";
img.style.right = "0%";
img.src = "weld.png";
document.getElementById("weld").appendChild(img);
