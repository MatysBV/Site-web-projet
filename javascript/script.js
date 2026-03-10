// script qui gère le menu burger et la fermeture du menu en cliquant n'importe où sur la page

document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.menuBurger');
    const nav = document.querySelector('.navigation');

    // Clique sur le burger pour ouvrir/fermer
    burger.addEventListener('click', (e) => {
        nav.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        e.stopPropagation(); // empêche le clic de se propager au document
    });

    // Clique n'importe où sur la page pour fermer le menu
    document.addEventListener('click', (e) => {
        // Si le menu est ouvert ET que le clic n'est pas sur le menu
        if (nav.classList.contains('active') && !nav.contains(e.target)) {
            nav.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Optionnel : empêcher les clics **dans le menu lui-même** de le fermer
    nav.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});


// script pour la fleche de retour qui renvoit au debut de la page

document.addEventListener("DOMContentLoaded", function () {

    const flecheRetour = document.querySelector(".flecheRetour");

    flecheRetour.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

});