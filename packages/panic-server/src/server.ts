import config from 'config';
import http from 'http';
import https from 'https';
import app from './app';


const servers = config.get('servers');

const server = http.createServer(app.callback());

/**
 * socket io server attach to the node servers
 * created a global variable for reuse in entire project
 */

(global as any).socketMap = new Map();

const io = require('socket.io')(server);
io.on('connection', (socket: any) => {
  socket.on('init', (id: any) => {
    (global as any).socketMap[id] = socket;
  });
});

server.listen(
  process.env.PORT || servers.http.port,
  servers.http.host,
  ListeningReporter
);
https
  .createServer(app.callback())
  .listen(servers.https.port, servers.https.host, ListeningReporter);

function ListeningReporter() {
  const { address, port } = this.address();
  const protocol = this.addContext ? 'https' : 'http';
  console.log(`Listening on ${protocol}://${address}:${port}...`);
}

export default server;
