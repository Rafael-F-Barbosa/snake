"use strict"
const canvas = document.querySelector("#snake-canvas");
const HTMLapple = document.querySelector('#Apple')
let ctx = canvas.getContext('2d');
const body = document.querySelector('body');
const displayController = (() => {
    function setBackground(color = 'black') {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    function createSquare(color, px, py) {
        ctx.fillStyle = color;
        ctx.fillRect(px+1, py+1, 18, 18)
    }
    
    function createApple(px, py){
        ctx.drawImage(HTMLapple, px+1, py+1, 18, 18);
    }

    function writeScore(score = 0) {
        
        ctx.beginPath();
        ctx.font = '20px Arial';
        ctx.fillStyle = 'black'
        ctx.fillRect(200, 0, 120, 20);
        
        displayController.createSquare('#363636', 200, 0);
        displayController.createSquare('#363636', 220, 0);
        displayController.createSquare('#363636', 240, 0);
        displayController.createSquare('#363636', 260, 0);
        displayController.createSquare('#363636', 280, 0);
        displayController.createSquare('#363636', 300, 0);

        ctx.beginPath();
        ctx.font = '20px Arial';
        ctx.fillStyle = '#2ae600'
        ctx.fillText(`Score: ${score}`, 200, 18)
    }
    function borders() {
        for (let i = 0; i < 500; i += 20) {
            createSquare('#363636', i, 0);
            createSquare('#363636', 0, i);
        }
        for (let i = 0; i < 500; i += 20) {
            createSquare('#363636', i, 480);
            createSquare('#363636', 480, i);
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

        saveBtn.addEventListener('click', () => {

            inputName = document.createElement('input');
            inputName.placeholder = 'Player Name';
            inputName.classList = 'save-input';


            const parent = saveBtn.parentElement;
            parent.replaceChild(inputName, saveBtn);

            inputName.addEventListener('keydown', (e) => {
                if (e.key == 'Enter') {
                    if (inputName.value !== '' && !saved) {
                        Firebase.addScore(inputName.value, game.pontuation);
                        saved = true;

                        restartBtn.classList.add('hide');
                        inputName.classList.add('hide');

                        displayController.setBackground();
                        displayController.borders();
                        game.restart(snake);
                        Firebase.showScores();
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

        writeScore(game.pontuation);


        restartBtn.addEventListener('click', () => {

            game.restart(snake);

            displayController.setBackground();
            displayController.borders();

            restartBtn.classList.add('hide');
            if (saveBtn)
                saveBtn.classList.add('hide');
            if (inputName)
                inputName.classList.add('hide');

        });


    }
    function showScores(scoresList) {
        const exists = document.querySelector('ol');
        if(exists){
            exists.parentElement.removeChild(exists);
        }

        const ol = document.createElement('ol');
        const h2 = document.createElement('h2');
        h2.textContent = 'Best Scores';
        
        ol.appendChild(h2);
        scoresList.forEach((player)=>{
            const li = document.createElement('li');
            li.textContent = player.PlayerName + ' ' + player.PlayerScore + ' pts.';
            ol.appendChild(li)
        })
        const main = document.querySelector('main');
        main.appendChild(ol);
            
    }
    return {
        setBackground,
        createSquare,
        borders,
        endGame,
        writeScore,
        showScores,
        createApple
    }
})()

const game = (() => {

    let ax, ay;
    let pontuation = 0;
    let gameVel = 65;

    const getAppleX = () => ax;
    const getAppleY = () => ay;

    function restart(snake) {
        snake.setAlive(true);
        snake.setAte(true);
        snake.setVel(20);
        snake.setHeadX(100);
        snake.setHeadY(100);
        snake.setTrail(100, 100);
        game.pontuation = 0;
    }

    function play() {
        displayController.writeScore();
        setInterval(() => { snake.move() }, gameVel);
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

        // displayController.createSquare('red', ax, ay);
        displayController.createApple(ax, ay);
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
    let moveComplete = true;


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
        if ((e.code === 'ArrowLeft' || e.code === 'KeyA') && moveComplete) {
            if (dx != vel) {
                dx = (-1 * vel);
                moveComplete = false;
            }
            dy = 0;

        }
        else if ( (e.code === 'ArrowRight'|| e.code === 'KeyD') && moveComplete) {
            if (dx != (-1 * vel)) {
                dx = (vel)
                moveComplete = false;
            }
            dy = 0;

        }
        else if ( (e.code === 'ArrowUp'|| e.code === 'KeyW') && moveComplete) {
            if (dy != vel) {
                dy = (-1 * vel);
                moveComplete = false;
            }
            dx = 0;
        }
        else if ( (e.code === 'ArrowDown'|| e.code === 'KeyS') && moveComplete) {
            if (dy != (-1 * vel)) {
                dy = (vel);
                moveComplete = false;
            }
            dx = 0;
        }
        else {
            console.log('Invalid key')
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

        moveComplete = true;

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
            displayController.writeScore(game.pontuation);
        }
        displayController.createSquare('#2ae600', snake.getHeadX(), snake.getHeadY());

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

const Firebase = (() => {
    function showScores() {
        let bestScores = []
        db.collection('snake-scores').orderBy('OrderAux').limit(10).get().then( (snapshot)=>{
            snapshot.docs.forEach( (doc)=>{
                bestScores.push(doc.data())
            })
            displayController.showScores(bestScores)
        })
    }
    function addScore(name, score) {
        if (!name && !score)
            return;
        db.collection('snake-scores').add({
            PlayerName: name,
            PlayerScore: score,
            OrderAux: 1000000000 - score,
        })
    }

    return {
        showScores,
        addScore,
    }
})()

let snake = Snake();

window.addEventListener('keydown', (e) => {
    snake.changeDirection(e);
});
displayController.setBackground();
displayController.borders();

game.play();

Firebase.showScores();


