window.addEventListener('load', () => {
    const startGameButton = document.getElementById('startGameButton');
    const dinoGameContainer = document.getElementById('dinoGameContainer');

    let gameSpeed = 2;
    let obstacleFrequency = 100;
    let score = 0;
    let gameOver = false;
    let gameInterval;  // Variable para almacenar el intervalo del juego
    let highScore = localStorage.getItem('highScore') || 0;  // Obtener el récord más alto desde localStorage

    const isSmallScreen = () => {
        return window.innerWidth <= 600;
    };

    const startGame = () => {
        gameOver = false;
        score = 0;
        gameSpeed = 2;
        obstacleFrequency = 100;

        dinoGameContainer.innerHTML = '';

        const title = document.createElement('h3');
        if (isSmallScreen()) {
            title.innerText = '¡Juega con el Dinosaurio! Toca la pantalla para saltar';
        } else {
            title.innerText = '¡Juega con el Dinosaurio! Presiona "Espacio" o toca la pantalla para saltar';
        }
        dinoGameContainer.appendChild(title);

        const canvas = document.createElement('canvas');
        canvas.id = 'gameCanvas';
        canvas.width = 800;
        canvas.height = 200;
        dinoGameContainer.appendChild(canvas);

        startDinoGame();
    };

    const restartGame = () => {
        clearInterval(gameInterval);  // Limpiar el intervalo del juego anterior
        startGame();
    };

    const startDinoGame = () => {
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        const dinoImg = new Image();
        dinoImg.src = 'img/dinosaurio/vecteezy_brontosaurus-jump-png-illustrations_23271261.png'; // Asegúrate de que la ruta sea correcta
        const cactusImg = new Image();
        cactusImg.src = 'img/cactus/vecteezy_simple-cactus-cartoon-illustration_9514641.jpg';
        const bgImg = new Image();
        bgImg.src = 'img/vecteezy_desert-of-africa-or-wild-west-arizona-landscape_16265447_346/vecteezy_desert-of-africa-or-wild-west-arizona-landscape_16265447.jpg';

        let dino = { x: 50, y: 150, width: 50, height: 50, dy: 0, isJumping: false, jumpSpeed: 0, jumpCount: 0 };
        let gravity = 0.4;  // Ajustamos la gravedad para que el dinosaurio caiga más lento
        let jumpHeight = -10;  // Ajustamos la altura del salto para que sea más controlado
        let maxJumps = 2;  // Máximo número de saltos permitidos
        let obstacles = [];

        // Función para dibujar el fondo
        const drawBackground = () => {
            ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        };

        // Función para dibujar el dinosaurio
        const drawDino = () => {
            ctx.drawImage(dinoImg, 0, 0, dinoImg.width, dinoImg.height, dino.x, dino.y, dino.width, dino.height);
        };

        // Función para dibujar los obstáculos
        const drawObstacles = () => {
            obstacles.forEach((obstacle) => {
                ctx.drawImage(cactusImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            });
        };

        // Función para mostrar el puntaje
        const drawScore = () => {
            ctx.font = '20px Arial';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'left';  // Alinear texto a la izquierda
            ctx.fillText(`Récord: ${highScore}`, 10, 30);
            ctx.textAlign = 'right';  // Alinear texto a la derecha
            ctx.fillText(`Puntaje: ${score}`, canvas.width - 10, 30);
        };

        // Mostrar mensaje de "Game Over"
        const showGameOverMessage = () => {
            ctx.font = '30px Arial';
            ctx.fillStyle = 'red';
            ctx.fillText('¡Has Perdido!', canvas.width / 2 - 100, canvas.height / 2);
            ctx.font = '20px Arial';
            if (isSmallScreen()) {
                ctx.fillText('Toca la pantalla para reiniciar', canvas.width / 2 - 100, canvas.height / 2 + 40);
            } else {
                ctx.fillText('Presiona "Espacio" o toca la pantalla para reiniciar', canvas.width / 2 - 150, canvas.height / 2 + 40);
            }
            ctx.fillText(`Puntaje final: ${score}`, canvas.width / 2 - 70, canvas.height / 2 + 70);

            // Actualizar el récord más alto si es necesario
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('highScore', highScore);  // Guardar el nuevo récord más alto en localStorage
            }

            ctx.fillText(`Récord: ${highScore}`, canvas.width / 2 - 70, canvas.height / 2 + 100);
        };

        // Actualizar los obstáculos
        const updateObstacles = () => {
            obstacles.forEach((obstacle) => {
                obstacle.x -= gameSpeed;
                if (obstacle.x + obstacle.width < dino.x && !obstacle.counted) {
                    score += 1; // Incrementa el puntaje por cada cactus esquivado
                    obstacle.counted = true; // Marca el cactus como contado
                }
            });
            if (obstacles[0] && obstacles[0].x < 0) {
                obstacles.shift();
            }
        };

        // Detectar colisiones
        const detectCollisions = () => {
            obstacles.forEach((obstacle) => {
                if (
                    dino.x + dino.width > obstacle.x &&
                    dino.x < obstacle.x + obstacle.width &&
                    dino.y + dino.height > obstacle.y
                ) {
                    gameOver = true;
                }
            });
        };

        // Actualizar el juego
        const updateGame = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBackground();

            if (!gameOver) {
                if (dino.isJumping) {
                    dino.jumpSpeed += gravity;
                    dino.y += dino.jumpSpeed;

                    if (dino.y >= 150) {
                        dino.y = 150;
                        dino.isJumping = false;
                        dino.jumpSpeed = 0;
                        dino.jumpCount = 0;  // Restablece el contador de saltos al tocar el suelo
                    }
                }

                updateObstacles();
                drawDino();
                drawObstacles();
                detectCollisions();
                drawScore();
            } else {
                showGameOverMessage();
                clearInterval(gameInterval);  // Detener el intervalo del juego cuando se pierde
            }
        };

        // Crear obstáculos
        const createObstacle = () => {
            if (Math.random() < 1 / obstacleFrequency) {
                obstacles.push({ x: canvas.width, y: 150, width: 20, height: 30, counted: false });
            }
        };

        // Iniciar el loop del juego
        gameInterval = setInterval(() => {
            updateGame();
            createObstacle();
        }, 1000 / 60);

        // Detectar salto del dinosaurio y reinicio del juego
        const handleJumpAndRestart = () => {
            if (!gameOver) {
                if (dino.jumpCount < maxJumps) {
                    dino.isJumping = true;
                    dino.jumpSpeed = jumpHeight;
                    dino.jumpCount++;
                }
            } else if (gameOver) {
                restartGame();
            }
        };

        document.addEventListener('keydown', (event) => {
            if (event.key === " ") {
                handleJumpAndRestart();
            }
        });

        // Detectar toque en pantalla para dispositivos táctiles
        document.addEventListener('touchstart', () => {
            handleJumpAndRestart();
        });
    };

    startGameButton.addEventListener('click', startGame);
});
