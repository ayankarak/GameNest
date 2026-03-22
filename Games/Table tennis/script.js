const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let aiReactionDelay = 10;
let aiFrameCounter = 0;
let aiTargetY = canvas.height / 2;

let playerScore = 0;
let aiScore = 0;

const playerScoreDisplay = document.getElementById("playerScore");
const aiScoreDisplay = document.getElementById("aiScore");
const difficultyPanel = document.getElementById("difficultyPanel");
let winScore = 5;
let gameOver = false;

const gameOverScreen = document.getElementById("gameOverScreen");
const winnerText = document.getElementById("winnerText");

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    dx: 4,
    dy: 4
};
const leftPaddle = {
    x: 10,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 50,
    speed: 20
};

const rightPaddle = {
    x: canvas.width - 20,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 50,
    speed: 4
};

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(paddle) {
    ctx.fillStyle = "white";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

canvas.addEventListener("mousemove", function (e) {

    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;

    let target = mouseY - leftPaddle.height / 2;

    leftPaddle.y += (target - leftPaddle.y) * 0.2;

});

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (
        ball.y - ball.radius < 0 ||
        ball.y + ball.radius > canvas.height
    ) {
        ball.dy *= -1;
    }

    if (
        ball.dx < 0 &&
        ball.x - ball.radius < leftPaddle.x + leftPaddle.width &&
        ball.y > leftPaddle.y &&
        ball.y < leftPaddle.y + leftPaddle.height
    ) {
        ball.dx *= -1;
        ball.x = leftPaddle.x + leftPaddle.width + ball.radius;
    }

    if (
        ball.dx > 0 &&
        ball.x + ball.radius > rightPaddle.x &&
        ball.y > rightPaddle.y &&
        ball.y < rightPaddle.y + rightPaddle.height
    ) {
        ball.dx *= -1;
        ball.x = rightPaddle.x - ball.radius;
    }

    if (ball.x < 0 || ball.x > canvas.width) {
        resetBall();
    }
}

// function moveAI() {
//   if (ball.y > rightPaddle.y + rightPaddle.height / 2) {
//     rightPaddle.y += rightPaddle.speed;
//   } else {
//     rightPaddle.y -= rightPaddle.speed;
//   }
// }

// function moveAI() {
//   if (ball.dx > 0) { 
//     let target = ball.y - rightPaddle.height / 2;

//     target += (Math.random() - 0.5) * 40;

//     if (rightPaddle.y < target) {
//       rightPaddle.y += rightPaddle.speed;
//     } else {
//       rightPaddle.y -= rightPaddle.speed;
//     }

//   } else {
//     let center = canvas.height / 2 - rightPaddle.height / 2;

//     if (rightPaddle.y < center) {
//       rightPaddle.y += 2;
//     } else {
//       rightPaddle.y -= 2;
//     }
//   }
// }

function setDifficulty(level) {

    if (level === "easy") {
        aiReactionDelay = 25;
    }

    if (level === "medium") {
        aiReactionDelay = 15;
    }

    if (level === "hard") {
        aiReactionDelay = 5;
    }

    difficultyPanel.style.display = "none";

    gameLoop(); // 🎮 start game
}

function moveAI() {
    if (ball.dx > 0) {

        aiFrameCounter++;

        if (aiFrameCounter > aiReactionDelay) {

            let predictedY = ball.y + ball.dy * 10;

            let error = (Math.random() - 0.5) * 60;

            aiTargetY = predictedY - rightPaddle.height / 2 + error;

            aiFrameCounter = 0;
        }

        let diff = aiTargetY - rightPaddle.y;

        if (Math.abs(diff) > 5) {
            rightPaddle.y += diff * 0.1;
        }

    } else {
        let center = canvas.height / 2 - rightPaddle.height / 2;
        rightPaddle.y += (center - rightPaddle.y) * 0.05;
    }
}

function resetBall() {

    if (ball.x < 0) {
        aiScore++;
        aiScoreDisplay.textContent = aiScore;
    }

    if (ball.x > canvas.width) {
        playerScore++;
        playerScoreDisplay.textContent = playerScore;
    }

    if (playerScore === winScore || aiScore === winScore) {
        endGame();
        return;
    }

    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = -ball.dx;
}

function drawNet() {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;

    ctx.setLineDash([15, 15]); // dash pattern
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.shadowBlur = 10;
    ctx.shadowColor = "white";
    ctx.stroke();
    ctx.setLineDash([]); // reset dash
}

function endGame() {
    gameOver = true;

    if (playerScore === winScore) {
        winnerText.textContent = "🎉 You Win!";
    } else {
        winnerText.textContent = "🤖 AI Wins!";
    }

    gameOverScreen.style.display = "block";
}

function restartGame() {
    playerScore = 0;
    aiScore = 0;

    playerScoreDisplay.textContent = 0;
    aiScoreDisplay.textContent = 0;

    gameOver = false;

    gameOverScreen.style.display = "none";

    // Difficulty panel wapas dikhao
    difficultyPanel.style.display = "block";

    // Ball reset
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 4;
    ball.dy = 4;
}

// function gameLoop() {
//     if (gameOver) return;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     moveBall();
//     moveAI();

//     // Paddle boundary check
//     if (leftPaddle.y < 0) leftPaddle.y = 0;
//     if (leftPaddle.y + leftPaddle.height > canvas.height)
//         leftPaddle.y = canvas.height - leftPaddle.height;

//     if (rightPaddle.y < 0) rightPaddle.y = 0;
//     if (rightPaddle.y + rightPaddle.height > canvas.height)
//         rightPaddle.y = canvas.height - rightPaddle.height;

//     drawNet(); // 👈 YEH ADD KARNA HAI
//     drawBall();
//     drawPaddle(leftPaddle);
//     drawPaddle(rightPaddle);

//     requestAnimationFrame(gameLoop);
// }

let animationId;

function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    moveBall();
    moveAI();

    drawNet();
    drawBall();
    drawPaddle(leftPaddle);
    drawPaddle(rightPaddle);

    animationId = requestAnimationFrame(gameLoop);
}

//gameLoop();