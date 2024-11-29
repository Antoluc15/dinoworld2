document.addEventListener('DOMContentLoaded', () => {
    const addDinoGame = () => {
        const gameContainer = document.getElementById('dinoGameContainer');
        const gameCanvas = document.createElement('canvas');
        gameCanvas.id = 'gameCanvas';
        gameCanvas.width = 800;
        gameCanvas.height = 200;
        gameContainer.appendChild(gameCanvas);

        const ctx = gameCanvas.getContext('2d');

        // Imágenes de recursos
        const dinoImg = new Image();
        dinoImg.src = 'img/dinosaurio/Run (1).png';

        const cactusImg = new Image();
        cactusImg.src = 'img/cactus/vecteezy_simple-cactus-cartoon-illustration_9514641.jpg';

        const bgImg = new Image();
        bgImg.src = 'img/vecteezy_desert-of-africa-or-wild-west-arizona-landscape_16265447.jpg';

        // Variables del juego
        let dino = { x: 50, y: 150, width: 50, height: 50, dy: 0 };
        let gravity = 1;
        let isJumping = false;
        let jumpHeight = -15;
        let obstacles = [];
        let gameInterval, obstacleInterval;

        const drawBackground = () => {
            ctx.drawImage(bgImg, 0, 0, gameCanvas.width, gameCanvas.height);
        };

        const drawDino = () => {
            ctx.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
        };

        const drawObstacles = () => {
            obstacles.forEach((obstacle) => {
                ctx.drawImage(cactusImg, obstacle.x, obstacle.y, 20, 30);
            });
        };

        const updateObstacles = () => {
            obstacles.forEach((obstacle) => {
                obstacle.x -= 5;
            });
            if (obstacles[0] && obstacles[0].x < 0) {
                obstacles.shift();
            }
        };

        const detectCollisions = () => {
            obstacles.forEach((obstacle) => {
                if (
                    dino.x + dino.width > obstacle.x &&
                    dino.x < obstacle.x + 20 &&
                    dino.y + dino.height > obstacle.y
                ) {
                    // Colisión detectada
                    alert('¡Has perdido!');
                    stopGame();
                }
            });
        };

        const updateGame = () => {
            ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
            drawBackground();
            if (isJumping) {
                dino.dy = jumpHeight;
            } else {
                if (dino.y + dino.height < 150) {
                    dino.dy += gravity;
                } else {
                    dino.dy = 0;
                    dino.y = 150;
                    isJumping = false;
                }
            }
            dino.y += dino.dy;
            updateObstacles();
            drawDino();
            drawObstacles();
            detectCollisions();
        };

        const createObstacle = () => {
            if (Math.random() < 0.05) {
                obstacles.push({ x: gameCanvas.width, y: 170 });
            }
        };

        const startGame = () => {
            gameInterval = setInterval(updateGame, 1000 / 60);
            obstacleInterval = setInterval(createObstacle, 1500);
        };

        const stopGame = () => {
            clearInterval(gameInterval);
            clearInterval(obstacleInterval);
            obstacles = [];
            dino = { x: 50, y: 150, width: 50, height: 50, dy: 0 };
        };

        // Iniciar juego al presionar botón
        document.getElementById('startGameButton').addEventListener('click', () => {
            stopGame();
            startGame();
        });

        // Reiniciar juego
        document.getElementById('restartGameButton').addEventListener('click', () => {
            stopGame();
            startGame();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === ' ' && dino.y === 150) {
                isJumping = true;
            }
        });
    };

    addDinoGame();
});
