export function setupRealisticMode(planets, sun, buttonId, orbitLines, camera) {
    const earthRadius = 6371; // Raio da Terra em km
    const originalSizes = planets.map(({ planet }) => planet.scale.clone()); // Tamanhos originais
    const originalSpeeds = planets.map(({ speed }) => speed); // Velocidades originais
    const originalPositions = planets.map(({ planet }) => planet.position.clone()); // Posições originais

    // Dados realistas centralizados, incluindo a distância do planeta em relação ao Sol
    const realisticData = [
        { radius: 2439, speed: 0.0415, distance: 5 }, // Mercúrio (em milhões de km)
        { radius: 6051, speed: 0.0162, distance: 7 }, // Vênus
        { radius: 6371, speed: 0.01, distance: 9 },   // Terra
        { radius: 3389, speed: 0.0053, distance: 11 }, // Marte
        { radius: 69911, speed: 0.00084, distance: 23 }, // Júpiter
        { radius: 58232, speed: 0.00034, distance: 43 }, // Saturno
        { radius: 25362, speed: 0.00012, distance: 56 }, // Urano
        { radius: 24622, speed: 0.000061, distance: 60 } // Netuno
    ];

    let isRealistic = false; // Estado inicial do modo realista
    const button = document.getElementById(buttonId);

    // Função para atualizar o modo realista
    function updateRealisticMode(enable) {
        let maxDistance = 0;  // Para armazenar a distância máxima

        planets.forEach(({ planet }, index) => {
            const { radius, speed, distance } = realisticData[index];
            if (enable) {
                // Escala proporcional ao raio da Terra
                const scale = radius / earthRadius;
                animateScale(planet, scale);

                // Define a posição do planeta com base na distância configurada
                planet.position.set(distance, 0, 0); // Atualiza a posição no eixo X (distância ao Sol)

                planets[index].speed = speed;

                // Torna as linhas das órbitas invisíveis
                orbitLines.forEach(line => {
                    line.visible = false;
                });

                // Atualiza a distância máxima
                maxDistance = Math.max(maxDistance, distance);
            } else {
                // Resetando para a posição e escala originais
                animateScale(planet, originalSizes[index].x);
                planet.position.copy(originalPositions[index]); // Restaurando a posição original
                planets[index].speed = originalSpeeds[index];

                // Torna as linhas das órbitas visíveis novamente
                orbitLines.forEach(line => {
                    line.visible = true;
                });
            }
        });


        isRealistic = enable;
        button.classList.toggle('active', enable);
        showModeNotification(enable ? 'Modo Realista Ativado' : 'Modo Realista Desativado');
    }

    // Animação suave de escala
    function animateScale(planet, targetScale) {
        const initialScale = planet.scale.clone();
        const duration = 1000; // 1 segundo
        const steps = 60; // 60 frames
        const stepTime = duration / steps;
        const scaleStep = (targetScale - initialScale.x) / steps;

        let step = 0;
        const interval = setInterval(() => {
            if (step >= steps) {
                clearInterval(interval);
                return;
            }
            const newScale = initialScale.x + scaleStep * step;
            planet.scale.set(newScale, newScale, newScale);
            step++;
        }, stepTime);
    }

    // Notificação de modo
    function showModeNotification(message) {
        const notification = document.createElement('div');
        notification.innerText = message;
        notification.style.position = 'absolute';
        notification.style.top = '10px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '100';
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    // Evento de clique no botão
    button.addEventListener('click', () => {
        updateRealisticMode(!isRealistic);
    });

    // Retornar a função que atualiza o modo realista
    return { updateRealisticMode };
}
