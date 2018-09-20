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

  // Shuffle the games.
  const numGames = games.length;
  const shuffledGames = [];
  while (shuffledGames.length < numGames) {
    // Pick a random game and move it to the new array.
    const randomIndex = Math.floor(Math.random() * games.length);
    const randomGame = games.splice(randomIndex, 1)[0];
    shuffledGames.push(randomGame);
  }

  // Yield the next game.
  for (let i = 0; i < shuffledGames.length; i++) {
    yield games[i];
  }
}
