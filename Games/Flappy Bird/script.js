const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 700;
canvas.height = 400;

let imagesLoaded = 0;

function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === 2) {
    startGame();
  }
}

let bgImage = new Image();
bgImage.src = "assets/flappy_back.png";
bgImage.onload = imageLoaded;

let pipeImg = new Image();
pipeImg.src = "assets/pipe.png";
pipeImg.onload = imageLoaded;

let bgX = 0;
let bgSpeed = 2;

let bird = {
  x: 150,
  y: 200,
  width: 25,
  height: 25,
  gravity: 0.4,
  lift: -8,
  velocity: 0
};

let pipes = [];
let pipeWidth = 80;
let gap = 150;

let score = 0;
let frames = 0;
let gameOver = false;

function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  pipes.forEach(pipe => {

    let topHeight = pipe.top;
    let bottomHeight = canvas.height - pipe.bottom;

    // TOP PIPE (rotated)
    ctx.save();
    ctx.translate(pipe.x + pipeWidth / 2, pipe.top);
    ctx.rotate(Math.PI);
    ctx.drawImage(pipeImg, -pipeWidth / 2, 0, pipeWidth, topHeight);
    ctx.restore();

    // BOTTOM PIPE
    ctx.drawImage(
      pipeImg,
      pipe.x,
      pipe.bottom,
      pipeWidth,
      bottomHeight
    );
  });
}
function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // BACKGROUND SCROLL
  bgX -= bgSpeed;
  if (bgX <= -canvas.width) {
    bgX = 0;
  }

  ctx.drawImage(bgImage, bgX, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImage, bgX + canvas.width, 0, canvas.width, canvas.height);

  // BIRD PHYSICS
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    endGame();
  }

  // PIPE GENERATION
  if (frames % 120 === 0) {
    let topHeight = Math.random() * 180 + 40;

    pipes.push({
      x: canvas.width,
      top: topHeight,
      bottom: topHeight + gap,
      scored: false
    });
  }

  pipes.forEach((pipe, index) => {

    pipe.x -= 3;

    // COLLISION
    if (
      bird.x < pipe.x + pipeWidth &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
    ) {
      endGame();
    }

    // SCORE
    if (!pipe.scored && pipe.x + pipeWidth < bird.x) {
      score+=10;
      pipe.scored = true;
    }

    // REMOVE OFFSCREEN
    if (pipe.x + pipeWidth < 0) {
      pipes.splice(index, 1);
    }
  });

  drawPipes();
  drawBird();

  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText(score, canvas.width / 2 - 10, 40);

  frames++;
  requestAnimationFrame(update);
}

function endGame() {
  gameOver = true;
  document.getElementById("finalScore").innerText = score;
  document.getElementById("gameOverScreen").classList.remove("hide");
}

document.addEventListener("keydown", () => {
  bird.velocity = bird.lift;
});

canvas.addEventListener("click", () => {
  bird.velocity = bird.lift;
});

document.getElementById("restartBtn").addEventListener("click", startGame);

function startGame() {
  bird.y = 200;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  frames = 0;
  bgX = 0;
  gameOver = false;
  document.getElementById("gameOverScreen").classList.add("hide");
  update();
}