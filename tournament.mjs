export default class Tournament {
  constructor(players) {
    this._games = []; // of [p1, p2] pairs
    
    // Create games so that each player plays every other player (going first, then second).
    players.forEach((player, index) => {
      const isOtherPlayer = ({ socketId }) => socketId !== player.socketId;
      const otherPlayers = players.filter(isOtherPlayer);

      otherPlayers.forEach(otherPlayer => {
        const otherIndex = players.indexOf(otherPlayer);
        if (index < otherIndex) {
          this._games.push([player, otherPlayer]);
          this._games.push([otherPlayer, player]);
        }
      });
    });
  }

  get games () { return this._games; }
}
