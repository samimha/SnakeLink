document.addEventListener("DOMContentLoaded", function (event) {
    const socket = new WebSocket("ws://localhost:8080/SnakeLink/actions");
    const canvas = document.querySelector('#game');
    var context = canvas.getContext('2d');
    socket.addEventListener("open", function (e) {
        socket.send("host");
    });
    var grid = canvas.width / 25;
    var snake = {
        x: grid * 10,
        y: grid * 10,
        dx: grid,
        dy: 0,
        cells: [],
        maxCells: 4
    };
    var count = 0;
    var apple = {
        x: grid * 10 * 2,
        y: grid * 10 * 2
    };
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    // game loop
    function loop() {
        requestAnimationFrame(loop);
        // slow game loop to 15 fps instead of 60 - 60/15 = 4
        if (++count < 4) {
            return;
        }
        count = 0;
        context.clearRect(0, 0, canvas.width, canvas.height);
        snake.x += snake.dx;
        snake.y += snake.dy;
        // wrap snake position on edge of screen
        if (snake.x < 0) {
            snake.x = canvas.width - grid;
        }
        else if (snake.x >= canvas.width) {
            snake.x = 0;
        }
        if (snake.y < 0) {
            snake.y = canvas.height - grid;
        }
        else if (snake.y >= canvas.height) {
            snake.y = 0;
        }
        // keep track of where snake has been. front of the array is always the head
        snake.cells.unshift({ x: snake.x, y: snake.y });
        // remove cells as we move away from them
        if (snake.cells.length > snake.maxCells) {
            snake.cells.pop();
        }
        // draw apple
        context.fillStyle = 'red';
        context.fillRect(apple.x, apple.y, grid - 1, grid - 1);
        // draw snake
        context.fillStyle = 'blue';
        snake.cells.forEach(function (cell, index) {
            context.fillRect(cell.x, cell.y, grid - 1, grid - 1);
            // snake ate apple
            if (cell.x === apple.x && cell.y === apple.y) {
                snake.maxCells++;
                apple.x = getRandomInt(0, 25) * grid;
                apple.y = getRandomInt(0, 25) * grid;
            }
            // check collision with all cells after this one (modified bubble sort)
            for (var i = index + 1; i < snake.cells.length; i++) {

                // collision. reset game
                if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                    resetGame();
                }
            }
        });
    }
    function resetGame() {
        snake.x = grid * 10;
        snake.y = grid * 10;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;
        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
    }
    socet.addEventListener("message",function(e){
        if (event.defaultPrevented) {
            return; // Do nothing if the event was already processed
        }

        switch (e.data) {
            case "1-down":
                if (snake.dy === 0) {
                    snake.dy = grid;
                    snake.dx = 0;
                }
                break;
            case "1-up":
                if (snake.dy === 0) {
                    snake.dy = -grid;
                    snake.dx = 0;
                }
                break;
            case "1-left":
                if (snake.dx === 0) {
                    snake.dx = -grid;
                    snake.dy = 0;
                }
                break;
            case "1-right":
                if (snake.dx === 0) {
                    snake.dx = grid;
                    snake.dy = 0;
                }
                break;
            default:
                return; // Quit when this doesn't handle the key event.
        }
    });
    window.addEventListener("keydown", function (event) {
        if (event.defaultPrevented) {
            return; // Do nothing if the event was already processed
        }

        switch (event.key) {
            case "ArrowDown":
                if (snake.dy === 0) {
                    snake.dy = grid;
                    snake.dx = 0;
                }
                break;
            case "ArrowUp":
                if (snake.dy === 0) {
                    snake.dy = -grid;
                    snake.dx = 0;
                }
                break;
            case "ArrowLeft":
                if (snake.dx === 0) {
                    snake.dx = -grid;
                    snake.dy = 0;
                }
                break;
            case "ArrowRight":
                if (snake.dx === 0) {
                    snake.dx = grid;
                    snake.dy = 0;
                }
                break;
            default:
                return; // Quit when this doesn't handle the key event.
        }

        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
    }, true);
    requestAnimationFrame(loop);
});