window.addEventListener('load', () => {
    const startGameButton = document.getElementById('startGameButton');
    const restartGameButton = document.getElementById('restartGameButton');
    const dinoGameContainer = document.getElementById('dinoGameContainer');

    let gameSpeed = 2;  // Velocidad inicial de los obstáculos
    let obstacleFrequency = 100;  // Frecuencia de aparición de obstáculos
    let score = 0;  // Puntaje inicial
    let gameOver = false; // Estado del juego

    // Función para iniciar el juego
    const startGame = () => {
        gameOver = false; // Reiniciar estado de juego
        // Limpiar el contenedor del juego si ya existe algún juego previo
        dinoGameContainer.innerHTML = '';

        // Crear el título y las instrucciones dentro del contenedor del juego
        const title = document.createElement('h3');
        title.innerText = '¡Juega con el Dinosaurio! Presiona "Espacio" para saltar';
        dinoGameContainer.appendChild(title);

        // Crear el lienzo para el juego
        const canvas = document.createElement('canvas');
        canvas.id = 'gameCanvas';
        canvas.width = 800;
        canvas.height = 200;
        dinoGameContainer.appendChild(canvas);

        // Iniciar el juego
        startDinoGame();
    };

    // Función para reiniciar el juego
    const restartGame = () => {
        score = 0;
        gameSpeed = 2;
        obstacleFrequency = 100;
        gameOver = false;
        startGame();
    };

    // Función principal del juego
    const startDinoGame = () => {
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        // Cargar imágenes
        const dinoImg = new Image();
        dinoImg.src = 'img/dinosaurio/vecteezy_brontosaurus-jump-png-illustrations_23271261.png'; // Imagen del dinosaurio
        const cactusImg = new Image();
        cactusImg.src = 'img/cactus/vecteezy_simple-cactus-cartoon-illustration_9514641.jpg'; // Imagen de cactus
        const bgImg = new Image();
        bgImg.src = 'img/vecteezy_desert-of-africa-or-wild-west-arizona-landscape_16265447_346/vecteezy_desert-of-africa-or-wild-west-arizona-landscape_16265447.jpg'; // Imagen de fondo

        let dino = { x: 50, y: 150, width: 40, height: 40, dy: 0, speed: 5 };
        let gravity = 0.8;  // Gravedad más suave
        let isJumping = false;
        let jumpHeight = -10;  // Ajustar la altura del salto
        let obstacles = [];

        // Esperar a que las imágenes estén cargadas antes de iniciar el juego
        dinoImg.onload = () => {
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

            // Función para mostrar el mensaje de "Perdido"
            const showGameOverMessage = () => {
                ctx.font = '30px Arial';
                ctx.fillStyle = 'red';
                ctx.fillText('¡Has Perdido!', canvas.width / 2 - 100, canvas.height / 2);
                ctx.font = '20px Arial';
                ctx.fillText('Presiona "Reiniciar" para jugar de nuevo', canvas.width / 2 - 150, canvas.height / 2 + 40);
            };

            // Actualizar los obstáculos
            const updateObstacles = () => {
                obstacles.forEach((obstacle) => {
                    obstacle.x -= gameSpeed; // La velocidad de los obstáculos ahora depende de gameSpeed
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
                        // Colisión detectada, termina el juego
                        gameOver = true;
                    }
                });
            };

            // Actualizar el estado del juego
            const updateGame = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawBackground(); // Dibujar fondo

                if (!gameOver) {
                    // Gravedad y salto del dinosaurio
                    if (isJumping) {
                        dino.dy = jumpHeight;
                    } else {
                        if (dino.y + dino.height < 150) {
                            dino.dy += gravity;  // La gravedad influye en el salto
                        } else {
                            dino.dy = 0;
                            dino.y = 150;  // Asegurarse de que el dinosaurio vuelva al suelo
                            isJumping = false;
                        }
                    }
                    dino.y += dino.dy;

                    // Aumentar la velocidad y la frecuencia de los obstáculos con el tiempo
                    if (score % 100 === 0 && score !== 0) {
                        gameSpeed += 0.5;  // Aumentar la velocidad de los obstáculos
                        obstacleFrequency -= 5; // Reducir la frecuencia de aparición
                    }

                    updateObstacles();
                    drawDino();
                    drawObstacles();
                    detectCollisions();
                } else {
                    showGameOverMessage(); // Mostrar el mensaje de Game Over
                }
            };

            // Crear obstáculos
            const createObstacle = () => {
                if (Math.random() < 1 / obstacleFrequency) {
                    let height = 150 + Math.random() * 30;
                    obstacles.push({ x: canvas.width, y: height, width: 20, height: 30 });
                }
            };

            // Iniciar el loop del juego
            setInterval(() => {
                updateGame();
                createObstacle();
            }, 1000 / 60);

            // Detectar evento de salto
            document.addEventListener('keydown', (event) => {
                if (event.key === " " && dino.y === 150 && !gameOver) {  // Verificar que el dinosaurio esté en el suelo
                    isJumping = true;
                }
            });
        };

        // Cargar imágenes
        dinoImg.src = 'img/dinosaurio/vecteezy_brontosaurus-jump-png-illustrations_23271261.png'; // Imagen del dinosaurio
    };

    // Asignar eventos a los botones
    startGameButton.addEventListener('click', startGame);
    restartGameButton.addEventListener('click', restartGame);
});
