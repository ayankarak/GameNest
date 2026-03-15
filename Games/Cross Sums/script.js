document.addEventListener("DOMContentLoaded", function () {

    let size = 7

    let solution = []
    let removedSolution = []
    let rowSum = []
    let colSum = []

    let lastCell = null

    const levelSelect = document.querySelector(".level-select")
    const game = document.getElementById("game")
    const undoBtn = document.getElementById("undoBtn")
    const checkBtn = document.getElementById("checkBtn")
    const resultScreen = document.getElementById("resultScreen")
    const resultText = document.getElementById("resultText")

    const easyBtn = document.getElementById("easyBtn")
    const mediumBtn = document.getElementById("mediumBtn")
    const hardBtn = document.getElementById("hardBtn")

    // LEVEL BUTTONS

    easyBtn.onclick = function () {
        startGame(5)
    }
    mediumBtn.onclick = function () {
        startGame(7)
    }
    hardBtn.onclick = function () {
        startGame(9)
    }


    // START GAME

    function startGame(newSize) {
        levelSelect.style.display = "none"
        size = newSize
        solution = []
        removedSolution = []
        rowSum = []
        colSum = []
        lastCell = null
        undoBtn.disabled = true
        resultScreen.style.display = "none"
        generateGrid()
        draw()

    }


    // CREATE GRID

    function generateGrid() {
        for (let r = 0; r < size; r++) {
            solution[r] = []
            removedSolution[r] = []
            for (let c = 0; c < size; c++) {
                let num = Math.floor(Math.random() * 4) + 1
                solution[r][c] = num
                removedSolution[r][c] = Math.random() < 0.3
            }

        }
        // ROW SUM
        for (let r = 0; r < size; r++) {
            let sum = 0
            for (let c = 0; c < size; c++) {
                if (!removedSolution[r][c])
                    sum += solution[r][c]
            }
            rowSum[r] = sum
        }
        // COLUMN SUM
        for (let c = 0; c < size; c++) {
            let sum = 0
            for (let r = 0; r < size; r++) {
                if (!removedSolution[r][c])
                    sum += solution[r][c]
            }
            colSum[c] = sum
        }

    }
    // DRAW GRID
    function draw() {
        game.innerHTML = ""
        game.style.gridTemplateColumns = `repeat(${size + 1},60px)`
        game.appendChild(document.createElement("div"))
        for (let c = 0; c < size; c++) {
            let d = document.createElement("div")
            d.className = "cell sum"
            d.innerText = colSum[c]
            game.appendChild(d)

        }
        for (let r = 0; r < size; r++) {
            let rs = document.createElement("div")
            rs.className = "cell sum"
            rs.innerText = rowSum[r]
            game.appendChild(rs)
            for (let c = 0; c < size; c++) {
                let cell = document.createElement("div")
                cell.className = "cell"
                cell.innerText = solution[r][c]
                cell.dataset.r = r
                cell.dataset.c = c
                cell.onclick = toggle
                game.appendChild(cell)

            }

        }

    }


    // CELL CLICK

    function toggle() {
        let r = this.dataset.r
        let c = this.dataset.c
        this.classList.toggle("removed")
        lastCell = this
        undoBtn.disabled = false
        if (this.classList.contains("removed")) {

            if (!removedSolution[r][c]) {
                this.classList.add("wrong")
            }
            else {
                this.classList.remove("wrong")
            }
        }
        else {
            this.classList.remove("wrong")
        }

    }

    // UNDO
    undoBtn.onclick = function () {

        if (lastCell) {
            lastCell.classList.remove("removed")
            lastCell.classList.remove("wrong")
            lastCell = null
            undoBtn.disabled = true

        }

    }

    // CHECK ANSWER
    checkBtn.onclick = function () {

        let correct = true

        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                let cell = document.querySelector(`[data-r="${r}"][data-c="${c}"]`)
                let removed = cell.classList.contains("removed")
                if (removed != removedSolution[r][c]) {
                    correct = false
                }
            }
        }
        showResult(correct)
    }
    // RESULT SCREEN
    function showResult(win) {
        if (win) {
            resultText.innerText = "🎉 You Win!"
        }
        else {
            resultText.innerText = "❌ Wrong Answer"
        }
        resultScreen.style.display = "flex"
    }

    // PLAY AGAIN
    document.getElementById("playAgainBtn").onclick = function () {
    resultScreen.style.display = "none"
    levelSelect.style.display = "block"
    game.innerHTML = ""

}
    // INITIAL GAME
    //startGame(5)

})