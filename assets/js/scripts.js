const SLIDER_INTERVAL = 7000;

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
let dividers = document.getElementsByClassName('fancy-divider');
for (let i = 0; i < dividers.length; ++i) {
    for (let j = 0; j < 7; ++j) {
        let dollaSign = document.createElement('span');
        dollaSign.textContent = "$";
        dividers[i].appendChild(dollaSign);
    }
}