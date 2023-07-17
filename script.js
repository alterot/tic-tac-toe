const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');
const startBtn = document.getElementById('start-btn');

gameScreen.style.display = 'none';

//PLAYER functions
//createPlayer() created with factory function, do more of these!
const createPlayer = (name, symbol) => {
  return {
    name,
    symbol,
    wins: 0,
    element: document.getElementById(`player-${symbol}`),
  };
};

const player1 = createPlayer("Player 1", "X", 0);
const player2 = createPlayer("Player 2", "O", 0);

function updatePlayerScore(player) {
  player.element.textContent = `${player.name} victories: ${player.wins}`;
}

//Identify winning player (based in symbol in cell). 
function getPlayerBySymbol(symbol) {
  if (player1.symbol === symbol) {
    return player1;
  } else if (player2.symbol === symbol) {
    return player2;
  }
  return null; //fail safe if there is no match (though I can't foresee this scenario)
}

let currentPlayer = player1;
const currentPlayerIndicator = document.getElementById('current-player');
currentPlayerIndicator.textContent = `Current Player: ${currentPlayer.name}`;

function togglePlayer() {
  currentPlayer = (currentPlayer === player1) ? player2 : player1;
  currentPlayerIndicator.textContent = `Current Player: ${currentPlayer.name}`;
}

//GAME BOARD functions
//gameBoard() created with module IIFE, do more modules!!
const gameBoard = (() => {
  const board = ['', '', '', '', '', '', '', '', ''];

  const getBoard = () => {
    return [...board];
  };

  const updateCell = (index, player) => {
    if (board[index] === '') {
      board[index] = player;
    }
  };

  const resetBoard = () => {
    board.fill('');
  };
  
  return {
    getBoard,
    updateCell,
    resetBoard,
  };
})();

const boardElement = document.getElementById('board');

const createBoard = () => {
const board = gameBoard.getBoard();

//Create the markup for the board. I use button since I will be interacting by clicking on each cell
const boardMarkup = board.map((cell, index) => `
  <button class="cell" data-index="${index}">${cell}</button>
`).join('');

boardElement.innerHTML = boardMarkup;

};
createBoard();

//Start screen logic:
startBtn.addEventListener('click', () => {
  const player1Name = player1Input.value || 'Player 1';
  const player2Name = player2Input.value || 'Player 2';

  // Update player names
  player1.name = player1Name;
  player2.name = player2Name;

  updatePlayerScore(player1);
  updatePlayerScore(player2);

  // Hide start screen, show game screen
  startScreen.style.display = 'none';
  gameScreen.style.display = 'block';

  currentPlayerIndicator.textContent = `Current Player: ${player1Name}`;
});

//GAME LOGIC
const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

//I added this variable to ba able to "disable" interaction with the board when a winner is displayed
let gameActive = true

function checkForWin() {
  const board = gameBoard.getBoard();

  for (let combination of winningCombinations) {
    const [cell1, cell2, cell3] = combination;
    if (board[cell1] !== '' && board[cell1] === board[cell2] && board[cell2] === board[cell3]) {
      const winnerSymbol = board[cell1];
      const winnerPlayer = getPlayerBySymbol(winnerSymbol);

      setTimeout(() => {
        winnerPlayer.wins++;

        updatePlayerScore(player1);
        updatePlayerScore(player2);

        const winner = document.getElementById('winner');
        winner.innerHTML = `<p>${winnerPlayer.name} wins!</p><button id="continue-btn">Continue</button>`;
        winner.style.display = 'block';
        gameActive = false;

        const continueBtn = document.getElementById('continue-btn');
        continueBtn.addEventListener('click', () => {
          gameBoard.resetBoard();
          createBoard();
          gameActive = true;
          winner.style.display = 'none';
          addEventListeners();
        });
      }, 200);

      return board[cell1];
    }
  }
  // Draw scenario
  if (!board.includes('')) {
    
    const winner = document.getElementById('winner');
    winner.innerHTML = `<p>It's a draw!</p><button id="continue-btn">Continue</button>`;
    winner.style.display = 'block';
    gameActive = false;

    const continueBtn = document.getElementById('continue-btn');
    continueBtn.addEventListener('click', () => {
      gameBoard.resetBoard();
      createBoard();
      gameActive = true;
      winner.style.display = 'none';
      addEventListeners();
    });

    return 'draw';
  }

  return null;
}
  
function makeMove(cellIndex) {
  const currentCell = gameBoard.getBoard()[cellIndex];
  if (currentCell !== '' || !gameActive) {
    return;
  }

  gameBoard.updateCell(cellIndex, currentPlayer.symbol);

  const cells = document.querySelectorAll('.cell');
  cells[cellIndex].textContent = currentPlayer.symbol;

  const winner = checkForWin();
  if (winner) {
  } else {
    togglePlayer();
  }
}

//DOM INTERACTION

function addEventListeners() {
const cells = document.querySelectorAll('.cell');
cells.forEach((cell, index) => {
  cell.addEventListener('click', () => {
    makeMove(index);
  });
});
}
addEventListeners();


