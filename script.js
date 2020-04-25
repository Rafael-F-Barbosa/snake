"use strict"
const canvas = document.querySelector("#snake-canvas");
let ctx = canvas.getContext('2d');
const body = document.querySelector('body');
const displayController = (() => {
    function setBackground(color = 'black') {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    function createSquare(color, px, py) {
        ctx.fillStyle = color;
        ctx.fillRect(px, py, 20, 20)
    }
    function writePontuation(score){
        createSquare('grey',200, 0);
        createSquare('grey',220, 0);
        createSquare('grey',240, 0);
        createSquare('grey',260, 0);
        createSquare('grey',280, 0);
        createSquare('grey',300, 0);
        

        ctx.beginPath();
        ctx.font = '20px Arial';
        ctx.fillStyle = 'red'
        ctx.fillText(`Score: ${score}`, 200, 20)
    }
    function borders() {
        for (let i = 0; i < 500; i += 20) {
            createSquare('grey', i, 0);
            createSquare('grey', 0, i);
        }
        for (let i = 0; i < 500; i += 20) {
            createSquare('grey', i, 480);
            createSquare('grey', 480, i);
        }
    }
    function endGame(game) {
        const main = document.querySelector('main');
        
        let saved = false;
        // save score button
        const saveBtn = document.createElement('button');
        saveBtn.classList.add('save-button')
        saveBtn.textContent = 'save';

        let inputName = null;

        saveBtn.addEventListener('click',()=>{

            inputName = document.createElement('input');
            inputName.placeholder = 'Player Name';
            inputName.classList   = 'save-input';


            const parent = saveBtn.parentElement;
            parent.replaceChild(inputName, saveBtn);

            inputName.addEventListener('keydown', (e)=>{
                if(e.key == 'Enter')
                {   
                    if(inputName.value !== '' && !saved){
                        Firebase.addScore(inputName.value, game.pontuation);
                        saved = true;
                        
                        restartBtn.classList.add('hide');
                        inputName.classList.add('hide');


                        displayController.setBackground();
                        displayController.borders();
                        game.restart(snake);

                    }
                }
            })
        })


        main.appendChild(saveBtn);

        // restart button
        
        const restartBtn = document.createElement('button');
        restartBtn.classList.add('restart-button')
        restartBtn.textContent = 'restart';
        main.appendChild(restartBtn);
        
        writePontuation(game.pontuation);
        

        restartBtn.addEventListener('click', () => {
            
            game.restart(snake);

            displayController.setBackground();
            displayController.borders();

            restartBtn.classList.add('hide');
            if(saveBtn)
                saveBtn.classList.add('hide');
            if(inputName)
                inputName.classList.add('hide');
            
        });


    }
    function showScores(player){
        const scores = document.querySelector('ol');
        const li = document.createElement('li');
        li.textContent = player.PlayerName + ' '+ player.PlayerScore +' pts.';
        scores.appendChild(li)
    }

    return {
        setBackground,
        createSquare,
        borders,
        endGame,
        writePontuation,
        showScores,
    }
})()

const game = (() => {

    let ax, ay;
    let pontuation = 0;

    const getAppleX = () => ax;
    const getAppleY = () => ay;

    function restart(snake){
        snake.setAlive(true);
        snake.setAte(true);
        snake.setVel(20);
        snake.setHeadX(100);
        snake.setHeadY(100);
        snake.setTrail(100, 100);
        game.pontuation = 0;
    }

    function play() {
        setInterval(() => { snake.move() }, 80);
    }
    function createApple() {
        let notValidPlace;
        do {
            notValidPlace = false;
            ax = Math.floor(Math.random() * 23) * 20 + 20
            ay = Math.floor(Math.random() * 23) * 20 + 20
            for (let i = 0; i < snake.getTrail().length; i += 2) {
                if (ax == snake.getTrail()[i] &&
                    ay == snake.getTrail()[i + 1]) {
                    notValidPlace = true;
                }
            }
        } while (notValidPlace)

        displayController.createSquare('red', ax, ay);
    }
    return {
        play,
        createApple,
        getAppleX,
        getAppleY,
        pontuation,
        restart,
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
    let alive = true;


    const getHeadX = () => headX;
    const getHeadY = () => headY;
    const getTrail = () => trail;

    const setAlive = (al) => { alive = al };
    const setTrail = (TrX, TrY) => { trail = [TrX, TrY] };
    const setVel = (v) => { vel = v };
    const setHeadX = (x) => { headX = x };
    const setHeadY = (y) => { headY = y };
    const setAte = (a) => ate = a;

    const changeDirection = (e) => {
        switch (e.code) {
            case ('ArrowLeft'):
                if (dx != vel)
                    dx = (-1 * vel);
                dy = 0;
                break;
            case 'ArrowRight':
                if (dx != (-1 * vel))
                    dx = (vel);
                dy = 0;
                break;
            case 'ArrowUp':
                if (dy != vel)
                    dy = (-1 * vel);
                dx = 0;
                break;
            case 'ArrowDown':
                if (dy != (-1 * vel))
                    dy = (vel);
                dx = 0;
                break;
            default:
                console.log('Not a control key.');
                break;
        }
    }
    const move = () => {

        if (!alive)
            return;
        if (ate) {
            game.createApple();
            ate = false;
        }
        else {
            displayController.createSquare('black', trail.shift(), trail.shift());
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

        for (let i = 0; i < snake.getTrail().length; i += 2) {
            if (headX == snake.getTrail()[i] &&
                headY == snake.getTrail()[i + 1]) {
                displayController.endGame(game);
                alive = false;
            }

        }
        trail.push(headX, headY);

        if (headX == game.getAppleX() && headY == game.getAppleY()) {
            ate = true;
            game.pontuation += 10;
            displayController.writePontuation(game.pontuation);
        }
        displayController.createSquare('#00ff55', snake.getHeadX(), snake.getHeadY());

    }

    return {
        changeDirection,
        getHeadX,
        getHeadY,
        getTrail,
        move,
        setAlive,
        setTrail,
        setVel,
        setHeadX,
        setHeadY,
        setAte,
    }
}

const Firebase  = ( ()=>{
    function showScores(){
        // static adition
        // db.collection('snake-scores').get().then( (snapshot)=>{
        //     snapshot.docs.forEach( (doc)=>{
        //         displayController.showScores(doc.data())
        //     })
        // })
        db.collection('snake-scores').limit(10).orderBy('OrderAux').onSnapshot( snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach( change=>{
                if(change.type == 'added'){
                    displayController.showScores(change.doc.data());
                }
            })
        })


    }
    function addScore(name, score){
        if(!name && !score)
            return;
        db.collection('snake-scores').add({
            PlayerName: name,
            PlayerScore: score,
            OrderAux: 1000000000-score,
        })
    }
    
    return {
        showScores,
        addScore,
    }
}) ()

let snake = Snake();

window.addEventListener('keydown', snake.changeDirection);
displayController.setBackground();
displayController.borders();

game.play();

Firebase.showScores();


