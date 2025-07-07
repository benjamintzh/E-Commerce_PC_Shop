document.addEventListener("DOMContentLoaded", function () {
    const carouselWrapper = document.getElementById("carouselWrapper");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    let scrollAmount = 0;
    const cardWidth = document.querySelector(".card").offsetWidth + 20; // Card width + margin
    const maxScroll = (document.querySelectorAll(".card").length - 3) * cardWidth; // Total scroll width

    function updateButtons() {
        prevBtn.disabled = scrollAmount === 0;
        nextBtn.disabled = scrollAmount >= maxScroll;
    }

    prevBtn.addEventListener("click", function () {
        if (scrollAmount > 0) {
            scrollAmount -= cardWidth;
            carouselWrapper.style.transform = `translateX(-${scrollAmount}px)`;
        }
        updateButtons();
    });

    nextBtn.addEventListener("click", function () {
        if (scrollAmount < maxScroll) {
            scrollAmount += cardWidth;
            carouselWrapper.style.transform = `translateX(-${scrollAmount}px)`;
        }
        updateButtons();
    });

    updateButtons();
});