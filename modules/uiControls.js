import { addStars } from './background.js'; //importa a função "addStars"

export function setupUI(planets, scene, stars, updateSpeedCallback) {
    const speedSlider = document.getElementById('speed-slider'); //controle deslizante(slider)
    const starSlider = document.getElementById('star-slider');

    // Controlar velocidade de translação
    speedSlider.addEventListener('input', () => {
        const speedFactor = parseFloat(speedSlider.value);
        updateSpeedCallback(speedFactor); // Atualizar fator de velocidade
    });

    // Controlar número de estrelas no fundo
    starSlider.addEventListener('input', () => {
        const count = parseInt(starSlider.value);
        scene.remove(stars);
        stars = addStars(scene, count); // Cria um novo conjunto de estrelas com a quantidade definida pelo slider
    });
}
