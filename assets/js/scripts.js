const SLIDER_INTERVAL = 7000;

if (document.getElementsByClassName('siema').length > 0) {
    /* https://pawelgrzybek.github.io/siema/ */
    let carousel = new Siema({
        loop: true
    });

    setInterval(function() {
        carousel.next();
    }, SLIDER_INTERVAL);

    let prevBtn = document.getElementById('carousel-prev');
    let nextBtn = document.getElementById('carousel-next');

    prevBtn.addEventListener('click', function() {
        carousel.prev();
    });
    nextBtn.addEventListener('click', function() {
        carousel.next();
    });
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