export default class Player {
  constructor({ id, name, socket }) {
    this._id = id;
    this._name = name;
    this._socket = socket;
  }

  async makeMove (boardState) {
  }
};
