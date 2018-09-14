export const results = {
  WIN: 'win',
  LOSS: 'loss',
  TIE: 'tie',
};

export default class LeagueTable {
  constructor (players) {
    const playerEntries = players.map(player => [player.socketId, {
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      ties: 0,
      points: 0
    }]);
    this._table = new Map(playerEntries);
  }

  update(gameResult) {
    const { isTie, winner, loser } = gameResult;

    const winnerEntry = this._table.get(winner.socketId);
    const loserEntry = this._table.get(loser.socketId);

    winnerEntry.gamesPlayed = winnerEntry.gamesPlayed + 1;
    loserEntry.gamesPlayed = loserEntry.gamesPlayed + 1;
    
    if (isTie) {
      winnerEntry.ties = winnerEntry.ties + 1;
      loserEntry.ties = loserEntry.ties + 1;
    }
    else {
      winnerEntry.wins = winnerEntry.wins + 1;
      loserEntry.losses = loserEntry.losses + 1;
    }

    return this._table;
  }
}