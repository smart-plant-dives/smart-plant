let slides = document.querySelectorAll('.slide'); 

let dots = document.querySelectorAll('.dot'); 

let index = 0; 

 

function showSlide(i) { 

    slides.forEach(slide => slide.classList.remove('active')); 

    dots.forEach(dot => dot.classList.remove('active')); 

 

    slides[i].classList.add('active'); 

    dots[i].classList.add('active'); 

} 

 

function nextSlide() { 

    index = (index + 1) % slides.length; 

    showSlide(index); 

} 

 

// automático 

setInterval(nextSlide, 3000); 

 

// clique nos dots 

dots.forEach((dot, i) => { 

    dot.addEventListener("click", () => { 

        index = i; 

        showSlide(index); 

    }); 

}); 