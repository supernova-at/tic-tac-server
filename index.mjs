// Imports.
import http from 'http';
import path from 'path';
import url from 'url';

import express from 'express';
import uuid from 'node-uuid';
import ws from 'ws';

// import Tournament from './tournament.mjs';
import Player from './player.mjs';

// Members.
const MOVE_TIMEOUT = 3000; // milliseconds.
const TIMEOUT_MESSAGE = 'TIMEOUT';
const PORT = process.env.PORT || 3000;
const INDEX = path.join(process.cwd(), 'index.html');

const ticTacClients = new Map(); // id -> { player, socket }
let resolvePlayerMove;
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
webSocketServer.on('connection', async (socket, request) => {
  const { query } = url.parse(request.url, true);
  const { name } = query;
  console.log(`Team "${name}" has connected.`);

  const socketId = uuid.v4();

  /*
   *  Event Handlers.
   */
  // Listen for messages from this player.
  socket.onmessage = message => {
    const name = getPlayerNameBySocketId(socketId);

    const clientMessage = JSON.parse(message.data);
    console.log(`Team "${name}" sent ${clientMessage}.`);

    if (clientMessage.type === 'move') {
      resolvePlayerMove(clientMessage.move);
    }
  };

  // Clean up.
  socket.onclose = () => {
    const name = getPlayerNameBySocketId(socketId);
    console.log(`Team "${name}" has disconnected.`);

    ticTacClients.delete(socketId);
  };

  /*
   *  Logic start.
   */
  // Keep track of this player / socket.
  const player = new Player({ name, socketId });
  ticTacClients.set(socketId, { player, socket });

  // Just for test, prompt this socket to make a move now.
  const move = await getMove(socket);
  console.log(`${name} made move: ${move}.`);
});

/*
 * Helper Functions.
 */
const getPlayerNameBySocketId = socketId => {
  const { player } = ticTacClients.get(socketId);
  return player.name;
}
const getSocketBySocketId = socketId => {
  const { socket } = ticTacClients.get(socketId);
  return socket;
}

const getMove = socket => {
  // Prompt.
  socket.send(JSON.stringify({
    type: 'makeMove',
    gameState: new Array(9).fill('-'),  //TODO: current game's state
  }));

  // Wait for response.
  const playerMove = new Promise((resolve, reject) => {
    resolvePlayerMove = resolve;
  });
  const timeout = getMoveTimeout();

  return Promise.race([playerMove, timeout]);
};

const getMoveTimeout = () => {
  return new Promise(resolve => {
    setTimeout(resolve, MOVE_TIMEOUT, TIMEOUT_MESSAGE);
  });
};
