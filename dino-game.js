window.addEventListener('load', async () => {
    const startGameButton = document.getElementById('startGameButton');
    const dinoGameContainer = document.getElementById('dinoGameContainer');

    let gameSpeed = 2;
    let obstacleFrequency = 100;
    let score = 0;
    let gameOver = false;
    let gameInterval;
    let highScore = await fetchHighScore(); // Obtener el récord global al cargar

    const isSmallScreen = () => {
        return window.innerWidth <= 600;
    };

    async function fetchHighScore() {
        try {
            const response = await fetch('/api/highscore');
            const data = await response.json();
            console.log('High Score fetched:', data.highScore); // Log para depuración
            return data.highScore || 0;
        } catch (error) {
            console.error('Error fetching high score:', error);
            return 0;
        }
    }

    async function updateHighScore(score) {
        try {
            const response = await fetch('/api/highscore', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ score })
            });
            const data = await response.json();
            console.log('High Score updated:', data); // Log para depuración
        } catch (error) {
            console.error('Error updating high score:', error);
        }
    }

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
        clearInterval(gameInterval);
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
        let gravity = 0.4;
        let jumpHeight = -10;
        let maxJumps = 2;
        let obstacles = [];

        const drawBackground = () => {
            ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        };

        const drawDino = () => {
            ctx.drawImage(dinoImg, 0, 0, dinoImg.width, dinoImg.height, dino.x, dino.y, dino.width, dino.height);
        };

        const drawObstacles = () => {
            obstacles.forEach((obstacle) => {
                ctx.drawImage(cactusImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            });
        };

        const drawScore = () => {
            ctx.font = '20px Arial';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'left';
            ctx.fillText(`Récord: ${highScore}`, 10, 30);
            ctx.textAlign = 'right';
            ctx.fillText(`Puntaje: ${score}`, canvas.width - 10, 30);
        };

        const showGameOverMessage = async () => {
            ctx.font = '30px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText('¡Has Perdido!', canvas.width / 2, canvas.height / 2 - 20);
            ctx.font = '20px Arial';
            if (isSmallScreen()) {
                ctx.fillText('Toca la pantalla para reiniciar', canvas.width / 2, canvas.height / 2 + 20);
            } else {
                ctx.fillText('Presiona "Espacio" o toca la pantalla para reiniciar', canvas.width / 2, canvas.height / 2 + 20);
            }
            ctx.fillText(`Puntaje final: ${score}`, canvas.width / 2, canvas.height / 2 + 50);

            if (score > highScore) {
                highScore = score;
                await updateHighScore(score);  // Actualizar el récord global en la base de datos
                console.log('New high score set:', highScore); // Log para depuración
            }

            ctx.fillText(`Récord: ${highScore}`, canvas.width / 2, canvas.height / 2 + 80);
        };

        const updateObstacles = () => {
            obstacles.forEach((obstacle) => {
                obstacle.x -= gameSpeed;
                if (obstacle.x + obstacle.width < dino.x && !obstacle.counted) {
                    score += 1;
                    obstacle.counted = true;
                }
            });
            if (obstacles[0] && obstacles[0].x < 0) {
                obstacles.shift();
            }
        };

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

        const createObstacle = () => {
            if (Math.random() < 1 / obstacleFrequency) {
                obstacles.push({ x: canvas.width, y: 150, width: 20, height: 30, counted: false });
            }
        };

        gameInterval = setInterval(() => {
            updateGame();
            createObstacle();
        }, 1000 / 60);

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

        document.addEventListener('touchstart', () => {
            handleJumpAndRestart();
        });
    };

    startGameButton.addEventListener('click', startGame);
});
