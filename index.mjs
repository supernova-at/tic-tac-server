// Imports.
import http from 'http';
import path from 'path';

import express from 'express';
import ws from 'ws';

// import Tournament from './tournament.mjs';
import Player from './player.mjs';

// Members.
const PORT = process.env.PORT || 3000;
const INDEX = path.join(process.cwd(), 'index.html');

const players = [];
// let tournament;
// let viewerSocket;

// Express Server.
const server = express()
  .use((request, response) => response.sendFile(INDEX));

// HTTP Server.
const httpServer = http.createServer(server);

// WebSocket Server.
const webSocketServer = new ws.Server({ server: httpServer });

// Start listening.
httpServer.listen(PORT);

// Event Handlers.
webSocketServer.on('connection', socket => {
  console.log('A client has connected.');
  socket.onclose = printDisconnectMessage.bind(socket);

  // Wait for registration from this client (to get player name).
  socket.onmessage = acceptRegistration.bind(socket);
});

/*
 * Helper Functions.
 */
const parse = data => JSON.parse(data);

// Note: purposefully not a fat arrow function so we can bind it.
const acceptRegistration = function (message) {
  console.log('Received a message. Checking if it is a registration message.');
  console.log('Message is: %s', message);
  console.log('Message keys are', Object.keys(message).join(','));
  const socket = this;

  const { type, name } = message;
  if (type === 'register') {
    const player = new Player({
      id: players.length,
      name,
      socket,
    });

    players.push(player);

    console.log(`Team "${name}" has registered.`);
    socket.removeEventListener('message', acceptRegistration);

    // if (players === 8) {
    //   tournament = 

    //   while (tournament.isInProgress) {
    //     const { activePlayer, state } = tournament.activeGame;
    //     await moveFrom({ activePlayer, state });
    //   }
    // }
  }
};

// const listenForMove = function (message) {
//   const { type, name } = parse(message);
// }

const printDisconnectMessage = function () {
  let playerName = 'unknown';

  const socket = this;
  const socketPlayer = players.find(player => {
    return player.socket === socket;
  });
  if (socketPlayer) {
    playerName = socketPlayer.name;
  }

  console.log(`"${playerName}" disconnected.`);
}
// const moveFrom = ({ player, state }) => {
//   // Prompt for a move.
//   player.socket.send(JSON.stringify({
//     type: 'makeMove',
//     gameState: state,
//   }));

//   // And listen for the response.
//   player.socket.onmessage = listenForMove;
// };

// const updateViewer = () => {
//   if (viewerSocket) {
//     viewerSocket.send(JSON.stringify({
//       numPlayers: players.length,
//     }));
//   }
// };

// socket.on('message', data => {
//   console.log(`Received a message: ${data}.`);
//   updateViewer();

//   const playerMessage = JSON.parse(data);
//   switch (playerMessage.type) {
//     case 'register':
//       if (playerMessage === 'viewer') {
//         viewerSocket = socket;
//         return;
//       }

//       players.push(new Player({
//         name: playerMessage.name,
//         socket,
//       }));

//       // if (players.size === 2) {
//       //   playGame();
//       // }
//     break;
//     case 'move':
//     break;
//   }
// });
