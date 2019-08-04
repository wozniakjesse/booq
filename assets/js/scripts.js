(function() {
    const SLIDER_INTERVAL = 7000;

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
})();