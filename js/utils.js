//------------------------------------------------------
// vars
//------------------------------------------------------
var gClickCount = 0
var gIsFirstClick = false
var gFirstClickLocation
var gElement 
var gIsOn = true
var gSeconds = 0
var gMinutes = 0

var gDisplaySec = 0
var gDisplayMin = 0
var gIntervalTime
//-------------------------------------------------------------------------------------------------------
// create game board
//-------------------------------------------------------------------------------------------------------
// create matrix
function createMat(rows, culs) {
    var gameElement
    var minesLocations = []
    var count = 0

    for (var i = 0; i < rows; i++) {
        var row = []
        for (var j = 0; j < culs; j++) {
            row.push({ gameElement: gameElement, location: { i, j }, cellNum: count , isFlagged : false })
            gCells.push(count)
            count++
        }
        gBoard.push(row)
    }
    return gBoard
}

// render board to HTML
function renderBoard(board) {
    var table = document.querySelector('table.game-table')
    
    for (var i = 0; i < board.length; i++) {
        table.innerHTML += `<tr class ="row-${i}">`
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            cell.gameElement === MINE ? element = 'mine' : element = ''
            // game element rendering
            cell.gameElement === 0 ? gameElement = '' : gameElement = cell.gameElement
            // table rendering , and class and functions injecting
            var tableRow = document.querySelector(`.row-${i}`)
            tableRow.innerHTML += `<td
            onclick = "cellClicked(this,${i},${j})"
            oncontextmenu = "rightClick(this,${i},${j});return false;"
            class = "cell-${i}-${j} hidden game element-${gElement}"
            id = "${gElement}
            ">
            </td>`
            //injecting game element to cell
            var tableCell = document.querySelector(`.cell-${i}-${j}`)
            tableCell.innerHTML = `<span>${gameElement}</span>`
        }
        table.innerHTML += `</tr>`
    }
}

// count mines around cell
function countMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            if (cell.gameElement !== MINE) {
                cell.gameElement = countNeighbors(i, j, gBoard)
            } else {
                gBoard.gameElement = MINE
            }
        }
    }
}
//-------------------------------------------------------------------------------------------------------
// utils for functions
//-------------------------------------------------------------------------------------------------------

// object{i,j} --> get html Class name 
function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}

// returns an array --> neighbor cells without mines location objects --> for first click
function countEmptyNeighbors(cellI, cellJ, mat) {
    var neighborsCount = 0;
    var neighborsCells = []
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;

            if (mat[i][j].gameElement !== MINE) neighborsCells.push({ i, j });
        }
    }

    return neighborsCells
}

// util function for countMines() --> return neighbors count around cell
function countNeighbors(cellI, cellJ, mat) {
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;

            if (mat[i][j].gameElement === MINE) neighborsCount++;
        }
    }

    return neighborsCount;
}

// --> random indexes array
function randomIdxs(board, length) {
    shuffle(gCells)
    var randCellNums = []
    for (var i = 0; i < length; i++) {
        randCellNums.push(gCells.pop())
    }
    return randCellNums
}

// util function get Random int
function getRandomInt(min, max) {
    var randomInt = parseInt(Math.random() * (Math.random() * 10))
    while (!(randomInt >= min && randomInt < max)) {
        randomInt = parseInt(Math.random() * (Math.random() * 1000) * (Math.random() * 1000))
    }
    return randomInt
}
// util function shuffle
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
    return array
}

// index --> cell object in board
function getCellLocByIdx(idx) {
    var cell
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].cellNum === idx) {
                cell = gBoard[i][j]
            }
        }
    }
    return cell
}

//-------------------------------------------------------------------------------------------------------
// timer
//-------------------------------------------------------------------------------------------------------
function startTimer() {
    gStartTime = Date.now()
    gIntervalTime = setInterval(stopWatch, 1000)
}

function stopWatch() {
    gSeconds++
    if (gSeconds / 60 === 1) {
        gSeconds = 0
        gMinutes++
    }

    gSeconds < 10 ? gDisplaySec = '0' + gSeconds : gDisplaySec = gSeconds
    gMinutes < 10 ? gDisplayMin = '0' + gMinutes : gDisplayMin = gMinutes

    var elTimerSpan = document.querySelector('.timer span')
    elTimerSpan.innerText = gDisplayMin + ':' + gDisplaySec
}

function clearTimer() {
    clearInterval(gIntervalTime)
    gSeconds = 0
    gMinutes = 0

    // countdown
    clearInterval (gIntervalCountdown)
    if (gNuts){
        document.querySelector('.countdown').innerHTML = '02:00'

    } else{
        document.querySelector('.countdown').innerHTML = '00:00'

    }
    time = startingMinutes * 60
}
//-------------------------------------------------------------------------------------------------------
// count down
function startCountDown() {
    gIntervalCountdown = setInterval(updateCountDown, 1000)
    gIntervalCountdown
}
    
function updateCountDown() {
    var minutes = Math.floor(time / 60)
    var seconds = time % 60
    var elCountDown = document.querySelector('.countdown')
   
    console.log(minutes, seconds);

    if(seconds === 0 && minutes === 0){
        clearInterval(gIntervalCountdown)
        gameOver()
        showLoseModal()
    } 

    var displaymin
    var displaySec

    seconds < 10 ? displaySec = '0' + seconds : displaySec = seconds
    minutes < 10 ? displaymin = '0' + minutes : displaymin = minutes

    elCountDown.innerHTML = `<span>${displaymin}:${displaySec}</span>`
    time--
}



