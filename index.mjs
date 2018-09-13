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
webSocketServer.on('connection', (socket, request) => {
  const { query } = url.parse(request.url, true);
  const { name } = query;
  console.log(`Team "${name}" has connected.`);

  const socketId = uuid.v4();

  // Keep track of this player / socket.
  const player = new Player({ name, socketId });
  ticTacClients.set(socketId, { player, socket });

  // Clean up.
  socket.onclose = event => {
    const { player } = ticTacClients.get(socketId);
    const { name } = player;
    console.log(`Team "${name}" has disconnected.`);
    ticTacClients.delete(socketId);
  };
});

/*
 * Helper Functions.
 */
