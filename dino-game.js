window.addEventListener('load', () => {
    const startGameButton = document.getElementById('startGameButton');
    const restartGameButton = document.getElementById('restartGameButton');
    const dinoGameContainer = document.getElementById('dinoGameContainer');

    let gameSpeed = 2;
    let obstacleFrequency = 100;
    let score = 0;
    let gameOver = false;

    const startGame = () => {
        gameOver = false;
        dinoGameContainer.innerHTML = '';

        const title = document.createElement('h3');
        title.innerText = '¡Juega con el Dinosaurio! Presiona "Espacio" para saltar';
        dinoGameContainer.appendChild(title);

        const canvas = document.createElement('canvas');
        canvas.id = 'gameCanvas';
        canvas.width = 800;
        canvas.height = 200;
        dinoGameContainer.appendChild(canvas);

        restartGameButton.style.display = 'none'; // Inicia oculto

        startDinoGame();
    };

    const restartGame = () => {
        score = 0;
        gameSpeed = 2;
        obstacleFrequency = 100;
        gameOver = false;
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

        let dino = { x: 50, y: 150, width: 50, height: 50, dy: 0, speed: 5 };
        let gravity = 1.5;  // Ajustamos la gravedad para que el dinosaurio caiga más rápido
        let isJumping = false;
        let jumpHeight = -20;  // Ajustamos la altura del salto para que sea más alto
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

        // Mostrar mensaje de "Game Over"
        const showGameOverMessage = () => {
            ctx.font = '30px Arial';
            ctx.fillStyle = 'red';
            ctx.fillText('¡Has Perdido!', canvas.width / 2 - 100, canvas.height / 2);
            ctx.font = '20px Arial';
            ctx.fillText('Presiona "Reiniciar" para jugar de nuevo', canvas.width / 2 - 150, canvas.height / 2 + 40);
            restartGameButton.style.display = 'block'; // Mostrar el botón de reinicio
        };

        // Actualizar los obstáculos
        const updateObstacles = () => {
            obstacles.forEach((obstacle) => {
                obstacle.x -= gameSpeed;
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
                if (isJumping) {
                    dino.dy = jumpHeight;  // El salto se activa
                    isJumping = false;
                } else {
                    if (dino.y + dino.height < 150) {
                        dino.dy += gravity; // La gravedad mantiene el salto más lento
                    } else {
                        dino.dy = 0;
                        dino.y = 150;  // El dinosaurio vuelve al suelo
                    }
                }
                dino.y += dino.dy;

                if (score % 100 === 0 && score !== 0) {
                    gameSpeed += 0.5;
                    obstacleFrequency -= 5;
                }

                updateObstacles();
                drawDino();
                drawObstacles();
                detectCollisions();
            } else {
                showGameOverMessage();
            }
        };

        // Crear obstáculos
        const createObstacle = () => {
            if (Math.random() < 1 / obstacleFrequency) {
                obstacles.push({ x: canvas.width, y: 150, width: 20, height: 30 });
            }
        };

        // Iniciar el loop del juego
        setInterval(() => {
            updateGame();
            createObstacle();
        }, 1000 / 60);

        // Detectar salto del dinosaurio
        document.addEventListener('keydown', (event) => {
            if (event.key === " " && dino.y === 150 && !gameOver) {
                isJumping = true;
            }
        });
    };

    startGameButton.addEventListener('click', startGame);
    restartGameButton.addEventListener('click', restartGame);
});
