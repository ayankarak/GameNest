const game = document.getElementById("game")
const resetBtn = document.getElementById("resetBtn")
const undoBtn = document.getElementById("undoBtn")
const movesText = document.getElementById("moves")

const easyBtn = document.getElementById("easyBtn")
const mediumBtn = document.getElementById("mediumBtn")
const hardBtn = document.getElementById("hardBtn")

const capacity = 4
const allColors = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan"]

let tubes = []
let selectedTube = null
let history = []
let moves = 0

let difficulty = "easy"

// LEVEL GENERATOR
function createGame() {

    let colorCount

    if (difficulty === "easy") {
        colorCount = 5
    }
    else if (difficulty === "medium") {
        colorCount = 6
    }
    else {
        colorCount = 8
    }

    let levelColors = allColors.slice(0, colorCount)

    let pool = []

    levelColors.forEach(color => {
        for (let i = 0; i < capacity; i++) {
            pool.push(color)
        }
    })

    shuffle(pool)

    tubes = []

    // filled tubes
    for (let i = 0; i < colorCount; i++) {

        let tube = []

        for (let j = 0; j < capacity; j++) {
            tube.push(pool.pop())
        }

        tubes.push(tube)

    }

    // empty tubes
    tubes.push([])
    tubes.push([])

    history = []
    moves = 0
    updateMoves()

    selectedTube = null

    renderGame()

}

// SHUFFLE
function shuffle(arr) {

    for (let i = arr.length - 1; i > 0; i--) {

        let j = Math.floor(Math.random() * (i + 1))

        let temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp

    }

}

// RENDER
function renderGame() {

    game.innerHTML = ""

    tubes.forEach((tube, index) => {

        const tubeDiv = document.createElement("div")
        tubeDiv.classList.add("tube")

        if (index === selectedTube) {
            tubeDiv.classList.add("selected")
        }

        tube.forEach(color => {

            const block = document.createElement("div")
            block.classList.add("color")
            block.style.background = color

            tubeDiv.appendChild(block)

        })

        tubeDiv.addEventListener("click", () => handleClick(index))

        game.appendChild(tubeDiv)

    })

}

// CLICK HANDLER
function handleClick(index) {

    if (selectedTube === null) {

        if (tubes[index].length === 0) return

        selectedTube = index
        renderGame()

    } else {

        pourWater(selectedTube, index)

        selectedTube = null

        renderGame()

        if (checkWin()) {
            setTimeout(() => alert("Level Complete!"), 200)
        }

    }

}

// REAL POUR LOGIC
function pourWater(from, to) {

    if (from === to) return

    let fromTube = tubes[from]
    let toTube = tubes[to]

    if (fromTube.length === 0) return
    if (toTube.length === capacity) return

    let movingColor = fromTube[fromTube.length - 1]

    if (toTube.length !== 0 && toTube[toTube.length - 1] !== movingColor) {
        return
    }

    // SAVE STATE FOR UNDO
    history.push(JSON.parse(JSON.stringify(tubes)))

    let count = 0

    for (let i = fromTube.length - 1; i >= 0; i--) {

        if (fromTube[i] === movingColor) {
            count++
        } else {
            break
        }

    }

    let space = capacity - toTube.length

    let moveAmount = Math.min(count, space)

    for (let i = 0; i < moveAmount; i++) {

        toTube.push(fromTube.pop())

    }

    moves++
    updateMoves()

}

// MOVE COUNTER
function updateMoves() {
    movesText.innerText = "Moves: " + moves
}

// UNDO
undoBtn.addEventListener("click", () => {

    if (history.length === 0) return

    tubes = history.pop()

    moves--
    updateMoves()

    renderGame()

})

// WIN CHECK
function checkWin() {

    for (let tube of tubes) {

        if (tube.length === 0) continue

        if (tube.length !== capacity) return false

        let first = tube[0]

        for (let color of tube) {

            if (color !== first) {
                return false
            }

        }

    }

    return true

}

// RESET
resetBtn.addEventListener("click", () => {

    selectedTube = null
    createGame()

})

easyBtn.addEventListener("click", () => {
    difficulty = "easy"
    createGame()
})

mediumBtn.addEventListener("click", () => {
    difficulty = "medium"
    createGame()
})

hardBtn.addEventListener("click", () => {
    difficulty = "hard"
    createGame()
})

createGame()
