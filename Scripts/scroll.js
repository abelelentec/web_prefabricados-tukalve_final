const header = document.querySelector('header');
const nav = document.querySelector('header nav');
const toggle = document.querySelector('.nav-toggle');
const heroContent = document.querySelector('.hero-content');
const lightbox = document.getElementById('imageLightbox');
const lightboxImage = lightbox ? lightbox.querySelector('img') : null;
const closeButton = lightbox ? lightbox.querySelector('.lightbox-close') : null;
const mobileQuery = window.matchMedia('(max-width: 900px)');
let heroWasVisible = null;

function updateHeroVisibility() {
    if (!heroContent) return;

    // En móvil: ocultar el card al entrar (scrollY ~= 0). Mostrar sólo
    // cuando el usuario desplaza ligeramente hacia abajo (umbral pequeño).
    if (mobileQuery.matches) {
        const wasVisible = heroWasVisible;
        let shouldBeVisible = true;
        if (window.scrollY <= 2) {
            shouldBeVisible = false;
            heroContent.classList.add('is-hidden');
            heroContent.classList.remove('is-visible');
        } else {
            shouldBeVisible = true;
            heroContent.classList.remove('is-hidden');
            heroContent.classList.add('is-visible');
        }

        // Si hemos pasado de oculto -> visible, nos aseguramos que el card
        // quede completamente visible dentro del viewport (evita recorte).
        if (!wasVisible && shouldBeVisible) {
            ensureHeroFullyVisible();
        }
        heroWasVisible = shouldBeVisible;
        return;
    }

    // En escritorio siempre visible
    heroContent.classList.remove('is-hidden');
    heroContent.classList.add('is-visible');
}

function ensureHeroFullyVisible() {
    if (!heroContent) return;
    // pequeño delay para dejar que la clase y layout se apliquen
    requestAnimationFrame(() => {
        const rect = heroContent.getBoundingClientRect();
        const headerHeight = header ? header.offsetHeight : 0;
        const padding = 8; // margen extra

        // Si la parte superior del card queda detrás del header, desplazamos hacia arriba
        if (rect.top < headerHeight + padding) {
            const delta = rect.top - (headerHeight + padding);
            window.scrollBy({ top: delta, behavior: 'smooth' });
            return;
        }

        // Si la parte inferior del card queda fuera del viewport, desplazamos hacia abajo
        if (rect.bottom > window.innerHeight - padding) {
            const delta = rect.bottom - (window.innerHeight - padding);
            window.scrollBy({ top: delta, behavior: 'smooth' });
        }
    });
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

// Abrir/cerrar menú hamburguesa (solo si existe el toggle)
if (toggle) {
    toggle.addEventListener('click', () => {
        if (nav) nav.classList.toggle('open');
    });
}

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        if (nav) nav.classList.remove('open');
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
