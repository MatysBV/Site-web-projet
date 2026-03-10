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