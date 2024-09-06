function show(id) {
  document.getElementById(id).style.visibility = "visible";
}

function hide(id) {
  document.getElementById(id).style.visibility = "hidden";
}

function init(){
  if (getQueryVariable("steps")){
    document.forms["choice"]["steps"].value = getQueryVariable("steps");
  } 
  if (getQueryVariable("w")){
    document.forms["choice"]["lineWidth"].value = getQueryVariable("w");
  } 
  if (getQueryVariable("d")){
    document.forms["choice"]["lineDistance"].value = getQueryVariable("d");
  } 
  if (getQueryVariable("t")){
    document.forms["choice"]["transp"].value = getQueryVariable("t");
  } 
  if (getQueryVariable("i")){
    document.forms["choice"]["initAngle"].value = getQueryVariable("i");
  } 
  submitChoice();
}

function drawLine(object,x1,y1,x2,y2,w,o){
  newLine = document.createElementNS("http://www.w3.org/2000/svg", 'line'); 
  newLine.setAttribute("x1",x1); newLine.setAttribute("y1",y1); 
  newLine.setAttribute("x2",x2); newLine.setAttribute("y2",y2); 
  newLine.setAttribute("stroke-width",w); 
  newLine.setAttribute("stroke","black"); 
  newLine.setAttribute("stroke-linecap","round");
  newLine.setAttribute("stroke-opacity",o); 
  object.appendChild(newLine);
}

function submitChoice(inp){
  var steps=parseInt(document.forms["choice"]["steps"].value);
  var lineWidth=parseFloat(document.forms["choice"]["lineWidth"].value);
  var lineDistance=parseFloat(document.forms["choice"]["lineDistance"].value);
  var initAngle=parseFloat(document.forms["choice"]["initAngle"].value);
  var transp=parseFloat(document.forms["choice"]["transp"].value);
  var ratio = window.devicePixelRatio || 1;
  if (navigator.platform == "Win32") ratio=Math.max((1/ratio),ratio);
  if (navigator.platform == "Linux x86_64") ratio=Math.max((1/ratio),ratio);
  var maxX=screen.width*ratio;
  var maxY=screen.height*ratio;
  var fiDelta=Math.PI/steps;
  var fi=-Math.PI/2+initAngle*fiDelta;
  var svgObject=document.getElementById("svg");
  var x = 0;
  var y = 0;
  while (svgObject.firstChild) {
    svgObject.removeChild(svgObject.firstChild);
  }
  while (fi < Math.PI/2-fiDelta/2){
    if (fi==-Math.PI/2 || fi==Math.PI/2){
      x =lineDistance/2;
      y =lineDistance/2;
      while ( x <= maxX ){
        drawLine(svgObject,x,0,x,maxY,lineWidth,transp) 
        x += lineDistance;
      }
    } else if (fi == 0){
      x =lineDistance/2;
      y =lineDistance/2;
      while ( y <= maxY ){
        drawLine(svgObject,0,y,maxX,y,lineWidth,transp) 
        y += lineDistance;
      }
    } else {
      cosFi=Math.cos(fi);
      sinFi=Math.sin(fi);
      tanFi=Math.tan(fi);
      if (tanFi > 0) {
        h=-maxX*tanFi+lineDistance/2;
        maxH=maxY;
      } else {
        h=lineDistance/2;
        maxH=maxY-maxX*tanFi;
      }
      while ( h < maxH ) {
        x1=0; x2=0; y1=0; y2=0;
        x_0=h;
        if (x_0>=0 && x_0<=maxY)
          { x1=0 ; y1=x_0 }
        else {
          if ( tanFi > 0 ) { x1=-h/tanFi, y1=0 }
          else { x1=(maxY-h)/tanFi, y1=maxY}
        }
        x_m=maxX*tanFi+h;
        if (x_m>0 && x_m< maxY)
          { x2=maxX ; y2=x_m }
        else {
          if (tanFi > 0) {x2=(maxY-h)/tanFi, y2=maxY}
          else { x2=-h/tanFi, y2=0}
        }
        drawLine(svgObject,x1,y1,x2,y2,lineWidth,transp) 
        h += lineDistance/cosFi;
      }
    }
    fi+=fiDelta;
  }
  return false;
}

function getQueryVariable(variable)
{
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
  return(false);
}

