// Carrossel de imagens da home
let slides = document.querySelectorAll('.slide');
let index = 0;

function showSlide(i) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[i].classList.add('active');
}

function nextSlide() {
    index = (index + 1) % slides.length;
    showSlide(index);
}

// avança automaticamente
if (slides.length > 0) {
    setInterval(nextSlide, 3000);
}
