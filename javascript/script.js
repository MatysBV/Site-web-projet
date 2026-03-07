// script.js

document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.menuBurger');
    const nav = document.querySelector('.navigation');

    // Clique sur le burger pour ouvrir/fermer
    burger.addEventListener('click', (e) => {
        nav.classList.toggle('active');
        e.stopPropagation(); // empêche le clic de se propager au document
    });

    // Clique n'importe où sur la page pour fermer le menu
    document.addEventListener('click', (e) => {
        // Si le menu est ouvert ET que le clic n'est pas sur le menu
        if (nav.classList.contains('active') && !nav.contains(e.target)) {
            nav.classList.remove('active');
        }
    });

    // Optionnel : empêcher les clics **dans le menu lui-même** de le fermer
    nav.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});