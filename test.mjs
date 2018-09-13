import Tournament from './tournament.mjs';
import Player from './player.mjs';

const p1 = new Player({ socketId: 1, name: 'A' });
const p2 = new Player({ socketId: 2, name: 'B' });
const p3 = new Player({ socketId: 3, name: 'C' });
const p4 = new Player({ socketId: 4, name: 'D' });
const p5 = new Player({ socketId: 5, name: 'E' });
const p6 = new Player({ socketId: 6, name: 'F' });
const p7 = new Player({ socketId: 7, name: 'G' });
const p8 = new Player({ socketId: 8, name: 'H' });

const t = new Tournament([p1, p2, p3, p4, p5, p6, p7, p8]);
console.log('numGames', t.games.length);
const readables = t.games.map(g => `${g[0].name} vs. ${g[1].name}`);
console.log(readables);
