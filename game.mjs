// Imports.
import { List } from 'immutable';

// Members.
const players = {
  PLAYER_1: 'p1',
  PLAYER_2: 'p2',
};

const squareStates = {
  EMPTY: '-',
  [players.PLAYER_1]: 'X',
  [players.PLAYER_2]: 'O',
};

/**
 * The board of a game of Tic Tac Toe is represented by an
 * immutable list of Squares.
 */
export default class Game {
  constructor({ players }) {
    this._board = List(new Array(9).fill(squareStates.EMPTY));
    this._turn = players.PLAYER_1;
  }

  get state() {
    // TODO: to js array.
    return this._board;
  }
  get turn() {
    return this._turn;
  }

  get isOver() {
    const boardIsFull = () => false;
    return boardIsFull;
  }
};
