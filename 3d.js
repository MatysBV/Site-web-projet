// Import THREE.js
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// ==========================
// SCENE
// ==========================
const scene = new THREE.Scene();

// ==========================
// CAMERA
// ==========================
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    500
);
camera.position.set(0, 0, 5);

// ==========================
// RENDERER
// ==========================
const container = document.getElementById("container3D");
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
container.appendChild(renderer.domElement);

// Met le renderer à la taille de la div container3D
function setRendererSize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}
setRendererSize();

// ==========================
// LIGHTS (RÉALISTES)
// ==========================
const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
keyLight.position.set(5, 5, 5);
keyLight.castShadow = true;
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
fillLight.position.set(-5, 2, 5);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
rimLight.position.set(0, 5, -5);
scene.add(rimLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// ==========================
// MOUSE POSITION
// ==========================
let mouseX = container.clientWidth / 2;
let mouseY = container.clientHeight / 2;

// ==========================
// CONTROLS
// ==========================
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;  // zoom désactivé par défaut
controls.zoomSpeed = 1.2;
controls.minDistance = 1;
controls.maxDistance = 10;
controls.enablePan = false;

// ==========================
// LOADER
// ==========================
const loader = new GLTFLoader();
let object;

loader.load(
    "./model-3d/personnage-final-2.glb",
    function (gltf) {
        object = gltf.scene;

        // centrer et scaler
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        object.position.x -= center.x;
        object.position.y -= center.y;
        object.position.z -= center.z;

        const maxSize = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxSize;
        object.scale.setScalar(scale);

        // léger ajustement vertical
        object.position.y -= 0.5;

        // Shadows pour chaque mesh
        object.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.needsUpdate = true;
            }
        });

        scene.add(object);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
        console.error("Erreur chargement modèle :", error);
    }
);

// ==========================
// FLAG pour activer rotation & zoom
// ==========================
let rotationEnabled = false;

// bouton pour activer la rotation et le zoom
const viewButton = document.querySelector('.view3D');
viewButton.addEventListener('click', () => {
    rotationEnabled = !rotationEnabled;
    controls.enableZoom = rotationEnabled; // zoom activé uniquement après clic
});

// ==========================
// ANIMATION
// ==========================
function animate() {
    requestAnimationFrame(animate);

    if (object && rotationEnabled) {
        object.rotation.y = -3 + (mouseX / container.clientWidth) * 3;
        object.rotation.x = -1.2 + (mouseY * 2.5) / container.clientHeight;
    }

    controls.update();
    renderer.render(scene, camera);
}
animate();

// ==========================
// RESIZE
// ==========================
window.addEventListener("resize", () => {
    setRendererSize();
});

// ==========================
// MOUSE MOVE
// ==========================
container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});