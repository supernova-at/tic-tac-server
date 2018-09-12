import game from './game.mjs';

export default function * tournament (players) {
  const games = new Array(7);

  // Setup the first round.
  games[0] = game(players[0], players[1]);
  games[1] = game(players[2], players[3]);
  games[2] = game(players[4], players[5]);
  games[3] = game(players[6], players[7]);

  // Play the first round games.
  const winner0 = await playGame(games[0]);
  yield winner0;
  const winner1 = await playGame(games[1]);
  yield winner1;
  const winner2 = await playGame(games[2]);
  yield winner2;
  const winner3 = await playGame(games[3]);
  yield winner3;

  // Setup the second round.
  games[4] = game(winner0, winner1);
  games[5] = game(winner2, winner3);

  // Play the second round games.
  const winner4 = await playGame(games[4]);
  yield winner4;
  const winner5 = await playGame(games[5]);
  yield winner5;

  // Setup the championship.
  games[6] = game(winner4, winner5);

  // Play the championship.
  return await playGame(games[6]);
}
