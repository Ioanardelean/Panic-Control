import cors from '@koa/cors';
import config from 'config';
import fs from 'fs';
import http from 'http';
import https from 'https';
import Koa from 'koa';
import koaBodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import morgan from 'koa-morgan';
import koaOverride from 'koa-override';
import passport from 'koa-passport';
import KoaSession from 'koa-session';
import ServeStatic from 'koa-static';
import path from 'path';
import { load } from './core/DecoratorKoa';
import DbConnect from './databases/DatabaseConnection';
import CheckHealth from './modules/health/MainCheckHealth';

require('dotenv').config();
const cwd = process.cwd();
const accessLogStream = fs.createWriteStream(`${cwd}/src/logs/access.log`, {
  flags: 'a',
});
const app = new Koa();

app.use(morgan('combined', { stream: accessLogStream }));
app.use(helmet());

app.proxy = true;
app.keys = ['some secret'];
app.use(KoaSession(app));

require('./auth');

app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(koaBodyParser());
app.use(koaOverride());

app.use(async (ctx: any, next) => {
  ctx.state = {
    ...ctx.state,
    path: ctx.request.path,
    user: ctx.state.user || null,
  };
  await next();
});
app.use(ServeStatic(`${__dirname}/public`));

/**
 * Once data base loaded, load also api rest and monitoring test.
 * PostgresSQL data base configured into database folder, and called into server file.
 * Specify the path to controllers and use that routes.
 * Monitoring heath check starter on all servers loaded.
 *
 */
DbConnect.connectDB().subscribe(() => {
  const apiRouter = load(path.resolve(__dirname, 'controllers'));
  app.use(apiRouter.routes()).use(apiRouter.allowedMethods());
  // start Health
  CheckHealth.startHealthCheck();
});

const servers = config.get('servers');

const server = http.createServer(app.callback());

/**
 * socket io server attach to the node serverr
 * created a gloabl variable for reuse in entire project
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
