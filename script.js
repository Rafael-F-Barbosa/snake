const canvas = document.querySelector("#snake-canvas");
let ctx = canvas.getContext('2d');
"use strict"

const canvasController = (() => {
    function setBackground(color = 'black') {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function createSquare(color, px, py) {
        ctx.fillStyle = color;
        ctx.fillRect(px, py, 20, 20)
    }
    return {
        setBackground,
        createSquare,
    }
})()

const game = (() => {
    
    let ax, ay;
    
    const getAppleX= ()=> ax;
    const getAppleY= ()=> ay; 


    function play() {
        snake.move();
    }
    function createApple() {
        ax = Math.floor(Math.random() * 23) * 20 + 20
        ay = Math.floor(Math.random() * 23) * 20 + 20

        canvasController.createSquare('red', ax, ay);
    }
    return {
        play,
        createApple,
        getAppleX,
        getAppleY,
    }
})();

const Snake = () => {

    let vel = 20;
    let headX = 100;
    let dx = 20;
    let headY = 100;
    let dy = 0;
    let trail = [headX, headY];
    let ate = true;


    const getHeadX = () => headX;
    const getHeadY = () => headY;

    const changeDirection = (e) => {
        switch (e.code) {
            case ('ArrowLeft'):
                dx = (-1 * vel);
                dy = 0;
                break;
            case 'ArrowRight':
                dx = (vel);
                dy = 0;
                break;
            case 'ArrowUp':
                dy = (-1 * vel);
                dx = 0;
                break;
            case 'ArrowDown':
                dy = (vel);
                dx = 0;
                break;
            default:
                console.log('Not a control key.');
                break;
        }
    }
    const move = () => {
        if (ate) {
            game.createApple();
            ate = false;
            console.log('oi');
            
        }
        else{
            canvasController.createSquare('black', trail.shift(), trail.shift());
        }
        
        

        headX += dx;
        headY += dy;

        if (headX > 479) {
            headX = 20
        }
        else if (headX < 1) {
            headX = 460;
        }
        if (headY > 479) {
            headY = 20;
        }
        else if (headY < 1) {
            headY = 460;
        }
        trail.push(headX, headY);

        if(headX == game.getAppleX() && headY == game.getAppleY())
        {
            ate = true;            
        }
            


        // draw in the head
        canvasController.createSquare('#00ff55', snake.getHeadX(), snake.getHeadY());



    }

    return {
        changeDirection,
        getHeadX,
        getHeadY,
        move,
    }
}





let snake = Snake();

window.addEventListener('keydown', snake.changeDirection);
canvasController.setBackground();

setInterval(() => { game.play() }, 50);



