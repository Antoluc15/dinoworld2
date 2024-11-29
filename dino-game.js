window.addEventListener('load', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startButton');
    let gameInterval;
    let obstacles = [];
    let dino = { x: 50, y: 150, width: 40, height: 40, dy: 0, speed: 5 };
    const gravity = 1;
    const jumpHeight = -15;
    let isJumping = false;

    const dinoImg = new Image();
    dinoImg.src = 'img/dinosaurio/Run (1).png';

    const cactusImg = new Image();
    cactusImg.src = 'img/cactus/vecteezy_simple-cactus-cartoon-illustration_9514641.jpg';

    const bgImg = new Image();
    bgImg.src = 'img/vecteezy_desert-of-africa-or-wild-west-arizona-landscape_16265447.jpg';

    const startGame = () => {
        canvas.style.display = 'block';
        startButton.style.display = 'none';
        obstacles = [];
        dino = { x: 50, y: 150, width: 40, height: 40, dy: 0, speed: 5 };

        if (gameInterval) {
            clearInterval(gameInterval);
        }

        gameInterval = setInterval(() => {
            updateGame();
            createObstacle();
        }, 1000 / 60);
    };

    const endGame = () => {
        alert('¡Has perdido!');
        clearInterval(gameInterval);
        canvas.style.display = 'none';
        startButton.style.display = 'block';
    };

    const drawBackground = () => {
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    };

    const drawDino = () => {
        ctx.drawImage(dinoImg, 0, 0, 60, 60, dino.x, dino.y, dino.width, dino.height);
    };

    const drawObstacles = () => {
        obstacles.forEach((obstacle) => {
            ctx.drawImage(cactusImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
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
                dino.x < obstacle.x + obstacle.width &&
                dino.y + dino.height > obstacle.y
            ) {
                endGame();
            }
        });
    };

    const updateGame = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
            const height = 150 + Math.random() * 30;
            obstacles.push({ x: canvas.width, y: height, width: 20, height: 30 });
        }
    };

    document.addEventListener('keydown', (event) => {
        if (event.key === " " && dino.y === 150) {
            isJumping = true;
        }
    });

    startButton.addEventListener('click', startGame);
});
