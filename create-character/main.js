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

var BREAKLINE = document.createElement('br');
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
animation.onchange = function(){
    direction.value = 0;
    frame.value = 0;
}

var direction = document.createElement('input'); 
direction.type = 'number';
direction.name = 'direction';
direction.value = '0';
direction.placeholder = 'Direção';
direction.style.width = '25%';
direction.min = 0;
direction.max = 3;
direction.onchange = direction.onkeyup = function(){
    var AnimationDirectionFrame;
    frame.value = (AnimationDirectionFrame=character[animation.value][direction.value]) && AnimationDirectionFrame.length || 0;
}

var frame = document.createElement('input');
frame.type = 'number';
frame.name = 'frame';
frame.value = '0';
frame.placeholder = 'Frame';
frame.style.width = '25%';
frame.min = 0;
frame.onchange = frame.onkeyup = function(e){
    var AnimationDirectionFrame;
    var frameLength = (AnimationDirectionFrame=character[animation.value][direction.value]) && AnimationDirectionFrame.length || 0;
    console.log(frame.value, frameLength);
    if(parseInt(frame.value) > frameLength){
        e.preventDefault();
        frame.value = frameLength;
        return;
    }    
}

var w = document.createElement('input');
w.type = 'number';
w.name = 'width';
w.placeholder = 'Largura';
w.value = 42;

var h = document.createElement('input');
h.type = 'number';
h.name = 'height';
h.placeholder = 'Altura';
h.value = 46;

var x = document.createElement('input');
x.type = 'number';
x.name = 'X';
x.placeholder = 'Posição X';
x.value = 8;

var y = document.createElement('input');
y.type = 'number';
y.name = 'Y';
y.placeholder = 'Posição Y';
y.value = 14;


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

var submitDelete = document.createElement('button');
submitDelete.innerHTML = 'Deletar';
submitDelete.className = 'submit delete';
submitDelete.onclick = function(e){
    e.preventDefault();
    if(confirm(`Você está prestes a excluir um frame, deseja continuar?
 ************************************************
   Animação: ${animation.value}\n   Direção: ${direction.value}\n   Frame: ${frame.value}`)
     ){
        character[animation.value][direction.value].splice(frame.value, 1);
        updateCharData();        
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


debugBorder.onchange=w.onchange=h.onchange=x.onchange=y.onchange=draw;
w.onkeyup=h.onkeyup=x.onkeyup=y.onkeyup=draw;


var divAnimation = document.createElement('div');
divAnimation.appendChild(animation);
divAnimation.appendChild(direction);
divAnimation.appendChild(frame);


var divSize = document.createElement('div');
divSize.appendChild(w);
divSize.appendChild(h);

var divPosition = document.createElement('div');
divPosition.appendChild(x);
divPosition.appendChild(y);

var divSubmit = document.createElement('div');
divSubmit.appendChild(submitSave);
divSubmit.appendChild(submitCompare);
divSubmit.appendChild(submitDelete);

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
form.appendChild(divPosition);
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

    var dataValues = [x.value, y.value, w.value, h.value, 0, 0, w.value, h.value]; 

    canvas.style.left = parseInt(x.value) - (debugBorder.checked?BORDER_SIZE:0) + "px";
    canvas.style.top = parseInt(y.value) - (debugBorder.checked?BORDER_SIZE:0) + "px";
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
