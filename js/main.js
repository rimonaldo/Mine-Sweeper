'use strict'
//-------------------------------------------------------------------------------------------------------
// vars
//-------------------------------------------------------------------------------------------------------
const MINE = '🦠'
const LIFE = ' 🩸 '
const SYRING = '💉'

var gBoard = []
var gCells = []
var gMines = []
var gFlagCount = 0
var gLife
var gNuts = false
var gDiff
var gScore = 0
var gElTimer = document.querySelector('.timer span')
var gIntervalCountdown
const startingMinutes = 2
var time = startingMinutes * 60
//-------------------------------------------------------------------------------------------------------
// Main game
//-------------------------------------------------------------------------------------------------------
function init() {
    chooseDiff(4)

}
// game over --> cleans 
function gameOver() {
    clearInterval(gIntervalTime)
    clearInterval(gIntervalCountdown)
    gIsOn = false
    var flagged = document.querySelectorAll('.flagged')

    flagged.forEach(flagged => {
        flagged.classList.remove('flagged')
    })
    clearTimer()
    console.log('game over');

}

// choose difficulty - starts and restarts game board --> should move to 
// restarts gBoard --> create matrix --> count mines --> renders board
function chooseDiff(diff, nuts) {
    document.querySelector('.modal-lose').style.opacity = '0'
    document.querySelector('.menu.face').innerText = '😷'
    gFlagCount = 0
    document.querySelector('.modal-win').style.display = 'none'
    document.querySelector('span.countdown.countup').innerText = '00'
    removeScore()
    gDiff = diff
    renderLife(diff, nuts)
    gIsOn = true

    if (nuts && !gIsOn) {
        console.log('nuts');
        // gElTimer.innerText = '02:00'
        // gElTimer.classList.remove('timer')
        // gElTimer.classList.add('countdown')
    }
    if (!nuts) {
        console.log('cool');
        gElTimer.innerText = '00:00'
        // gElTimer.classList.remove('countdown')
        // gElTimer.classList.add('timer')
    }
    gClickCount = 0
    clearTimer()
    var table = document.querySelector('table.game-table')
    table.innerHTML = ''
    var mineAmount
    if (diff === 4) mineAmount = 2
    if (diff === 8) mineAmount = 12
    if (diff === 12) mineAmount = 30
    gBoard = []
    gBoard = createMat(diff, diff)
    // console.log(gBoard);
    randomMines(mineAmount)
    countMines()
    renderBoard(gBoard)
}
//-------------------------------------------------------------------------------------------------------
// clicks
//-------------------------------------------------------------------------------------------------------
// add class --> .shown --> to all empty neighbors around cell --> first click
function showEmptyNeighbors(elCell, i, j) {
    var neighborsCells = countEmptyNeighbors(i, j, gBoard)
    countEmptyNeighbors(i, j, gBoard)
    for (var i = 0; i < neighborsCells.length; i++) {
        var neigCellClass = getClassName(neighborsCells[i])
        var elNeigCell = document.querySelector('.' + neigCellClass)
        elNeigCell.classList.add('shown')
        elCell.classList.add('shown')
    }
}
function firstClick(elCell, i, j) {

    showEmptyNeighbors(elCell, i, j)
    elCell.classList.add('shown')
    gFirstClickLocation = { i, j }
    gIsFirstClick = true

}
// all left clicks functions
function cellClicked(elCell, i, j) {

    if (gIsOn === false ||
        gBoard[i][j].isFlagged === true ||
        elCell.classList.contains('flagged'))
        return


    elCell.classList.add('shown')

    gClickCount++
    gClickCount === 1 ? gIsFirstClick = true : gIsFirstClick = false
    // first click
    if (gIsFirstClick) {

        if (gBoard[i][j].gameElement !== MINE) {
            gNuts ? startCountDown() : startTimer()
            gIsOn = true
            firstClick(elCell, i, j)
        } else if (gIsOn) {
            chooseDiff(gDiff)
            gIsOn = true
            console.log('haha');
            elCell.classList.add('shown')
            cellClicked(elCell, i, j)
            return
        }

    }

    if (gBoard[i][j].gameElement === MINE && gLife > 0) {
        removeLife()
        elCell.classList.add('shown')
        gScore--
    }

    if (gLife < 1 && gBoard[i][j].gameElement === MINE) {
        showMines()
        gameOver()
        showLoseModal()

    } else {

        addScore()
        elCell.classList.add('shown')
    }

}
// right click toggles --> .flagged
function rightClick(elCell, i, j) {
    if (!gBoard[i][j].isFlagged) gFlagCount++
    else gFlagCount--
    console.log(gFlagCount);
    elCell.classList.toggle('flagged')
    elCell.classList.add('syring')
    elCell.innerText = SYRING
    gBoard[i][j].isFlagged = !gBoard[i][j].isFlagged
    console.log(gBoard[i][j]);

    gameWin()

}
//-------------------------------------------------------------------------------------------------------
// Mines
//-------------------------------------------------------------------------------------------------------
//  add class --> .shown --> to all mines on board
function showMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].gameElement === MINE) {
                var mineClassName = getClassName(gBoard[i][j].location)
                var elMine = document.querySelector('.' + mineClassName)
                elMine.classList.add('shown')
                elMine.classList.add('mine')
            }
        }
    }
}

// place random mines
function randomMines(mineAmount) {
    var ranMinesIdxs = randomIdxs(gBoard, gBoard.length ** 2)

    for (var i = 0; i < mineAmount; i++) {
        var randMine = getCellLocByIdx(ranMinesIdxs.pop())
        console.log(randMine);
        if (!randMine) {
            i--
            continue
        }
        gMines.push(randMine)
        randMine.gameElement = MINE
    }
    console.log(gMines);
}
//-------------------------------------------------------------------------------------------------------
// life
function countLife(count) {
    gLife = count
    var elLife = document.querySelector('.life')
    for (var i = 0; i < count; i++) {
        elLife.innerHTML += `<span class="life-${i + 1}">${LIFE}</span>`

    }
}

function clearLife() {
    var elLife = document.querySelector('.life')
    elLife.innerText = ''
}

function renderLife(diff, nuts) {
    gNuts = nuts
    var life
    clearLife()
    if (diff === 4) life = 1
    if (diff === 8) life = 2
    if (diff > 8) life = 3
    if (nuts) life = 0
    countLife(life)

}

function removeLife() {
    console.log(gLife);
    var elLife = document.querySelector(`.life-${gLife}`)
    console.log(elLife);
    elLife.innerText = ''
    gLife--
}
//-------------------------------------------------------------------------------------------------------
// score
function addScore() {
    gScore++
    var elScore = document.querySelector('.score')
    elScore.innerText = `${gScore}`
}

function removeScore() {
    gScore = 0
    var elScore = document.querySelector('.score')
    elScore.innerText = `${gScore}`
}

function gameWin() {
    for (var i = 0; i < gMines.length; i++) {
        console.log(gMines[i]);
        if (!gMines[i].isFlagged) return
    }

    if (gFlagCount === gMines.length) {
        for (var i = 0; i < gMines.length; i++) {
            console.log(gMines[i]);
            if (!gMines[i].isFlagged) return
        }
        console.log('well done');
        gIsOn = false
        showWinModal()
    } else return

}
showWinModal()
function showWinModal() {
    console.log('wihii');
    document.querySelector('.modal-win').style.opacity = '100'
    document.querySelector('.menu.face').innerText = '😃'
}

function showLoseModal() {
    console.log('wihii');
    document.querySelector('.modal-lose').style.opacity = '100'
    document.querySelector('.menu.face').innerText = '🤮'
}