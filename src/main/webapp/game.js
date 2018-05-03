document.addEventListener("DOMContentLoaded", function (event) {

    let wsUrl = document.location.host + "/SnakeLink/actions";
    //let wsUrl = document.location.host + "/actions" 
    console.log(wsUrl);
    const socket = new WebSocket('ws://' + wsUrl);
    const canvas = document.querySelector('#game');
    const showKey = document.querySelector('#show-key');
    const playersList = document.querySelector("#players-list");
    let select = document.querySelector("#size");
    const settingsDiv = document.querySelector("#settings-div");
    const arena = document.querySelector("#arena");
    let players = [];
    let player;
    const colors = ["YELLOW","LIME","ORANGERED","AQUA","BLUE","FUCHSIA","DEEPPINK"];
    
    var context = canvas.getContext('2d');
    let hostKey = getRandomInt(1000,9999);
    socket.addEventListener("open", function (e) {
        socket.send("host "+hostKey);
        showKey.textContent = "Game "+hostKey;
    });
    let size = select.value;
    select.addEventListener('change', function(e){
        size = select.value;
        console.log(size);
        canvas.width = 16 * size;
        canvas.height = 16 * size;
        grid = canvas.width / size;
        arena.classList.remove("hidden");
        //resetGame();
    });
    
    let grid = canvas.width / size;
    
    class Snake {
        constructor() {
            this.x = grid * 10;
            this.y = grid * 10;
            this.dx = grid;
            this.dy = 0;
            this.cells = [];
            this.maxCells = 4
        }
    };
    let snakes = [];
    //snakes.push(new Snake());
    //snakes.push(new Snake());
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
        if (++count < 3) {
            return;
        }
        count = 0;
        context.clearRect(0, 0, canvas.width, canvas.height);
        // wrap snake position on edge of screen
        for (let i = 0; i < snakes.length; i++) {

            snakes[i].x += snakes[i].dx;
            snakes[i].y += snakes[i].dy;
            if (snakes[i].x < 0) {
                snakes[i].x = canvas.width - grid;
            }
            else if (snakes[i].x >= canvas.width) {
                snakes[i].x = 0;
            }
            if (snakes[i].y < 0) {
                snakes[i].y = canvas.height - grid;
            }
            else if (snakes[i].y >= canvas.height) {
                snakes[i].y = 0;
            }
            snakes[i].cells.unshift({ x: snakes[i].x, y: snakes[i].y });
            if (snakes[i].cells.length > snakes[i].maxCells) {
                snakes[i].cells.pop();
            }
            // draw apple
            context.fillStyle = 'red';
            context.fillRect(apple.x, apple.y, grid - 1, grid - 1);
            // draw snake
            context.fillStyle = colors[i];


            snakes[i].cells.forEach(function (cell, index) {
                context.fillRect(cell.x, cell.y, grid - 1, grid - 1);
                // snake ate apple
                if (cell.x === apple.x && cell.y === apple.y) {
                    snakes[i].maxCells++;
                    apple.x = getRandomInt(0, size) * grid;
                    apple.y = getRandomInt(0, size) * grid;
                }
                // check collision with all cells after this one (modified bubble sort)
                for (var x = index + 1; x < snakes[i].cells.length; x++) {

                    // collision. reset game
                    if (cell.x === snakes[i].cells[x].x && cell.y === snakes[i].cells[x].y) {
                        resetGame(snakes[i]);
                    }
                }
            });
        }
    }
    function resetGame(snake) {
        snake.x = grid * 10;
        snake.y = grid * 10;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;
        apple.x = getRandomInt(0, size) * grid;
        apple.y = getRandomInt(0, size) * grid;
    }
    function newPlayer(info){
        if(!players.includes(info.name)&&info.name!=0){
            players.push(info.name);
            let li = document.createElement("li");
            let p = document.createElement("p");
            let colBox = document.createElement("div");
            colBox.classList.add("color-box");
            colBox.style.backgroundColor = info.color;
            p.textContent = info.name;
            li.appendChild(p);
            li.appendChild(colBox);
            playersList.appendChild(li);
            snakes.push(new Snake());
        }
    }
    socket.addEventListener("message", function (e) {
        if (e.defaultPrevented) {
            return; // Do nothing if the event was already processed
        }
        //console.log(e.data);
        
        let data = e.data.split("-");
        let id = data[0]-1;
        let info = {
            name : data[0],
            color : colors[id]
        }
        newPlayer(info);
        switch (data[1]) {
            case "down":
                if (snakes[id].dy === 0) {
                    snakes[id].dy = grid;
                    snakes[id].dx = 0;
                }
                break;
            case "up":
                if (snakes[id].dy === 0) {
                    snakes[id].dy = -grid;
                    snakes[id].dx = 0;
                }
                break;
            case "left":
                if (snakes[id].dx === 0) {
                    snakes[id].dx = -grid;
                    snakes[id].dy = 0;
                }
                break;
            case "right":
                if (snakes[id].dx === 0) {
                    snakes[id].dx = grid;
                    snakes[id].dy = 0;
                }
                break;
            default:
                return; // Quit when this doesn't handle the key event.
        }
    });
    requestAnimationFrame(loop);
});