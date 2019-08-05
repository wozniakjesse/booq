const SLIDER_INTERVAL = 7000;
const ICON_MAX = 11;
const DOLLA_FLASH_SPEED = 300;
const LIST_FLASH_SPEED = 700;
const FLASH_CLASS = ' flash';

if (document.getElementsByClassName('siema').length > 0) {
    /* https://pawelgrzybek.github.io/siema/ */
    let carousel = new Siema({
        loop: true
    });

    setInterval(function() {
        carousel.next();
    }, SLIDER_INTERVAL);

    let prevBtn = document.createElement('button');
    prevBtn.textContent = "<";
    prevBtn.className += " carousel-button";
    let nextBtn = document.createElement('button');
    nextBtn.textContent = ">";
    nextBtn.className += " carousel-button";
    
    let buttonContainer = document.getElementById('carousel-button-container');

    prevBtn.addEventListener('click', function() {
        carousel.prev();
    });
    nextBtn.addEventListener('click', function() {
        carousel.next();
    });
    
    buttonContainer.appendChild(prevBtn);
    buttonContainer.appendChild(nextBtn);
}

/*
*   Ridiculous fancy divider
*/
function animateDivider(divider) {
    if (divider.childNodes.length < ICON_MAX) {
        for (let i = 0; i < 2; ++i) {
            addDollaSign(divider);
        }
    } else {
        divider.innerHTML = "";
        addDollaSign(divider);
    }
}

function addDollaSign(el) {
    let dollaSign = document.createElement('span');
    dollaSign.textContent = "$";
    el.appendChild(dollaSign);
}

let dividers = document.getElementsByClassName('fancy-divider');
for (let i = 0; i < dividers.length; ++i) {
    addDollaSign(dividers[i]);
    setInterval(function() {
        animateDivider(dividers[i]);
    }, DOLLA_FLASH_SPEED);
}


/*
*   Flashing List Bullets
*/
function animateLists(el) {
    let flashClass = 'flash';
    let classes = el.className.split(' ');
    let classIndex = classes.indexOf(flashClass);
    if (classIndex == -1)
        classes.push(flashClass);    
    else
        classes.splice(classIndex, 1);
    el.className = classes.join(' ');
}

let lists = document.getElementsByTagName('li');
for (let i = 0; i < lists.length; ++i) {
    setInterval(function() {
        animateLists(lists[i]);
    }, LIST_FLASH_SPEED);
}