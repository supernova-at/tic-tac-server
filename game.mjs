// Members.
const marks = {
  EMPTY: '-',
  X: 'X',
  O: 'O',
};

export default class Game {
  constructor (player1, player2) {
    this._player1 = player1;
    this._player2 = player2;

    // Initialize the board.
    this._board = new Array(9).fill(marks.EMPTY);

    // Assign X and O to players.
    // There's gotta be a better way to do this.
    this._marksMap = new Map();
    this._marksMap.set(marks.X, player1);
    this._marksMap.set(marks.O, player2);
    this._playersToMarks = new Map();
    this._playersToMarks.set(player1, marks.X);
    this._playersToMarks.set(player2, marks.O);

    // Decide who goes first.
    this._isP1sTurn = true;
  }

  get activePlayer () { return this._isP1sTurn ? this._player1 : this._player2; }
  get gameState () { return this._board; }
  get isOver() { return getWinnerMark(this._board) || isFull(this._board); }
  get result () {
    if (!this.isOver) {
      return undefined;
    }

    // If we don't have a winner, it's a tie.
    const isTie = !this.winningPlayer;

    return {
      isTie,
      winner: this.winningPlayer,
      loser: (this.winningPlayer.socketId === this._player1.socketId) ? this._player2 : this._player1,
    } 
  }
  get winnerMark () { return getWinnerMark(this._board); }
  get winningPlayer () {
    const winnerMark = this.winnerMark;
    if (this.winnerMark) {
      return this._marksMap.get(winnerMark);
    }
    else {
      return null;
    }
  }

  advanceTurn () {
    this._isP1sTurn = !this._isP1sTurn;
  }

  /**
   * @param mark - the mark to place on the board.
   * @param move - the index to place the mark.
   */
  update (move) {
    const mark = this._playersToMarks.get(this.activePlayer);

    // Can only place mark in an empty square.
    if (this._board[move] === marks.EMPTY) {
      const newBoard = [...this._board];
      newBoard[move] = mark;
      this._board = newBoard;
    }

    // Advance the turn regardless - invalid moves result in forfeiture of turn.
    this.advanceTurn();
  }
};

const isFull = board => board.every(isNotEmpty);
const isNotEmpty = square => square !== marks.EMPTY;

const getWinnerMark = board => {
  const topLeft = board[0];
  const topMiddle = board[1];
  const topRight = board[2];
  const middleLeft = board[3];
  const middleMiddle = board[4];
  const middleRight = board[5];
  const bottomLeft = board[6];
  const bottomMiddle = board[7];
  const bottomRight =  board[8];

  const winningCombinations = [
    // Rows.
    [topLeft, topMiddle, topRight],
    [middleLeft, middleMiddle, middleRight],
    [bottomLeft, bottomMiddle, bottomRight],
    
    // Columns.
    [topLeft, middleLeft, bottomLeft],
    [topMiddle, middleMiddle, bottomMiddle],
    [topRight, middleRight, bottomRight],

    // Diagonals.
    [topLeft, middleMiddle, bottomRight],
    [bottomLeft, middleMiddle, topRight],
  ];

  let winningMark = null;
  winningCombinations.forEach(potential => {
    // Is this a winner?
    if (potential[0] !== marks.EMPTY &&
        potential[0] === potential[1] &&
        potential[1] === potential[2])
    {
      winningMark = potential[0];
      return;
    }
  });

  return winningMark;
}
