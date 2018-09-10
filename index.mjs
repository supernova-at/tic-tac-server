// Imports.
import express from 'express';
import http from 'http';
import path from 'path';
import ws from 'ws';

// import Game from './game.mjs';
import Player from './player.mjs';

// Members.
const PORT = process.env.PORT || 3000;
const INDEX = path.join(process.cwd(), 'index.html');
let game;
let players = [];
let viewerSocket;

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

  socket.on('close', () => console.log('Client disconnected.'));

  socket.on('message', data => {
    console.log(`Received a message: ${data}.`);

    const playerMessage = JSON.parse(data);
    switch (playerMessage.type) {
      case 'register':
        if (playerMessage === 'viewer') {
          viewerSocket = socket;
          return;
        }

        players.push(new Player({
          name: playerMessage.name,
          socket,
        }));

        // if (players.size === 2) {
        //   playGame();
        // }
      break;
      case 'move':
      break;
    }
  });
});

const updateViewer = () => {
  viewerSocket.send(JSON.stringify({
    some: 'thing'
  }));
};

// const promptForMove = socket => {
//   socket.send(JSON.stringify({
//     type: 'makeMove',
//     gameState: game.state,
//   }));
// };
