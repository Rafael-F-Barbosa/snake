"use strict"
const canvas = document.querySelector("#snake-canvas");
const HTMLapple = document.querySelector('#Apple')
let ctx = canvas.getContext('2d');
const body = document.querySelector('body');
const main = document.querySelector('main');


const displayController = (() => {
    function setBackground(color = 'black') {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    function createSquare(color, px, py) {
        ctx.fillStyle = color;
        ctx.fillRect(px + 1, py + 1, 18, 18)
    }

    function createApple(px, py) {
        ctx.drawImage(HTMLapple, px + 1, py + 1, 18, 18);
    }
    function writeScore(score = 0) {
        ctx.beginPath();
        ctx.font = '20px Arial';
        ctx.fillStyle = 'black'
        ctx.fillRect(200, 0, 120, 20);
        createSquare('#363636', 200, 0);
        createSquare('#363636', 220, 0);
        createSquare('#363636', 240, 0);
        createSquare('#363636', 260, 0);
        createSquare('#363636', 280, 0);
        createSquare('#363636', 300, 0);
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
    function createSaveButton() {
        const saveBtn = document.createElement('button');
        saveBtn.classList.add('save-button')
        saveBtn.textContent = 'save';
        return saveBtn;
    }
    function createRestartButton() {
        const restartBtn = document.createElement('button');
        restartBtn.classList.add('restart-button')
        restartBtn.textContent = 'restart';
        return restartBtn;
    }
    function createInput() {
        const inputName = document.createElement('input');
        inputName.placeholder = 'Player Name';
        inputName.classList = 'save-input';
        return inputName;
    }
    function createButtons() {
        const saveBtn = createSaveButton();
        const restartBtn = createRestartButton();
        saveBtn.addEventListener('click', () => handler.save(restartBtn, saveBtn))
        return [saveBtn, restartBtn];
    }
    function endGame(game) {
        const [saveBtn, restartBtn] = createButtons();
        main.appendChild(saveBtn);
        main.appendChild(restartBtn);
        restartBtn.addEventListener('click', () => handler.restart(saveBtn, restartBtn));
    }
    function showScores(scoresList) {
        const exists = document.querySelector('ol');
        if (exists) {
            exists.parentElement.removeChild(exists);
        }
        const ol = document.createElement('ol');
        const h2 = document.createElement('h2');
        h2.textContent = 'Best Scores';
        ol.appendChild(h2);
        scoresList.forEach((player) => {
            const li = document.createElement('li');
            li.textContent = player.PlayerName + ' ' + player.PlayerScore + ' pts.';
            ol.appendChild(li)
        })
        const main = document.querySelector('main');
        main.appendChild(ol);
    }
    function eraseSnakeTail(x, y) {
        createSquare('black', x, y);
    }
    function hideElement(element){
        if(element){
            element.classList.add('hide');
        }
    }

    return {
        setBackground,
        createSquare,
        borders,
        endGame,
        writeScore,
        showScores,
        createApple,
        eraseSnakeTail,
        createInput,
        hideElement,
    }
})()

const handler = (()=>{
    function restart(saveBtn, restartBtn) {
        game.restart(snake);
        displayController.setBackground();
        displayController.borders();
        const inputName = document.querySelector('.save-input')
        restartBtn.classList.add('hide');
        displayController.hideElement(saveBtn)
        displayController.hideElement(inputName)
    }
    function save(restartBtn, saveBtn) {
        let saved = false;
        const inputName = displayController.createInput();
        const parent = saveBtn.parentElement;
        parent.replaceChild(inputName, saveBtn);
        inputName.addEventListener('keydown', (event) => { input(event,restartBtn, inputName, saved) })
    }
    function input(event,restartBtn, inputName, saved) {
        if (event.key == 'Enter') {
            if (inputName.value !== '' && !saved) {
                Firebase.addScore(inputName.value, game.getScore());
                saved = true;
                displayController.hideElement(restartBtn);
                displayController.hideElement(inputName);
                displayController.setBackground();
                displayController.borders();
                game.restart(snake);
                Firebase.showScores();
            }
        }
    }
    return{
        restart,
        save,
    }
})()

const game = (() => {
    let ax, ay;
    let score = 0;
    let gameVel = 80;
    const getAppleX = () => ax;
    const getAppleY = () => ay;
    const getScore = () => score;

    let gamePlaying;

    const pause = () => {
        clearInterval(gamePlaying);
    }

    const setScore = (_score) => {
        score = _score;
        displayController.writeScore(game.getScore());
    }

    function restart(snake) {
        snake.initializeSnake();
        game.setScore(0);
    }
    function endgame(_game) {
        displayController.endGame(_game);
    }

    function play() {
        displayController.writeScore();

        gamePlaying = setInterval(() => { snake.move() }, gameVel);

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

        displayController.createApple(ax, ay);
    }
    function drawSnake(x, y) {
        displayController.createSquare('#2ae600', x, y);
    }
    return {
        play,
        createApple,
        getAppleX,
        getAppleY,
        getScore,
        setScore,
        pause,
        restart,
        drawSnake,
        endgame,
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

    function initializeSnake() {
        setAlive(true);
        setAte(true);
        setVel(20);
        setHeadX(100);
        setHeadY(100);
        setTrail(100, 100);
    }

    const changeDirection = (e) => {
        if ((e.code === 'ArrowLeft' || e.code === 'KeyA') && moveComplete) {
            if (dx != vel) {
                dx = (-1 * vel);
                moveComplete = false;
            }
            dy = 0;
        }
        else if ((e.code === 'ArrowRight' || e.code === 'KeyD') && moveComplete) {
            if (dx != (-1 * vel)) {
                dx = (vel)
                moveComplete = false;
            }
            dy = 0;
        }
        else if ((e.code === 'ArrowUp' || e.code === 'KeyW') && moveComplete) {
            if (dy != vel) {
                dy = (-1 * vel);
                moveComplete = false;
            }
            dx = 0;
        }
        else if ((e.code === 'ArrowDown' || e.code === 'KeyS') && moveComplete) {
            if (dy != (-1 * vel)) {
                dy = (vel);
                moveComplete = false;
            }
            dx = 0;
        }
        // else if (e.code === 'KeyP') {
        //     game.pause();
        // }
        // else if (e.code === 'KeyK') {
        //     game.endgame(game);
        // }
    }
    function checkGrow(didSnakeAte) {
        if (didSnakeAte) {
            game.createApple();
            ate = false;
        }
        else {
            displayController.eraseSnakeTail(trail.shift(), trail.shift())
        }
    }
    function setNewHead() {
        headX += dx;
        headY += dy;
        crossWall();
    }
    function crossWall() {
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
    }
    function verifySnakeDead() {
        const snakeLen = snake.getTrail().length
        for (let i = 0; i < snakeLen; i += 2) {
            if (headX == snake.getTrail()[i] &&
                headY == snake.getTrail()[i + 1]) {
                game.endgame(game);
                alive = false;
            }
        }
    }
    function verifyGetApple() {
        if (headX == game.getAppleX() && headY == game.getAppleY()) {
            ate = true;
            game.setScore(game.getScore() + 10);
        }
    }
    const move = () => {
        if (!alive)
            return;
        checkGrow(ate);
        setNewHead();
        moveComplete = true;
        verifySnakeDead();
        trail.push(headX, headY);
        verifyGetApple();
        game.drawSnake(snake.getHeadX(), snake.getHeadY());
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
        initializeSnake,
    }
}

const Firebase = (() => {
    function showScores() {
        let bestScores = []
        db.collection('snake-scores').orderBy('OrderAux').limit(20).get().then((snapshot) => {
            snapshot.docs.forEach((doc) => {
                bestScores.push(doc.data())
            })
            displayController.showScores(bestScores)
        })
    }
    function addScore(name, score) {
        console.log(name, score)
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



// MAIN
const snake = Snake();
window.addEventListener('keydown', (e) => {
    snake.changeDirection(e);
});
displayController.setBackground();
displayController.borders();
game.play();
Firebase.showScores();


