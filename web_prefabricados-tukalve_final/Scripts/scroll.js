const header = document.querySelector('header');
const nav = document.querySelector('header nav');
const toggle = document.querySelector('.nav-toggle');
const heroContent = document.querySelector('.hero-content');
const lightbox = document.getElementById('imageLightbox');
const lightboxImage = lightbox ? lightbox.querySelector('img') : null;
const closeButton = lightbox ? lightbox.querySelector('.lightbox-close') : null;
const mobileQuery = window.matchMedia('(max-width: 900px)');

function updateHeroVisibility() {
    if (!heroContent) return;

    if (mobileQuery.matches && window.scrollY < 60) {
        heroContent.classList.add('is-hidden');
        heroContent.classList.remove('is-visible');
    } else {
        heroContent.classList.remove('is-hidden');
        heroContent.classList.add('is-visible');
    }
}

// Reducir header al hacer scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
        nav.classList.remove('open');
    }

    updateHeroVisibility();
});

window.addEventListener('resize', updateHeroVisibility);
window.addEventListener('load', updateHeroVisibility);
updateHeroVisibility();

// Abrir/cerrar menú hamburguesa
toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
});

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('open');
    });
});

// Ampliar imágenes al hacer clic
const galleryImages = document.querySelectorAll('.capability-images img');

function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

galleryImages.forEach(image => {
    image.addEventListener('click', () => {
        if (!lightbox || !lightboxImage) return;
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt || 'Imagen ampliada';
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    });
});

if (closeButton) {
    closeButton.addEventListener('click', closeLightbox);
}

if (lightbox) {
    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeLightbox();
    }
});
