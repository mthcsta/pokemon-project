'use strict';
(function() {    
  
  const source = getParam('src');
  
  if (source == null) {
    document.body.outerHTML = ('Imagem Inexistente. Insira uma imagem na pasta <b>chars</b>, e entre com o nome e extensão dela na url: <b>?src=nome.extensao</b>');
    return;
  }
  
  
  
  const BORDER_SIZE = 1;
  const SPACE = 10;
  
  const character = JSON.parse(localStorage.getItem(source)) || {};
  
  // Html Elements
  
  const viewSprite = document.getElementById("view-sprite");
  const spriteImage = document.getElementById("sprite-image");
  const spriteCanvas = document.getElementById("sprite-canvas");
  const context = spriteCanvas.getContext('2d');
  
  const form = document.getElementById("form");
  
  const AnimationDirectionFrames = document.getElementById("animation-direction-frames");
  
  const animation = document.getElementById("animation");
  const direction = document.getElementById("direction");
  const frame = document.getElementById("frame");
  
  const width = document.getElementById("width");
  const height = document.getElementById("height");
  const x = document.getElementById("x");
  const y = document.getElementById("y");
  
  const debugBorder = document.getElementById("debug-border");
  const autoIncrement = document.getElementById("auto-increment");
  
  const submitSave = document.getElementById("submit-save");
  const submitDelete = document.getElementById("submit-delete");
  
  const divJSON = document.getElementById("div-JSON");
  
  spriteImage.src = "chars/" + source;
  
  function draw(e) {
    
    console.log("called...");
    
    const dataValues = [x.value, y.value, width.value, height.value, 0, 0, width.value, height.value];
    
    addStyle(spriteCanvas, {
      left: parseInt(x.value) - (debugBorder.checked?BORDER_SIZE:0) + 'px',
      top: parseInt(y.value) - (debugBorder.checked?BORDER_SIZE:0) + 'px',
      border: debugBorder.checked ? BORDER_SIZE + 'px dotted mediumseagreen' : 'none',
    })
    setElement(spriteCanvas, {
      width: width.value, 
      height: height.value,
    })
    
    context.clearRect(0, 0, spriteCanvas.width, spriteCanvas.height);
    
    const imageCanvas = new Image(spriteImage.offsetWidth, spriteImage.offsetHeight);
    
    imageCanvas.src = spriteImage.src;
    
    imageCanvas.onload = function(){
      context.drawImage(imageCanvas, ...dataValues);    
    }

    if (e.type == "change") {
      setLastFormData(source, {
        lastAnimation: animation.selectedIndex,
        lastDirection: direction.selectedIndex,
        lastFrame: frame.value,
        lastWidth: width.value,
        lastHeight: height.value,
        lastX: x.value,
        lastY: y.value,
      });
    }    

    const borderDotted = '1px dotted mediumseagreen';
    const borderSolid = '1px solid mediumvioletred';
    
    const {borderTop, borderLeft, borderRight, borderBottom} = searchSelectionEmpty(spriteImage, parseInt(width.value), parseInt(height.value), parseInt(x.value), parseInt(y.value));
    
    addStyle(spriteCanvas, {
      borderTop: borderTop ? borderSolid : borderDotted,
      borderLeft: borderLeft ? borderSolid : borderDotted,
      borderRight: borderRight ? borderSolid : borderDotted,
      borderBottom: borderBottom ? borderSolid : borderDotted,
    })
    
  }
  
  document.addEventListener("DOMContentLoaded", draw);  
  
  spriteImage.addEventListener('error', function() {
    document.body.outerHTML = 'Imagem Não Encontrada.';
  });
  
  spriteImage.addEventListener('load', function() {
    addStyle(viewSprite, {
      width: spriteImage.offsetWidth + 'px',
      height: spriteImage.offsetHeight + 'px',
    });
  });
  
  animation.addEventListener('change', function() {
    direction.selectedIndex = 0;
    frame.value = directionFrameSize(character, animation.value, direction.value); 
  });
  direction.addEventListener('change', function() {
    frame.value = directionFrameSize(character, animation.value, direction.value);
  });
  // events from frame
  ['change', 'keyup'].forEach((eventName) => {
    frame.addEventListener(eventName, function() {
      const frameLength = directionFrameSize(character, animation.value, direction.value);
      if (parseInt(frame.value) > frameLength) {
        frame.value = frameLength;
        return;
      }
    });
  });
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const data = [...e.srcElement].reduce((list, element) => {
      if (element.hasAttribute('name')) {
        return {...list, [element.name]: element.value};
      }
      return list;
    }, {}); 
    
    {
      const { animation, direction, frame } = data;
      
      if (typeof character[animation] == "undefined")
      character[animation] = {};
      
      if (typeof character[animation][direction] == "undefined")
      character[animation][direction] = [];
      
      character[animation][direction][frame] = [
        data.width, 
        data.height, 
        data.x, 
        data.y
      ];
    }
    
    if(autoIncrement.checked == true)
    frame.value = parseInt(frame.value) + 1;

    draw({type: 'change'});
    
    divJSON.innerHTML = updateCharData(character, source);
  });
  
  submitDelete.addEventListener('click', function(e) {
    e.preventDefault();
    if (confirmFrameRemove(animation.value, direction.value, frame.value)) {
      character[animation.value][direction.value].splice(frame.value, 1);
      divJSON.innerHTML = updateCharData(character, source);        
    }
  });
  
  [debugBorder, width, height, x, y].forEach((element) => {
    element.addEventListener('change', draw);
    element.addEventListener('keyup', draw);
  });
  
  divJSON.addEventListener('click', function(e) {
    const range = document.createRange();
    range.selectNode(e.currentTarget);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy')
  });
  
  let currentAnimationFrame = 0;
  setInterval(function (){
    
    if (character?.[animation.value]?.[direction.value] == undefined) {
      AnimationDirectionFrames.hidden = true
      return;
    } else {
      AnimationDirectionFrames.hidden = false
    }
    
    if (character[animation.value][direction.value].length <= currentAnimationFrame) {
      currentAnimationFrame = 0;
    }
    
    const frame = character[animation.value][direction.value][currentAnimationFrame];
    
    const AnimateContext = AnimationDirectionFrames.getContext('2d')
    AnimationDirectionFrames.width = frame[0];
    AnimationDirectionFrames.height = frame[1];
    
    const dataValues = [frame[2], frame[3], frame[0], frame[1], 0, 0, frame[0], frame[1]];
    
    console.log(dataValues)
    
    AnimateContext.clearRect(0, 0, AnimationDirectionFrames.width, AnimationDirectionFrames.height);
    
    AnimateContext.drawImage(spriteImage, ...dataValues);    
    
    currentAnimationFrame += 1;
    
  }, 500);
  
  
  if (Object.values(character).length > 0) {
    divJSON.innerHTML = updateCharData(character, source, 0);
  }
  
  if (getLastFormData(source)) {
    // set form
    const { lastAnimation, lastDirection, lastFrame, lastWidth, lastHeight, lastX, lastY } = getLastFormData(source);
    
    animation.selectedIndex = lastAnimation;
    direction.selectedIndex = lastDirection;
    frame.value = lastFrame;
    width.value = lastWidth;
    height.value = lastHeight;
    x.value = lastX;
    y.value = lastY;    
  }
  
}());

