// script qui gère le menu burger et la fermeture du menu

document.addEventListener('DOMContentLoaded', () => {

    const burger = document.querySelector('.menuBurger');
    const nav = document.querySelector('.navigation');
    const links = document.querySelectorAll('.navigation a');

    // ouvrir / fermer avec le burger
    burger.addEventListener('click', (e) => {
        nav.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        e.stopPropagation();
    });

    // fermer si on clique ailleurs sur la page
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('active') && !nav.contains(e.target)) {
            nav.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // fermer si on clique sur une catégorie
    links.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

});


// script pour la flèche de retour en haut de la page

document.addEventListener("DOMContentLoaded", () => {

    const flecheRetour = document.querySelector(".flecheRetour");

    flecheRetour.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

});


// script pour le lightbox (agrandir une image au clic)

document.addEventListener("DOMContentLoaded", () => {

    // Créer l'overlay lightbox
    const overlay = document.createElement("div");
    overlay.classList.add("lightbox-overlay");

    const closeBtn = document.createElement("span");
    closeBtn.classList.add("lightbox-close");
    closeBtn.textContent = "\u00D7";

    const lightboxImg = document.createElement("img");
    lightboxImg.classList.add("lightbox-img");

    overlay.appendChild(closeBtn);
    overlay.appendChild(lightboxImg);
    document.body.appendChild(overlay);

    // Fermer le lightbox
    function closeLightbox() {
        overlay.classList.remove("active");
    }

    closeBtn.addEventListener("click", closeLightbox);
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeLightbox();
    });

    // Ajouter le clic sur toutes les images dans les sections
    const sectionImages = document.querySelectorAll(".section img");
    sectionImages.forEach((img) => {
        img.style.cursor = "pointer";
        img.addEventListener("click", () => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            overlay.classList.add("active");
        });
    });

});


// script pour l'animation d'apparition au scroll

document.addEventListener("DOMContentLoaded", () => {

    const sections = document.querySelectorAll(".section");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.1 });

    sections.forEach((section) => observer.observe(section));

});