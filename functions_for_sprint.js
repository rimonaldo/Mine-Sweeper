// count neighbors
// 
function countNeighbors(cellI, cellJ, mat) {
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;

            if (mat[i][j] === LIFE || mat[i][j] === SUPER_LIFE) neighborsCount++;
        }
    }

    return neighborsCount;
}

// shuffle
function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        // Generate random number
        var j = Math.floor(Math.random() * (i + 1));
                    
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }     
    return array;
 }

// create Matrix
 function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push({})
        }
        mat.push(row)
    }
    return mat
}


// Render the board to an HTML table
function renderBoard(board) {


    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];
            // var cellClass = getClassName({ i: i, j: j })
            var cellClass = getClassName({ i, j })

            if (currCell.type === FLOOR) cellClass += ' floor';
            else if (currCell.type === WALL) cellClass += ' wall';

            strHTML += '<td class="cell ' + cellClass + '" onclick="moveTo(' + i + ',' + j + ')" >';

            if (currCell.gameElement === GAMER) {
                strHTML += GAMER_IMG;
            } else if (currCell.gameElement === BALL) {
                strHTML += BALL_IMG;
            }

            strHTML += '</td>';
        }
        strHTML += '</tr>';
    }
    // console.log('strHTML is:');
    // console.log(strHTML);
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location) // cell-i-j
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}


function getEmptyRandCell() {
    function getRandomInt(min, max) {
        var randomInt = parseInt(Math.random() * (Math.random() * 10))
        while (!(randomInt >= min && randomInt < max)) {
            randomInt = parseInt(Math.random() * (Math.random() * 1000) * (Math.random() * 1000))
        }
        return randomInt
    }
    function shuffle(array) {
        for (var i = array.length - 1; i > 0; i--) {
            // Generate random number
            var j = Math.floor(Math.random() * (i + 1));

            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    shuffle(arr)
    var cell = arr.pop(getRandomInt(1, gEmptyCells.length))
    cell = gBoard[cell.i][cell.j]
    return cell
}

function startTimer() {
    gStartTime = Date.now()
    gIntervalId = setInterval(updateTime, 80)
}

function updateTime() {
    var now = Date.now()
    var diff = now - gStartTime
    var secondsPast = diff / 1000
    var elTimerSpan = document.querySelector('.timer span')
    elTimerSpan.innerText = secondsPast.toFixed(3)

}