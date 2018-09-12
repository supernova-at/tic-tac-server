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
webSocketServer.on('connection', socket => {
  const { query: { player: name } } = url.parse(req.url, true);
  console.log(`Team "${name}" has connected.`);

  // Keep track of this player / socket.
  const socketId = uuid.v4();
  const player = new Player({ id, name });
  socket.ticTacId = socketId;
  ticTacClients.set(socketId, { player, socket });
  // const { type, name } = JSON.parse(message.data);

  // Clean up.
  socket.onclose = printDisconnectMessage;
});

/*
 * Helper Functions.
 */
const printDisconnectMessage = event => {
  const socket = event.target;
  const { player: { name } } = ticTacClients.get(socket.ticTacId);
  console.log(`Team "${name}" has disconnected.`);
  ticTacClients.delete(socket.ticTacId);
}