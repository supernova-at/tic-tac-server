// Imports.
import http from 'http';
import path from 'path';
import url from 'url';

import express from 'express';
import uuid from 'node-uuid';
import ws from 'ws';

import Game from './game.mjs';
import LeagueTable from './league-table.mjs';
import Player from './player.mjs';
import Tournament from './tournament.mjs';

// Members.
const NUM_TEAMS = 4;
const MOVE_TIMEOUT = 3000; // milliseconds.

const TIMEOUT_MOVE = 'TIMEOUT';
const PORT = process.env.PORT || 3000;
const INDEX = path.join(process.cwd(), 'index.html');

const ticTacClients = new Map(); // id -> { player, socket }
let resolvePlayerMove;
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
webSocketServer.on('connection', async (socket, request) => {
  const { query } = url.parse(request.url, true);
  const { name } = query;
  if (name === 'viewer') {
    console.log('The tournament viewer has connected.');
    viewerSocket = socket;
    return;
  }

  console.log(`Team "${name}" has connected.`);
  const socketId = uuid.v4();
  const player = new Player({ name, socketId });
  ticTacClients.set(socketId, { player, socket });

  /*
   *  Event Handlers.
   */
  // Listen for messages from this player.
  socket.onmessage = message => {
    const clientMessage = JSON.parse(message.data);

    if (clientMessage.type === 'move') {
      const name = getPlayerNameBySocketId(socketId);
      console.log(`Team "${name}" sent a move: ${clientMessage.move}.`);

      resolvePlayerMove(clientMessage.move);
    }
  };

  // Clean up.
  socket.onclose = () => {
    const name = getPlayerNameBySocketId(socketId);
    console.log(`Team "${name}" has disconnected.`);
  };

  /*
   *  Logic start.
   */
  // Don't start until we have enough players.
  if (ticTacClients.size === NUM_TEAMS) {
    run();
  }
});

/*
 * Helper Functions.
 */
const run = async () => {
  // Create the tournament.
  const playerList = [];
  ticTacClients.forEach(value => playerList.push(value.player));
  const tournament = Tournament(playerList);
  const leagueTable = new LeagueTable(playerList);
  updateUITable(leagueTable.values);

  // Play all the games!
  let { value: currentGame, done: isTournamentComplete } = tournament.next();
  while (!isTournamentComplete) {
    // Play the current game.
    while (!currentGame.isOver) {
      const { activePlayer, player1, player2, gameState } = currentGame;

      const socket = getSocketById(activePlayer.socketId);
      const move = await getMove(socket, gameState);
      
      if (move !== TIMEOUT_MOVE) {
        currentGame.update(move); // note: also advances the turn.
      }
      else {
        // Timed out.
        currentGame.advanceTurn();
      }

      updateUIGame({
        team1: { name: player1.team.name, token: player1.token },
        team2: { name: player2.team.name, token: player2.token },
        gameState: currentGame.gameState,
      });
    }

    // The game is over!

    // Send a "winner" message.
    updateUIGameResult(currentGame.result);

    // Update the league table.
    leagueTable.update(currentGame.result);
    updateUITable(leagueTable.values);

    // And move on to the next game.
    ({ value: currentGame, done: isTournamentComplete} = tournament.next());
  }
};

const updateUIGame = gameInfo => {
  if (!viewerSocket) { return; }

  viewerSocket.send(JSON.stringify({
    type: 'gameUpdate',
    gameInfo,
  }));
};

const updateUITable = tableInfo => {
  if (!viewerSocket) { return; }

  viewerSocket.send(JSON.stringify({
    type: 'tableUpdate',
    tableInfo,
  }));
};

const updateUIGameResult = result => {
  if (!viewerSocket) { return; }

  const gameResult = {
    isTie: result.isTie,
    winner: result.winner.name,
    loser: result.loser.name,
  };
  viewerSocket.send(JSON.stringify({
    type: 'gameResult',
    result: gameResult,
  }));
};

const getMove = (socket, gameState) => {
  if (socket.readyState === 1) { // Open
    // Prompt.
    socket.send(JSON.stringify({
      type: 'makeMove',
      gameState,
    }));
  }

  // Wait for response.
  const playerMove = new Promise((resolve, reject) => {
    resolvePlayerMove = resolve;
  });
  const timeout = getMoveTimeout();

  return Promise.race([playerMove, timeout]);
};

const getMoveTimeout = () => {
  return new Promise(resolve => {
    setTimeout(resolve, MOVE_TIMEOUT, TIMEOUT_MOVE);
  });
};

const getPlayerNameBySocketId = socketId => {
  const { player } = ticTacClients.get(socketId);
  return player.name;
}
const getSocketById = socketId => {
  const { socket } = ticTacClients.get(socketId);
  return socket;
}
