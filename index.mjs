// Imports.
import express from 'express';
import http from 'http';
import ws from 'ws';

// Members.
const SocketServer = ws.Server;
const PORT = process.env.PORT || 3000;

/*
 * Express Server.
 */
const server = express()
  .use((req, res) => {
    console.log('Sending greeting from Express.');
    res.send({ hello: 'client' })
  })
  // .listen(PORT, () => console.log(`Listening on ${ PORT }.`));

/*
 * HTTP Server.
 */
const httpServer = http.createServer(server);
httpServer.listen(PORT, () => {
  const { address, port } = httpServer.address();
  console.log(`Listening on ${address}:${port}.`);
});

/*
 * WebSocket Server
 */
const webSocketServer = new SocketServer({ server: httpServer });

webSocketServer.on('connection', webSocket => {
  console.log('Client connected');
  webSocket.on('close', () => console.log('Client disconnected'));
});

// Every second, send the date to all the connected clients.
setInterval(() => {
  webSocketServer.clients.forEach(client => {
    client.send(new Date().toTimeString());
  });
}, 1000);