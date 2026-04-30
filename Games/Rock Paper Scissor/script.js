const choices = document.querySelectorAll(".choice");

const playerMove = document.getElementById("player-move");
const computerMove = document.getElementById("computer-move");

const result = document.getElementById("result");

const userScoreSpan = document.getElementById("user-score");
const compScoreSpan = document.getElementById("comp-score");

const gameOverScreen = document.getElementById("game-over");
const winnerText = document.getElementById("winner-text");

const playAgainBtn = document.getElementById("play-again");

let userScore = 0;
let compScore = 0;

const moves = {
    rock: "✊",
    paper: "📄",
    scissors: "✂️"
};

function computerChoice() {

    const options = ["rock", "paper", "scissors"];
    const random = Math.floor(Math.random() * 3);

    return options[random];

}

function animateComputer() {

    const options = ["✊", "📄", "✂️"];

    let count = 0;

    const interval = setInterval(() => {

        computerMove.innerText = options[count % 3];

        count++;

        if (count > 6) {
            clearInterval(interval);
        }

    }, 100);

}

function playGame(userChoice) {

    playerMove.innerText = moves[userChoice];

    animateComputer();

    setTimeout(() => {

        const compChoice = computerChoice();

        computerMove.innerText = moves[compChoice];

        if (userChoice === compChoice) {

            result.innerText = "Draw 🤝";

        }

        else if (

            userChoice === "rock" && compChoice === "scissors" ||
            userChoice === "paper" && compChoice === "rock" ||
            userChoice === "scissors" && compChoice === "paper"

        ) {

            userScore++;
            userScoreSpan.innerText = userScore;
            result.innerText = "You Win 🎉";

        }

        else {

            compScore++;
            compScoreSpan.innerText = compScore;
            result.innerText = "Computer Wins 🤖";

        }

        if (userScore === 5 || compScore === 5) {
            gameOverScreen.classList.remove("hidden");
            winnerText.innerText = userScore === 5 ? "You Won The Game 🎉" : "Computer Won The Game 🤖";
        }

    }, 700);

}

choices.forEach(choice => {

    choice.addEventListener("click", () => {
        const userChoice = choice.dataset.choice;
        playGame(userChoice);

    });

});

playAgainBtn.addEventListener("click", () => {

    userScore = 0;

    compScore = 0;

    userScoreSpan.innerText = 0;

    compScoreSpan.innerText = 0;

    playerMove.innerText = "❔";

    computerMove.innerText = "❔";

    result.innerText = "Choose your move";

    gameOverScreen.classList.add("hidden");

});