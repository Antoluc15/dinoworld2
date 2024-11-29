document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('game-container');
    const gameOver = document.getElementById('game-over');
    const restartButton = document.getElementById('restart');
    const scoreDisplay = document.createElement('div');
    let dinoBottom = 10;
    let cactusLeft = 800;
    let score = 0;
    let isJumping = false;
    const gravity = 2;

    // Configuración inicial del juego
    container.style.position = 'relative';
    container.style.width = '800px';
    container.style.height = '200px';
    container.style.backgroundColor = '#f7f7f7';
    container.style.border = '2px solid #ccc';
    container.style.overflow = 'hidden';
    container.style.margin = '0 auto';

    // Dino
    const dino = document.createElement('img');
    dino.src = './img/dino.png';
    dino.style.position = 'absolute';
    dino.style.width = '50px';
    dino.style.height = '50px';
    dino.style.bottom = dinoBottom + 'px';
    dino.style.left = '50px';
    container.appendChild(dino);

    // Cactus
    const cactus = document.createElement('img');
    cactus.src = './img/cactus.png';
    cactus.style.position = 'absolute';
    cactus.style.width = '30px';
    cactus.style.height = '50px';
    cactus.style.bottom = '10px';
    cactus.style.left = cactusLeft + 'px';
    container.appendChild(cactus);

    // Puntuación
    scoreDisplay.style.position = 'absolute';
    scoreDisplay.style.top = '10px';
    scoreDisplay.style.left = '10px';
    scoreDisplay.style.fontSize = '18px';
    scoreDisplay.style.color = '#333';
    scoreDisplay.innerHTML = 'Puntuación: 0';
    container.appendChild(scoreDisplay);

    // Función para el salto del Dino
    function jump() {
        if (isJumping) return;
        isJumping = true;

        let upInterval = setInterval(() => {
            if (dinoBottom >= 150) {
                clearInterval(upInterval);
                let downInterval = setInterval(() => {
                    if (dinoBottom <= 10) {
                        clearInterval(downInterval);
                        isJumping = false;
                    }
                    dinoBottom -= gravity;
                    dino.style.bottom = dinoBottom + 'px';
                }, 20);
            }
            dinoBottom += 20;
            dino.style.bottom = dinoBottom + 'px';
        }, 20);
    }

    // Función para mover el cactus
    function moveCactus() {
        function move() {
            cactusLeft -= 10;
            cactus.style.left = cactusLeft + 'px';

            if (cactusLeft < -30) {
                cactusLeft = 800;
                score++;
                scoreDisplay.innerHTML = `Puntuación: ${score}`;
            }

            if (cactusLeft > 50 && cactusLeft < 90 && dinoBottom <= 50) {
                endGame();
                cactusLeft = 800;
                score = 0;
                scoreDisplay.innerHTML = 'Puntuación: 0';
            }

            requestAnimationFrame(move);
        }
        move();
    }

    // Mostrar pantalla de "Juego Terminado"
    function endGame() {
        gameOver.style.display = 'block';
    }

    // Reiniciar el juego
    restartButton.addEventListener('click', () => {
        gameOver.style.display = 'none';
        cactusLeft = 800;
        score = 0;
        scoreDisplay.innerHTML = 'Puntuación: 0';
        moveCactus();
    });

    // Iniciar el juego
    moveCactus();

    // Detectar la tecla de espacio para saltar
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            jump();
        }
    });
});
