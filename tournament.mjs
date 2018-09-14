import Game from './game.mjs';

export default function * Tournament (players) {
  const games = [];
    
  // Create games so that each player plays every other player (going first, then second).
  players.forEach((player, index) => {
    const isOtherPlayer = ({ socketId }) => socketId !== player.socketId;
    const otherPlayers = players.filter(isOtherPlayer);

    otherPlayers.forEach(otherPlayer => {
      const otherIndex = players.indexOf(otherPlayer);
      if (index < otherIndex) {
        games.push(new Game(player, otherPlayer));
        games.push(new Game(otherPlayer, player));
      }
    });
  });

  // Yield the next game.
  for (let i = 0; i < games.length; i++) {
    yield games[i];
  }
}
