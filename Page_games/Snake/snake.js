// CLASS //


class Snake{
    constructor(x, y, size){
        this.x = x;
        this.y = y;
        this.size = size;
        this.tail = [{x: this.x, y: this.y}];
        this.head = this.tail[this.tail.length - 1];
        this.rotateX = 0;
        this.rotateY = 1;
    }

    move(){
        var newRect;
        if(this.rotateX == 1){
            newRect = {
                x: this.tail[this.tail.length - 1].x + this.size,
                y: this.tail[this.tail.length - 1].y
            }
        }else if(this.rotateX == -1){
            newRect = {
                x: this.tail[this.tail.length - 1].x - this.size,
                y: this.tail[this.tail.length - 1].y
            }
        }else if(this.rotateY == 1){
            newRect = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y + this.size
            }
        }else if(this.rotateY == -1){
            newRect = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y - this.size
            }
        }

        this.tail.shift();
        this.tail.push(newRect);
        this.head = this.tail[this.tail.length - 1];
    }
}


class Apple{
    constructor(){
        this.x = Math.floor(Math.random() * canvas.width / snake.size) * snake.size;
        this.y = Math.floor(Math.random() * canvas.height / snake.size) * snake.size;

        this.color = "red";
        this.size = snake.size;
    }
}

class DeathApple{  // Kill the snake
    constructor(){
        this.x = Math.floor(Math.random() * canvas.width / snake.size) * snake.size;
        this.y = Math.floor(Math.random() * canvas.height / snake.size) * snake.size;

        this.color = "black";
        this.size = snake.size;
    }
}

class MagicApple{  // Reverse the controls  -- Magic apple can spawn on death apple
    constructor(){
        this.x = Math.floor(Math.random() * canvas.width / snake.size) * snake.size;
        this.y = Math.floor(Math.random() * canvas.height / snake.size) * snake.size;

        this.color = "yellow";
        this.size = snake.size;
    }
}


// INSTRUCTIONS //


const troll = false;  // just to say 'bruh' all the time lol

var canvas = document.getElementById("canvas");
var snakeEatApple = new Audio("Manger.mp3");
var snakeDied = new Audio("Bruh.mp3");

const FPS = 10;
var snakeStartX = 20;
var snakeStartY = 20;
var snakeSize = 20;

var snake = new Snake(snakeStartX, snakeStartY, snakeSize);
var apple = new Apple();
const nbOBLDeathApple = 10;
const nbOBLMagicApple = 5;
var numDeathApple = [];
var numMagicApple = [];
var hasReverse = false;  // Don't change
var deathCounter = 0;
var canvasContext = canvas.getContext('2d');

var input_up = 'Z';
var input_down = 'S';
var input_left = 'Q';
var input_right = 'D';
var textControl = document.getElementById("control_text");

var ascii_up = input_up.charCodeAt(0);
var ascii_down = input_down.charCodeAt(0);
var ascii_left = input_left.charCodeAt(0);
var ascii_right = input_right.charCodeAt(0);


window.onload = ()=>{
    gameloop();
}

function gameloop(){
    setInterval(show, 1000/FPS);  // after '1000/' is the FPS

    setInterval(()=>{
        if (numDeathApple.length < nbOBLDeathApple){  // Game should have 'nbDeathApple' death apple
            death = new DeathApple();
            numDeathApple.push(death);
        }
    }, 6000)

    setInterval(()=>{
        if (numMagicApple.length < nbOBLMagicApple){  // Game should have 'nbMagicApple' magic apple
            magic = new MagicApple();
            numMagicApple.push(magic);
        }
    }, 12000)

    if(troll){  // Just to hear unlimited "bruh"
        setInterval(()=>{
            snakeDied.currentTime = 0;
            snakeDied.play();
        }, 500)
    }
}

function show(){
    update();
    draw();
}

function update(){
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    eatMagicApple();
    printControls();
    snake.move();
    snakeKillItself();
    eatDeathApple();
    eatApple();
    checkHitWall();
}

function draw(){
    for(var i = 0; i < snake.tail.length; i++){
        createRect(snake.tail[i].x, snake.tail[i].y,
            snake.size - 5, snake.size - 5, 'white');
    }

    createRect(apple.x, apple.y, apple.size, apple.size, apple.color);
    if (numDeathApple.length > 0){
        for (var i = 0; i < numDeathApple.length; i++){
            createRect(numDeathApple[i].x, numDeathApple[i].y, numDeathApple[i].size, numDeathApple[i].size, numDeathApple[i].color);
        }
    }
    if (numMagicApple.length > 0){
        for (var i = 0; i < numMagicApple.length; i++){
            createRect(numMagicApple[i].x, numMagicApple[i].y, numMagicApple[i].size, numMagicApple[i].size, numMagicApple[i].color);
        }
    }

    canvasContext.font = "15px Arial";
    canvasContext.fillStyle = "#00FF0F";
    canvasContext.fillText("Score : " + (snake.tail.length - 1), canvas.width - 80, 30);
    canvasContext.fillText("Death : " + (deathCounter), canvas.width - 80, 50);
}

function checkHitWall(){
    var headTail = snake.tail[snake.tail.length - 1];
    if(headTail.x == - snake.size){
        headTail.x = canvas.width - snake.size;
    }else if(headTail.x == canvas.width){
        headTail.x = 0;
    }else if(headTail.y == - snake.size){
        headTail.y = canvas.height - snake.size;
    }else if(headTail.y == canvas.height){
        headTail.y = 0;
    }
}

function eatApple(){
    if(snake.tail[snake.tail.length - 1].x == apple.x &&
        snake.tail[snake.tail.length - 1].y == apple.y){
            snake.tail[snake.tail.length] = {x: apple.x, y: apple.y};
            apple = new Apple();
            snakeEatApple.currentTime = 0;
            snakeEatApple.play();
    }
}

function eatDeathApple(){
    if (numDeathApple.length > 0){
        for (var i = 0; i < numDeathApple.length; i++){
            if(snake.tail[snake.tail.length - 1].x == numDeathApple[i].x &&
                snake.tail[snake.tail.length - 1].y == numDeathApple[i].y){
                    snakeDeath();
            }
        }
    }
}

function eatMagicApple(){
    if (numMagicApple.length > 0){
        for (var i = 0; i < numMagicApple.length; i++){
            if(snake.tail[snake.tail.length - 1].x == numMagicApple[i].x &&
                snake.tail[snake.tail.length - 1].y == numMagicApple[i].y){
                    snake.tail[snake.tail.length] = {x: numMagicApple[i].x, y: numMagicApple[i].y};
                    numMagicApple.splice(i, 1);  // remove this magic apple from the game and the list
                    snakeEatApple.currentTime = 0;
                    snakeEatApple.play();
                    reverseControls();
            }
        }
    }
}

function snakeKillItself(){
    if (snake.tail.length > 1){
        for(var i = 0; i < snake.tail.length - 1; i++){
            if(snake.head.x == snake.tail[i].x && snake.head.y == snake.tail[i].y){
                snakeDeath();
            }
        }
    }
}

function createRect(x, y, width, height, color){
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
}

function clearDeathApple(){
    numDeathApple = [];  // clear all death apple in the game
}

function clearMagicApple(){
    numMagicApple = [];  // clear all magic apple in the game
}

function snakeDeath(){
    clearDeathApple();
    clearMagicApple();
    apple = new Apple();
    snake = new Snake(snakeStartX, snakeStartY, snakeSize);
    deathCounter += 1;
    if(hasReverse){
        reverseControls();
    }
    snakeDied.currentTime = 0;
    snakeEatApple.pause();  // It can be
    snakeDied.play();
}


// BUTTON VALUES AND CONTROLS //


function getValue() {
    // get the values of controls
    input_up = document.getElementById("change_Up").value;
    input_down = document.getElementById("change_Down").value;
    input_left = document.getElementById("change_Left").value;
    input_right = document.getElementById("change_Right").value;

    ascii_up = input_up.toUpperCase().charCodeAt(0);
    ascii_down = input_down.toUpperCase().charCodeAt(0);
    ascii_left = input_left.toUpperCase().charCodeAt(0);
    ascii_right = input_right.toUpperCase().charCodeAt(0);

    printControls();
}

function directionWithArrows(){
    ascii_up = 38;
    ascii_down = 40;
    ascii_left = 37;
    ascii_right = 39;

    printControls();
}

function reverseControls(){
    let up_temp = input_up;
    let down_temp = input_down;
    let left_temp = input_left;
    let right_temp = input_right;

    if(ascii_up == 38){
        ascii_up = 40;
        ascii_down = 38;
        ascii_left = 39;
        ascii_right = 37;
    }else if(ascii_up == 40){
        ascii_up = 38;
        ascii_down = 40;
        ascii_left = 37;
        ascii_right = 39;
    }else{
        input_up = down_temp;
        input_down = up_temp;
        input_left = right_temp;
        input_right = left_temp;

        ascii_up = input_up.toUpperCase().charCodeAt(0);
        ascii_down = input_down.toUpperCase().charCodeAt(0);
        ascii_left = input_left.toUpperCase().charCodeAt(0);
        ascii_right = input_right.toUpperCase().charCodeAt(0);
    }

    if(hasReverse){  // Because when we take a yellow apple, if we die controls are not reset
        hasReverse = false;
    }else{
        hasReverse = true;
    }
}

function printControls(){
    if (ascii_up == 38 || ascii_up == 40){
        if (hasReverse){
            textControl.innerText = "- Up : Down_arrow\n- Down : Up_arrow\n- Left : Right_arrows\n- Right : Left_arrow";
        }else{
            textControl.innerText = "- Up : Up_arrow\n- Down : Down_arrow\n- Left : Left_arrows\n- Right : Right_arrow";
        }
    }else{
        textControl.innerText = "- Up : "+input_up+"\n- Down : "+input_down+"\n- Left : "+input_left+"\n- Right : "+input_right;
    }
}


window.addEventListener("keydown", (event)=>{
     setTimeout(()=>{
        if(event.keyCode == ascii_left && snake.rotateX != 1){  // Left arrow
            snake.rotateX = -1;
            snake.rotateY = 0;
        }else if(event.keyCode == ascii_up && snake.rotateY != 1){  // Up Arrow
            snake.rotateX = 0;
            snake.rotateY = -1;
        }else if(event.keyCode == ascii_right && snake.rotateX != 1){  // Right Arrow
            snake.rotateX = 1;
            snake.rotateY = 0;
        }else  if(event.keyCode == ascii_down && snake.rotateY != 1){  // Down Arrow
            snake.rotateX = 0;
            snake.rotateY = 1;
        }
     }, 1)
})