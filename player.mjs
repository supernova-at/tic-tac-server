export default class Player {
  constructor({ name, socketId }) {
    this._name = name;
    this._socketId = socketId;
  }

  get name() { return this._name; }
  get socketId() { return this._socketId; }
};
