import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';

export function addStars(scene, count) {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,      // Cor branca
        size: 0.2,             // Tamanho das estrelas
        sizeAttenuation: true // Ajustar tamanho com base na perspectiva
    });

    const starPositions = [];
    for (let i = 0; i < count; i++) {
        starPositions.push(
            (Math.random() - 0.5) * 1000, // Distribuição em torno do centro
            (Math.random() - 0.5) * 1000,
            (Math.random() - 0.5) * 1000
        );
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    return stars;
}
