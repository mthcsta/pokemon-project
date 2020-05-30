"use strict";
(function() {

// Auxiliares:

const src = $_GET('src');

if (src == null) {
    document.write('Imagem Inexistente. Insira uma imagem na pasta <b>chars</b>, e entre com o nome e extensão dela na url: <b>?src=nome.extensao</b>');
    return;
}

const character = JSON.parse(localStorage.getItem(src)) || {};
const animationList = ['stand', 'walking', 'run', 'swing', 'vehicle'];
const directionList = ['front', 'left', 'right', 'back'];

const BORDER_SIZE = 1;
const SPACE = 10;
const BREAKLINE = createElement('br');


const imageBody = createElement('div', {
    addStyle: {
        margin:'auto',
        position: 'relative',    
    }
});

const image = createElement('img', {
    src: 'chars/' + src,
    onload() {
        addStyle(imageBody, {
            width: image.width + 'px',
            height: image.height + SPACE + 'px',
        });
    },
    addStyle: {
        opacity: 0.5,
        display: 'block',
        margin: 'auto',
        position: 'absolute',        
    }
});

const form = createElement('form', {
    onsubmit(e) {
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
                data.X, 
                data.Y
            ];
        }

        if(debugIncrement.checked == true)
            frame.value = parseInt(frame.value) + 1;
    
        divJSON.innerHTML = updateCharData(character, src);
    },
    addStyle: {
        margin: 'auto',
        display: 'table',    
    }
});

const animation = createElement('select', {
    name: 'animation',
    onchange() {
        direction.selectedIndex = 0;
        frame.value = 0;    
    },
    addStyle: {
        width: '50%',
        backgroundColor: 'white',
        border: '0.5px solid darkgrey',
        boxSizing: 'border-box',
        height: '21px',    
    },
    append: animationList.map((animation) => {
            return createElement('option', { innerHTML: animation });
    }), 
});

const direction = createElement('select', {
    name: 'direction',
    title: 'direção do personagem durante a animação',
    onchange() {
        frame.value = directionFrameSize(character, animation.value, direction.value);
    }, 
    addStyle: {
        width: '25%',
        backgroundColor: 'white',
        border: '0.5px solid darkgrey',
        boxSizing: 'border-box',
        height: '21px',    
    }, 
    append: directionList.map((directionName) => {
            return createElement('option', { innerHTML: directionName });
    }),
});

const frame = createElement('input', {
    type: 'number',
    name: 'frame',
    placeholder: 'Frame',
    value: 0,
    min: 0,
    check() {
        const frameLength = directionFrameSize(character, animation.value, direction.value);
        if (parseInt(frame.value) > frameLength) {
            frame.value = frameLength;
            return;
        }    
    },
    onchange() { return this.check(); },
    onkeyup() { return this.check(); },
    addStyle: { 
        width: '25%',
    },
});

const w = createElement('input', {
    type: 'number',
    name: 'width',
    placeholder: 'Largura',
    value: 42,
});
const h = createElement('input', {
    type: 'number',
    name: 'height',
    placeholder: 'Altura',
    value: 46, 
});

const x = createElement('input', {
    type: 'number',
    name: 'X',
    placeholder: 'Posição X',
    value: 8,
});
const y = createElement('input', {
    type: 'number',
    name: 'Y',
    placeholder: 'Posição Y',
    value: 14,
});

const submitSave = createElement('button', {
    innerHTML: 'Salvar Frame',
    className: 'submit save',
});

const submitCompare = createElement('button', {
    innerHTML: 'Comparar',
    className: 'submit compare',
    onclick(e) {
        e.preventDefault();
        if (canvas.style.display == 'none') {
            canvas.style.display = 'block';
        } else {
            canvas.style.display = 'none';
        }
    },
});
const submitDelete = createElement('button', {
    innerHTML: 'Deletar',
    className: 'submit delete',
    onclick(e) {
        e.preventDefault();
        if (confirmFrameRemove(animation.value, direction.value, frame.value)) {
            character[animation.value][direction.value].splice(frame.value, 1);
            divJSON.innerHTML = updateCharData(character, src);        
        }
    },
});

const debugBorder = createElement('input', {
    type: 'checkbox',
    checked: true,
});

const debugBorderMessage = createElement('span', {
    innerHTML: 'Borda Auxiliar Visual',
});

const debugIncrement = createElement('input', {
    type: 'checkbox',
    checked: true,
});

const debugIncrementMessage = createElement('span', {
    innerHTML: 'Auto Incrementar Frame',
});

[debugBorder, w, h, x, y].forEach((element) => {
    element.addEventListener('change', draw);
    element.addEventListener('keyup', draw);
});

const divAnimation = createElement('div');

const divSize = createElement('div');

const divPosition = createElement('div');

const divSubmit = createElement('div');

const divDebug = createElement('div',{ className: 'debug', });

const divJSON = createElement('div', {
    onclick(e) {
        const range = document.createRange();
        range.selectNode(e.currentTarget);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy')
    }
});


const canvas = createElement('canvas', {
    width: 700,
    height: 350,
    addStyle: {
        backgroundColor: 'transparent',
        margin: 'auto',
        display: 'block',
        position: 'absolute',    
    }
});

const context = canvas.getContext('2d')

function draw() {

    console.log("called...");

    const dataValues = [x.value, y.value, w.value, h.value, 0, 0, w.value, h.value];
    
    addStyle(canvas, {
        left: parseInt(x.value) - (debugBorder.checked?BORDER_SIZE:0) + 'px',
        top: parseInt(y.value) - (debugBorder.checked?BORDER_SIZE:0) + 'px',
        border: debugBorder.checked ? BORDER_SIZE + 'px dotted mediumseagreen' : 'none',
    })
    setElement(canvas, {
        width: w.value, 
        height: h.value,
    })

    context.clearRect(0, 0, canvas.width, canvas.height);

    const imageCanvas = new Image();

    imageCanvas.src = image.src;
        
    imageCanvas.onload = function(){

        context.drawImage(imageCanvas, ...dataValues);

    }

}

document.addEventListener("DOMContentLoaded", draw);

imageBody.append(
    image, 
    canvas,
);

divAnimation.append(
    animation, 
    direction, 
    frame,
);

divSize.append(
    w, 
    h,
);

divPosition.append(
    x, 
    y,
);

divSubmit.append(
    submitSave, 
    submitCompare, 
    submitDelete,
);

divDebug.append(
    debugBorder, 
    debugBorderMessage, 
    BREAKLINE, 
    debugIncrement, 
    debugIncrementMessage
);

form.append(
    divAnimation,
    divSize,
    divPosition,
    divSubmit,
    divDebug,
    divJSON
);

document.body.append(
    imageBody, 
    form,
);

if (Object.values(character).length > 0) {
    divJSON.innerHTML = updateCharData(character, src, 0);
}

})();
