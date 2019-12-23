"use strict";
(function(){

// Auxiliares:
function $_GET(key){
    return (new URL(location.href)).searchParams.get(key);
}

var src = $_GET('src');

if(src==null){
    document.write('Imagem Inexistente. Insira uma imagem na pasta <b>chars</b>, e entre com o nome e extensão dela na url: <b>?src=nome.extensao</b>');
    return;
}

var BORDER_SIZE = 1;
var SPACE = 10;
var character = {};
var animationList = ['stand', 'walking', 'run', 'swing', 'vehicle'];


var imageBody = document.createElement('div');
imageBody.style.margin = 'auto'; 
imageBody.style.position = 'relative';

var image = document.createElement("img");
image.src = "chars/" + src;
image.style.opacity = 0.1;
image.style.display = 'block';
image.style.margin = 'auto';
image.style.position = 'absolute';

imageBody.appendChild(image);

document.body.appendChild(imageBody);

image.onload = function(){ 
    imageBody.style.width = image.width + 'px'; 
    imageBody.style.height = image.height + SPACE + 'px';
}

var form = document.createElement('form');
form.style.margin = 'auto';
form.style.display = 'table';
form.onsubmit = function(e){
    e.preventDefault();
    var data = {};
    for(var element of e.srcElement){
        data[element.name] = element.value;
    }
    var i=0;
    var animation = data.animation;
    var direction = data.direction;
    var frame = data.frame;

    if(typeof character[animation]=="undefined")
        character[animation] = [];

    if(typeof character[animation][direction] == "undefined")
        character[animation][direction] = [];

    delete data.animation;
    delete data.direction;
    delete data.frame;
    delete data[""];

    
    character[animation][direction][frame] = [];

    for(var element in data){
        character[animation][direction][frame][i] = data[element];
        i++;
    }

    if(debugIncrement.checked == true)
        updateFrame();
        
    updateCharData();
}


var animation = document.createElement('select');
animation.name = 'animation';
animation.style.width = '50%';
for(var moveName of animationList){
    var move = document.createElement('option');
    move.innerHTML = moveName;
    animation.appendChild(move);
}

var direction = document.createElement('input'); 
direction.type = 'number';
direction.name = 'direction';
direction.value = '0';
direction.placeholder = 'Direção';
direction.style.width = '25%';
direction.min = 0;
direction.max = 3;

var frame = document.createElement('input');
frame.type = 'number';
frame.name = 'frame';
frame.value = '0';
frame.placeholder = 'Frame';
frame.style.width = '25%';
frame.min = 0;


var w = document.createElement('input');
w.type = 'number';
w.name = 'width';
w.placeholder = 'Width';
w.value = 42;

var h = document.createElement('input');
h.type = 'number';
h.name = 'height';
h.placeholder = 'Height';
h.value = 46;

var xL = document.createElement('input');
xL.type = 'number';
xL.name = 'x_left';
xL.placeholder = 'x-left';
xL.value = 8;

var xR = document.createElement('input');
xR.type = 'number';
xR.name = 'x_right';
xR.placeholder = 'x-right';
xR.value = 0;

var yL = document.createElement('input');
yL.type = 'number';
yL.name = 'y_left';
yL.placeholder = 'y-left';
yL.value = 14;

var yR = document.createElement('input');
yR.type = 'number';
yR.name = 'y_right';
yR.placeholder = 'y-right';
yR.value = 0;

var submitSave = document.createElement('button');
submitSave.innerHTML = 'Salvar Frame';
submitSave.className = 'submit save';

var submitCompare = document.createElement('button');
submitCompare.innerHTML = 'Comparar';
submitCompare.className = 'submit compare';
submitCompare.onclick = function(e){
    e.preventDefault();
    if(canvas.style.display == 'none'){
        canvas.style.display = 'block';
    }else{
        canvas.style.display = 'none';
    }
}

var debugBorder = document.createElement('input');
debugBorder.type = "checkbox";
debugBorder.checked = true;

var debugBorderMessage = document.createElement('span');
debugBorderMessage.innerHTML = 'Borda Auxiliar Visual'

var debugIncrement = document.createElement('input');
debugIncrement.type = "checkbox";
debugIncrement.checked = true;

var debugIncrementMessage = document.createElement('span');
debugIncrementMessage.innerHTML = 'Auto Incrementar Frame'


debugBorder.onchange=w.onchange=h.onchange=xL.onchange=yL.onchange=xR.onchange=yR.onchange=draw;
w.onkeyup=h.onkeyup=xL.onkeyup=yL.onkeyup=xR.onkeyup=yR.onkeyup=draw;

var BREAKLINE = document.createElement('br');

var divAnimation = document.createElement('div');
divAnimation.appendChild(animation);
divAnimation.appendChild(direction);
divAnimation.appendChild(frame);


var divSize = document.createElement('div');
divSize.appendChild(w);
divSize.appendChild(h);

var divLeft = document.createElement('div');
divLeft.appendChild(xL);
divLeft.appendChild(yL);

var divRight = document.createElement('div');
divRight.appendChild(xR);
divRight.appendChild(yR);

var divSubmit = document.createElement('div');
divSubmit.appendChild(submitSave);
divSubmit.appendChild(submitCompare);

var divDebug = document.createElement('div');
divDebug.className = 'debug';
divDebug.appendChild(debugBorder);
divDebug.appendChild(debugBorderMessage);
divDebug.appendChild(BREAKLINE);
divDebug.appendChild(debugIncrement);
divDebug.appendChild(debugIncrementMessage);

var divJSON = document.createElement('div');
divJSON.onclick = function(e){
    var range = document.createRange();
    range.selectNode(e.currentTarget);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy')
}

form.appendChild(divAnimation);
form.appendChild(divSize);
form.appendChild(divLeft);
form.appendChild(divRight);
form.appendChild(divSubmit);
form.appendChild(divDebug);
form.appendChild(divJSON);

document.body.appendChild(form);



var canvas = document.createElement("canvas")
var context = canvas.getContext('2d')

imageBody.appendChild(canvas)

canvas.width = 700;
canvas.height = 350;

canvas.style.backgroundColor = "transparent"
canvas.style.margin = "auto"
canvas.style.display = "block"
canvas.style.position = "absolute";

function draw(){

    console.log("called...");

    var dataValues = [xL.value, yL.value, w.value, h.value, xR.value, yR.value, w.value, h.value]; 

    canvas.style.left = parseInt(xL.value) - (debugBorder.checked?BORDER_SIZE:0) + "px";
    canvas.style.top = parseInt(yL.value) - (debugBorder.checked?BORDER_SIZE:0) + "px";
    canvas.style.border = debugBorder.checked ? BORDER_SIZE + "px dotted mediumseagreen" : "none";
    canvas.width = w.value;
    canvas.height = h.value;

    context.clearRect(0, 0, canvas.width, canvas.height);

    var imageCanvas = new Image();

    imageCanvas.src = image.src;
        
    imageCanvas.onload = function(){

        context.drawImage(imageCanvas, ...dataValues);

    }

}

function updateCharData(changed=1){
    var characterJSON = document.createElement('pre');
    characterJSON.innerHTML = JSON.stringify(character, undefined, 1)
                                .replace(/("[a-z].+")/ig,"<b>$1</b>");
    divJSON.innerHTML = '';
    divJSON.appendChild(characterJSON);
    if(changed && localStorage){
        localStorage.setItem(src, JSON.stringify(character));
    }
}
function updateFrame(){
    frame.value = parseInt(frame.value) + 1;
}




document.addEventListener("DOMContentLoaded", draw);

if(localStorage){
    if(localStorage.getItem(src)!=null){
        character = JSON.parse(localStorage.getItem(src));
        updateCharData(0);
    }
}

})();
