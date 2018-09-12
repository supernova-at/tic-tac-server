// Members.
const squares = {
  EMPTY: '-',
  X: 'X',
  O: 'O',
};

export default function * game (player1, player2) {
  const board = new Array(9).fill(squares.EMPTY);
  const p1sTurn = true;

  yield new Promise((resolve, reject) => {
    const activePlayer = p1sTurn ? player1 : player2;
    activePlayer
  });
}
