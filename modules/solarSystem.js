import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';

export function createSolarSystem(scene) {
    const textureLoader = new THREE.TextureLoader();

    // Criar o  sol como ponto central da cena
    const sunTexture = textureLoader.load('textures/sun.jpg'); // Textura do Sol
    const sunGeometry = new THREE.SphereGeometry(3, 32, 32); // Tamanho do Sol
    const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    const planets = [];
    const orbits = [];
    const orbitLines = [];  // Novo array para armazenar as linhas das órbitas

    // Velocidade linear constante para todos os planetas
    const linearSpeed = 0.2;

    // Dados dos planetas
    const planetData = [
        { name: 'Mercury', radius: 0.2, distance: 5, texture: 'textures/mercury.jpg', rotationSpeed: 0.01 },
        { name: 'Venus', radius: 0.4, distance: 7, texture: 'textures/venus.jpg', rotationSpeed: 0.005 },
        { name: 'Earth', radius: 0.5, distance: 9, texture: 'textures/earth.jpg', rotationSpeed: 0.02 },
        { name: 'Mars', radius: 0.3, distance: 11, texture: 'textures/mars.jpg', rotationSpeed: 0.015 },
        { name: 'Jupiter', radius: 1, distance: 15, texture: 'textures/jupiter.jpg', rotationSpeed: 0.04 },
        { name: 'Saturn', radius: 0.8, distance: 19, texture: 'textures/saturn.jpg', rotationSpeed: 0.035 },
        { name: 'Uranus', radius: 0.6, distance: 23, texture: 'textures/uranus.jpg', rotationSpeed: 0.03 },
        { name: 'Neptune', radius: 0.6, distance: 27, texture: 'textures/neptune.jpg', rotationSpeed: 0.03 }
    ];

    planetData.forEach(({ name, radius, distance, texture, rotationSpeed }) => {
        const planetTexture = textureLoader.load(texture);

        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        const material = new THREE.MeshStandardMaterial({ map: planetTexture });
        const planet = new THREE.Mesh(geometry, material);

        const orbit = new THREE.Object3D();
        orbit.add(planet);
        scene.add(orbit);

        planet.position.set(distance, 0, 0);

        // Velocidade angular proporcional ao inverso do raio
        const speed = linearSpeed / distance;
        planets.push({ planet, orbit, speed, rotationSpeed });
        orbits.push(orbit);

        // Adicionar visualização da órbita (linha contínua e transparente)
        const orbitPoints = [];
        const segments = 128;
        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            orbitPoints.push(new THREE.Vector3(
                Math.cos(theta) * distance,
                0,
                Math.sin(theta) * distance
            ));
        }

        const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
        const orbitMaterial = new THREE.LineBasicMaterial({
            color: 0xcccccc,
            opacity: 0.4, // Define transparência
            transparent: true, // Habilita transparência
        });
        const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
        scene.add(orbitLine);

        orbitLines.push(orbitLine);  // Adiciona a linha da órbita ao array
    });

    return { planets, orbits, sun, orbitLines }; // Incluindo as linhas das órbitas
}
