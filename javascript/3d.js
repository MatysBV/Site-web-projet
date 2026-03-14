// On importe THREE.js (la librairie principale pour faire de la 3D)
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";

// On importe OrbitControls pour pouvoir bouger la caméra avec la souris
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

// On importe le loader pour charger les modèles 3D au format .glb
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";


// ==========================
// SCENE
// ==========================

// On crée la scène 3D (c'est un peu comme la "pièce" dans laquelle ou on peut placer les objets)
const scene = new THREE.Scene();


// ==========================
// CAMERA
// ==========================

// On crée la caméra
// 75 = champ de vision
// window.innerWidth / window.innerHeight = ratio écran
// 0.1 = distance minimum visible
// 500 = distance maximum visible
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    500
);

// On place la caméra un peu devant pour voir le modèle
camera.position.set(0, 0, 5);


// ==========================
// RENDERER
// ==========================

// On récupère la div HTML dans laquelle se trouve l'objet 3D
const container = document.getElementById("container3D");

// On crée le moteur de rendu
// alpha true = fond transparent
// antialias true = rendu plus lisse
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

// On active les ombres
renderer.shadowMap.enabled = true;

// Type d'ombre plus doux
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Correction des couleurs pour avoir un rendu plus réaliste
renderer.outputEncoding = THREE.sRGBEncoding;

// Tone mapping pour améliorer le rendu lumineux
renderer.toneMapping = THREE.ACESFilmicToneMapping;

// Intensité globale de la lumière
renderer.toneMappingExposure = 1;

// On ajoute le canvas WebGL dans la div HTML
container.appendChild(renderer.domElement);


// Fonction pour adapter la taille du rendu à la taille de la div
function setRendererSize() {

    // On récupère la largeur et hauteur de la div
    const width = container.clientWidth;
    const height = container.clientHeight;

    // On applique cette taille au renderer
    renderer.setSize(width, height);

    // On met à jour le ratio de la caméra
    camera.aspect = width / height;

    // On recalcul la projection de la caméra
    camera.updateProjectionMatrix();
}

// On lance la fonction une première fois
setRendererSize();


// ==========================
// LIGHTS
// ==========================

// Lumière principale (celle qui éclaire le plus)
const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);

// Position de la lumière
keyLight.position.set(5, 5, 5);

// active les ombres pour cette lumière
keyLight.castShadow = true;

// On ajoute la lumière dans la scène
scene.add(keyLight);


// Lumière secondaire pour éclairer les zones d'ombre
const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);

// Position de cette lumière
fillLight.position.set(-5, 2, 5);

// On l'ajoute à la scène
scene.add(fillLight);


// Lumière derrière pour créer un petit contour lumineux
const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);

// Position derrière l'objet
rimLight.position.set(0, 5, -5);

// Ajout dans la scène
scene.add(rimLight);


// Lumière ambiante pour éclairer légèrement toute la scène
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);

// Ajout dans la scène
scene.add(ambientLight);


// ==========================
// MOUSE
// ==========================

// Variable pour garder la position horizontale de la souris
let mouseX = 0;


// ==========================
// CONTROLS
// ==========================

// On crée les contrôles de caméra
const controls = new OrbitControls(camera, renderer.domElement);

// On empêche le zoom au départ
controls.enableZoom = false;

// Vitesse du zoom
controls.zoomSpeed = 1.2;

// On empêche de déplacer la caméra
controls.enablePan = false;


// Ici on bloque la rotation verticale
// donc la caméra tourne seulement autour de l'objet
controls.minPolarAngle = Math.PI / 2;
controls.maxPolarAngle = Math.PI / 2;


// Active une rotation plus fluide
controls.enableDamping = true;

// Intensité de l'effet de fluidité
controls.dampingFactor = 0.05;


// ==========================
// LOADER
// ==========================

// On crée le loader pour charger le modèle
const loader = new GLTFLoader();

// Variable qui contiendra le modèle 3D
let object;


// On charge le modèle
loader.load(

    // Chemin vers le modèle
    "./model-3d/personnage-final-2.glb",

    // Fonction appelée quand le modèle est chargé
    function (gltf) {

        // On récupère la scène du fichier glb
        object = gltf.scene;

        // On crée une boite invisible autour du modèle
        const box = new THREE.Box3().setFromObject(object);

        // On récupère le centre du modèle
        const center = box.getCenter(new THREE.Vector3());

        // On récupère la taille du modèle
        const size = box.getSize(new THREE.Vector3());

        // On recentre le modèle sur l'origine
        object.position.x -= center.x;
        object.position.y -= center.y;
        object.position.z -= center.z;

        // ==========================
        // SCALE
        // ==========================

        // On récupère la plus grande dimension du modèle
        const maxSize = Math.max(size.x, size.y, size.z);

        // On calcule un scale pour que le modèle fasse environ 3 unités
        const scale = (3 / maxSize) * 2;

        // On applique ce scale
        object.scale.setScalar(scale);

        // On descend un peu le modèle
        object.position.y -= 0.5;

        // On traverse tous les objets du modèle
        object.traverse((child) => {

            // Si c'est un mesh
            if (child.isMesh) {

                // Il peut projeter des ombres
                child.castShadow = true;

                // Il peut recevoir des ombres
                child.receiveShadow = true;

                // On met à jour le matériau
                child.material.needsUpdate = true;
            }

        });

        // On ajoute le modèle dans la scène
        scene.add(object);

    },

    // Progression du chargement
    function (xhr) {

        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");

    },

    // Si il y a une erreur
    function (error) {

        console.error("Erreur chargement modèle :", error);

    }

);


// ==========================
// ROTATION ENABLE
// ==========================

// Variable pour activer ou non la rotation à la souris
let rotationEnabled = false;


// On récupère le bouton qui active la vue 3D
const viewButton = document.querySelector('.view3D');


// Quand on clique dessus
viewButton.addEventListener('click', () => {

    // On inverse l'état (true / false)
    rotationEnabled = !rotationEnabled;

    // On active le zoom seulement si la rotation est activée
    controls.enableZoom = rotationEnabled;

});


// ==========================
// ANIMATION
// ==========================

// Variables pour gérer la rotation douce
let targetRotation = 0;
let currentRotation = 0;


// Fonction d'animation principale
function animate() {

    // On demande au navigateur de rappeler cette fonction à chaque frame
    requestAnimationFrame(animate);

    // Si le modèle est chargé
    if (object) {

        // Rotation automatique lente
        object.rotation.y += 0.002;

        // Rotation avec la souris si activée
        if (rotationEnabled) {

            // On calcule la position cible selon la souris
            targetRotation = (mouseX / container.clientWidth - 0.5) * 2;

            // Interpolation pour une rotation plus douce
            currentRotation += (targetRotation - currentRotation) * 0.05;

            // On applique la rotation
            object.rotation.y += currentRotation * 0.02;
        }

    }

    // Mise à jour des contrôles
    controls.update();

    // On rend la scène
    renderer.render(scene, camera);

}

// On lance l'animation
animate();


// ==========================
// RESIZE
// ==========================

// Si la fenêtre change de taille
window.addEventListener("resize", () => {

    // On recalcule la taille du renderer
    setRendererSize();

});


// ==========================
// MOUSE MOVE
// ==========================

// Quand la souris bouge dans la zone 3D
container.addEventListener('mousemove', (e) => {

    // On récupère la position de la div
    const rect = container.getBoundingClientRect();

    // On calcule la position horizontale de la souris
    mouseX = e.clientX - rect.left;

});
