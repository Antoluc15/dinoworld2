document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('game-container');
    container.style.position = 'relative';
    container.style.width = '800px';
    container.style.height = '200px';
    container.style.backgroundColor = '#f7f7f7';
    container.style.border = '2px solid #ccc';
    container.style.overflow = 'hidden';
    container.style.margin = '0 auto';

    const dino = document.createElement('div');
    dino.style.position = 'absolute';
    dino.style.width = '40px';
    dino.style.height = '40px';
    dino.style.backgroundColor = 'black';
    dino.style.bottom = '10px';
    dino.style.left = '50px';
    container.appendChild(dino);

    const cactus = document.createElement('div');
    cactus.style.position = 'absolute';
    cactus.style.width = '20px';
    cactus.style.height = '40px';
    cactus.style.backgroundColor = 'green';
    cactus.style.bottom = '10px';
    cactus.style.right = '0';
    container.appendChild(cactus);

    let isJumping = false;
    let dinoBottom = 10;
    const gravity = 2;

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

    function moveCactus() {
        let cactusLeft = 800;

        function move() {
            cactusLeft -= 10;
            cactus.style.left = cactusLeft + 'px';

            if (cactusLeft < -20) {
                cactusLeft = 800;
            }

            if (
                cactusLeft > 50 && cactusLeft < 90 &&
                dinoBottom <= 50
            ) {
                alert('¡Perdiste!');
                cactusLeft = 800;
            }

            requestAnimationFrame(move);
        }
        move();
    }

    moveCactus();

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            jump();
        }
    });
});

