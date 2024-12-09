
import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js'; // Importar de acordo com as indicações do enunciado
import { createSolarSystem } from './modules/solarSystem.js'; // Importar os módulos do projeto
import { addStars } from './modules/background.js';
import { setupUI } from './modules/uiControls.js';
import { setupRealisticMode } from './modules/realist.js'; 

// Configuração da Cena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // preto para simular o espaço

const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 8, 40);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Adicionar luz
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // iluminar a cena
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 10, 10); // simular a luz do sol
scene.add(pointLight);

// Criar Sistema Solar
const { planets, sun, orbitLines } = createSolarSystem(scene); // Agora também retornando orbitLines

// Adicionar fundo estrelado
let stars = addStars(scene, 300);

// Definir o ponto inicial para o utilizador
let speedFactor = 1;
let cameraZoom = 37;
let cameraHeight = 6;

// Referências aos sliders e botões
const zoomSlider = document.getElementById('zoom-slider');
const zoomMinus = document.getElementById('zoom-minus');
const zoomPlus = document.getElementById('zoom-plus');

const heightSlider = document.getElementById('height-slider');
const heightMinus = document.getElementById('height-minus');
const heightPlus = document.getElementById('height-plus');

const speedSlider = document.getElementById('speed-slider');
const speedMinus = document.getElementById('speed-minus');
const speedPlus = document.getElementById('speed-plus');

const starSlider = document.getElementById('star-slider');
const starMinus = document.getElementById('star-minus');
const starPlus = document.getElementById('star-plus');

// Função para ajustar sliders continuamente, pressão prolongada
function adjustSliderContinuously(slider, adjustment, min, max, step) {
    let interval;

    const startAdjustment = () => {
        interval = setInterval(() => {
            let newValue = parseFloat(slider.value) + adjustment;
            newValue = Math.min(Math.max(newValue, min), max);
            slider.value = newValue;
            slider.dispatchEvent(new Event('input'));
        }, 100);
    };

    const stopAdjustment = () => {
        clearInterval(interval);
    };

    return { startAdjustment, stopAdjustment };
}

// Configurar botões de controle de zoom
const { startAdjustment: startZoomMinus, stopAdjustment: stopZoomMinus } =
    adjustSliderContinuously(zoomSlider, -1, 10, 70, 10);
const { startAdjustment: startZoomPlus, stopAdjustment: stopZoomPlus } =
    adjustSliderContinuously(zoomSlider, 1, 10, 70, 10);

zoomMinus.addEventListener('mousedown', startZoomMinus);
zoomMinus.addEventListener('mouseup', stopZoomMinus);
zoomMinus.addEventListener('mouseleave', stopZoomMinus);

zoomPlus.addEventListener('mousedown', startZoomPlus);
zoomPlus.addEventListener('mouseup', stopZoomPlus);
zoomPlus.addEventListener('mouseleave', stopZoomPlus);

// Configurar botões de controle de altura
const { startAdjustment: startHeightMinus, stopAdjustment: stopHeightMinus } =
    adjustSliderContinuously(heightSlider, -1, 0, 25, 1);
const { startAdjustment: startHeightPlus, stopAdjustment: stopHeightPlus } =
    adjustSliderContinuously(heightSlider, 1, 0, 25, 1);

heightMinus.addEventListener('mousedown', startHeightMinus);
heightMinus.addEventListener('mouseup', stopHeightMinus);
heightMinus.addEventListener('mouseleave', stopHeightMinus);

heightPlus.addEventListener('mousedown', startHeightPlus);
heightPlus.addEventListener('mouseup', stopHeightPlus);
heightPlus.addEventListener('mouseleave', stopHeightPlus);

// Configurar botões de controle de velocidade
const { startAdjustment: startSpeedMinus, stopAdjustment: stopSpeedMinus } =
    adjustSliderContinuously(speedSlider, -0.1, 1, 10, 0.1);
const { startAdjustment: startSpeedPlus, stopAdjustment: stopSpeedPlus } =
    adjustSliderContinuously(speedSlider, 0.1, 1, 10, 0.1);

speedMinus.addEventListener('mousedown', startSpeedMinus);
speedMinus.addEventListener('mouseup', stopSpeedMinus);
speedMinus.addEventListener('mouseleave', stopSpeedMinus);

speedPlus.addEventListener('mousedown', startSpeedPlus);
speedPlus.addEventListener('mouseup', stopSpeedPlus);
speedPlus.addEventListener('mouseleave', stopSpeedPlus);

// Configurar botões de controle de estrelas
const { startAdjustment: startStarMinus, stopAdjustment: stopStarMinus } =
    adjustSliderContinuously(starSlider, -100, 700, 3000, 100);
const { startAdjustment: startStarPlus, stopAdjustment: stopStarPlus } =
    adjustSliderContinuously(starSlider, 100, 700, 3000, 100);

starMinus.addEventListener('mousedown', startStarMinus);
starMinus.addEventListener('mouseup', stopStarMinus);
starMinus.addEventListener('mouseleave', stopStarMinus);

starPlus.addEventListener('mousedown', startStarPlus);
starPlus.addEventListener('mouseup', stopStarPlus);
starPlus.addEventListener('mouseleave', stopStarPlus);

// Atualizar sliders
zoomSlider.addEventListener('input', () => {
    cameraZoom = 80 - parseFloat(zoomSlider.value);
});

heightSlider.addEventListener('input', () => {
    cameraHeight = parseFloat(heightSlider.value);
});

window.addEventListener('wheel', (event) => {
    event.preventDefault();
    const delta = event.deltaY * 0.05;
    cameraZoom = Math.min(Math.max(cameraZoom + delta, 0), 80);
    zoomSlider.value = 80 - cameraZoom;
    zoomSlider.dispatchEvent(new Event('input'));
});

// Configurar UI
setupUI(planets, scene, stars, (newSpeed) => {
    speedFactor = newSpeed;
});

// Configurar modo realista com câmera
setupRealisticMode(planets, sun, 'realistic-mode', orbitLines, camera);

// Loop de animação
function animate() {
    requestAnimationFrame(animate);

    camera.position.z = cameraZoom;
    camera.position.y = cameraHeight;

    planets.forEach(({ planet, orbit, speed, rotationSpeed }) => {
        orbit.rotation.y += speed * speedFactor;
        planet.rotation.y += rotationSpeed;
    });

    sun.rotation.y += 0.005;

    renderer.render(scene, camera);
}

animate();
