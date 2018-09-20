const POINTS_PER_WIN = 3;
const POINTS_PER_TIE = 1;
const POINTS_PER_LOSS = 0;

export const results = {
  WIN: 'win',
  LOSS: 'loss',
  TIE: 'tie',
};

export default class LeagueTable {
  constructor (players) {
    const playerEntries = players.map(player => [player.socketId, {
      name: player.name,
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      ties: 0,
      points: 0
    }]);
    this._table = new Map(playerEntries);
  }

  get values() {
    const result = [];

    const valuesIterator = this._table.values();
    let { value, done } = valuesIterator.next();
    while (!done) {
      result.push(value);
      ({ value, done } = valuesIterator.next());
    }

    return result;
  }

  calculatePoints({ wins, losses, ties }) {
    return (POINTS_PER_WIN * wins) + (POINTS_PER_TIE * ties) + (POINTS_PER_LOSS * losses);
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

    // Update both players' points.
    winnerEntry.points = this.calculatePoints({
      wins: winnerEntry.wins,
      losses: winnerEntry.losses,
      ties: winnerEntry.ties,
    });
    loserEntry.points = this.calculatePoints({
      wins: loserEntry.wins,
      losses: loserEntry.losses,
      ties: loserEntry.ties,
    });

    return this._table;
  }
}