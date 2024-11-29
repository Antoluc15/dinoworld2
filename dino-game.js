 window.addEventListener('load', () => {
    const startGame = () => {
        const body = document.body;
        body.innerHTML = <h2>¡Juego del Dinosaurio!</h2>
        <p>Presiona "Espacio" para comenzar</p>;

        document.addEventListener('keydown', (event) => {
            if (event.key === " " || event.key === "Enter") {
                body.innerHTML = 
                    <h2>¡Juega con el Dinosaurio!</h2>
                    <p>Presiona "Espacio" para saltar</p>
                    <canvas id="gameCanvas"></canvas>;
                startDinoGame();
            }
        });
    };

    const startDinoGame = () => {
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 200;

        // Imágenes de recursos
        const dinoImg = new Image();
        dinoImg.src = 'img/dinosaurio/Run (1).png';

        const cactusImg = new Image();
        cactusImg.src = 'img/cactus/vecteezy_simple-cactus-cartoon-illustration_9514641.jpg'; 

        const bgImg = new Image();
        bgImg.src = 'img/vecteezy_desert-of-africa-or-wild-west-arizona-landscape_16265447_346/vecteezy_desert-of-africa-or-wild-west-arizona-landscape_16265447.jpg'; // Ruta de fondo

        let dino = { x: 50, y: 150, width: 40, height: 40, dy: 0, speed: 5 };
        let gravity = 1;
        let isJumping = false;
        let jumpHeight = -15;
        let obstacles = [];
        let obstacleFrequency = 100;

        const drawBackground = () => {
            ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        };

        const drawDino = () => {
            ctx.drawImage(dinoImg, 0, 0, 60, 60, dino.x, dino.y, dino.width, dino.height); // Se puede ajustar según el tamaño del sprite
        };

        const drawObstacles = () => {
            obstacles.forEach((obstacle) => {
                ctx.drawImage(cactusImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            });
        };

        const updateObstacles = () => {
            obstacles.forEach((obstacle) => {
                obstacle.x -= 5; // Velocidad de los obstáculos
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
                    // Colisión detectada, reiniciar juego
                    alert('¡Has perdido!');
                    startGame();
                }
            });
        };

        const updateGame = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBackground(); // Dibujar fondo
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
                let height = 150 + Math.random() * 30;
                obstacles.push({ x: canvas.width, y: height, width: 20, height: 30 });
            }
        };

        setInterval(() => {
            updateGame();
            createObstacle();
        }, 1000 / 60);

        document.addEventListener('keydown', (event) => {
            if (event.key === " " && dino.y === 150) {
                isJumping = true;
            }
        });
    };

    startGame();
});
