// Imports.
import http from 'http';
import path from 'path';
import url from 'url';

import express from 'express';
import uuid from 'uuid';
import ws from 'ws';

// import Tournament from './tournament.mjs';
import Player from './player.mjs';

// Members.
const PORT = process.env.PORT || 3000;
const INDEX = path.join(process.cwd(), 'index.html');

const ticTacClients = new Map(); // id -> { player, socket }
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
  const { query: { player: name } } = url.parse(req.url, true);
  console.log(`Team "${name}" has connected.`);

  // Keep track of this player / socket.
  const socketId = uuid.v4();
  const player = new Player({ id, name });
  socket.ticTacId = socketId;
  ticTacClients.set(socketId, { player, socket });

  // Clean up.
  socket.onclose = () => {
    const { player: { name } } = ticTacClients.get(socket.ticTacId);
    console.log(`Team "${name}" has disconnected.`);
    ticTacClients.delete(socket.ticTacId);
  }
});

/*
 * Helper Functions.
 */
const acceptRegistration = message => {
  console.log('Received a message. Checking if it is a registration message.');

  const { type, name } = JSON.parse(message.data);
  const socket = message.target;
  if (type === 'register') {
    const player = new Player({
      id: players.length,
      name,
      socket,
    });

    players.push(player);

    console.log(`Team "${name}" has registered.`);
    //socket.removeEventListener('message', acceptRegistration);

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
