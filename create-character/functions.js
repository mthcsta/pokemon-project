/**
 * 
 */
function $_GET(key) {
    return (new URL(location.href)).searchParams.get(key);
}

/**
 * Given a tag html name, an Object of attributes
 * returns an element with attributes passed-in
 * @param {String} type 
 * @param {Object} attrs 
 * @returns {HTMLElement}
 */
function createElement(type, attrs = {}) {
    const element = document.createElement(type);
    Object.keys(attrs).filter((attr)=>!['addStyle', 'append'].includes(attr)).forEach((attr)=>{
        element[attr] = attrs[attr];
    });
    if ('addStyle' in attrs) {
        addStyle(element, attrs.addStyle);
    }
    if ('append' in attrs) {
        element.append(...attrs.append);
    }
    return element;
}
/**
 * Given an HTMLElement, an object of attributes
 * returns an element with attributes passed-in 
 * @param {HTMLElement} element 
 * @param {Object} attrs 
 */
function setElement(element, attrs) {
    Object.keys(attrs).forEach((attr) => {
        element[attr] = attrs[attr];
    });
    return element;
}
/**
 * Given an element, an object of properties Css Style
 * returns same element with style
 * @param {HTMLElement} element 
 * @param {Object} styles 
 * @returns {HTMLElement}
 */
function addStyle(element, styles) {
    Object.keys(styles).forEach((prop)=>{
        element.style[prop] = styles[prop];
    })
    return element;
}
/**
 * Given a character object, an animation name and a direction name
 * returns size of Frames existing of animation
 * @param {Object} character 
 * @param {String} animation 
 * @param {String} direction 
 * @returns {NumberInteger} 
 */
function directionFrameSize(character, animation, direction) {
    const AnimationDirectionFrame = character[animation][direction];
    if (AnimationDirectionFrame != undefined) {
        return AnimationDirectionFrame.length;
    }
    return 0;
}

function confirmFrameRemove(animation, direction, frame) {
    var string =  'Você está prestes a excluir um frame, deseja continuar?\n'
                + '************************************************\n\n' 
                + 'Animação: ' + animation + '\n' 
                + 'Direção: ' + direction + '\n'
                + 'Frame: ' + frame;

    return confirm(string);
}
function updateCharData(character, src, changed = 1) {
    const characterJSON = createElement('pre', {
        innerHTML: JSON.stringify(character, null, 1).replace(/("[a-z].+")/ig,"<b>$1</b>")
    });
    if(changed && localStorage){
        localStorage.setItem(src, JSON.stringify(character));
    }
    return characterJSON.outerHTML;
}
function updateFrame() {
    frame.value = parseInt(frame.value) + 1;
}

