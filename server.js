const express = require(‘express’);
const { ExpressPeerServer } = require(‘peer’);
const http = require(‘http’);
const path = require(‘path’);

const app = express();
const server = http.createServer(app);
const SERVER_START = Date.now();

// PeerJS server mounted at /peerjs
const peerServer = ExpressPeerServer(server, {
debug: true,
path: ‘/’,
allow_discovery: true,
});
app.use(’/peerjs’, peerServer);

// Serve frontend from /public
app.use(express.static(path.join(__dirname, ‘public’)));

// Uptime endpoint
app.get(’/uptime’, (req, res) => {
const ms = Date.now() - SERVER_START;
const totalSeconds = Math.floor(ms / 1000);
const days    = Math.floor(totalSeconds / 86400);
const hours   = Math.floor((totalSeconds % 86400) / 3600);
const minutes = Math.floor((totalSeconds % 3600) / 60);
const seconds = totalSeconds % 60;
res.json({ days, hours, minutes, seconds });
});

// Log connections
peerServer.on(‘connection’, (client) => {
console.log(`[+] ${client.getId()} connected`);
});
peerServer.on(‘disconnect’, (client) => {
console.log(`[-] ${client.getId()} disconnected`);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
console.log(`4 Freunde Radio running on port ${PORT}`);
});
