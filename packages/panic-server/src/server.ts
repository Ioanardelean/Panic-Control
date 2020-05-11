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

/**
 * Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
 */
require('dotenv').config();
const cwd = process.cwd();

const app = new Koa();
/**
 * logs output
 */
const accessLogStream = fs.createWriteStream(`${cwd}/src/logs/access.log`, {
  flags: 'a',
});
app.use(morgan('combined', { stream: accessLogStream }));

app.use(helmet());
app.proxy = true;

/**
 * required for signed cookie sessions
 */
app.keys = ['some secret'];
app.use(KoaSession(app));

/**
 * init auth strategy
 */
require('./auth');
app.use(passport.initialize());
app.use(passport.session());

/**
 * Allows Angular application to make HTTP requests to koa application
 */

app.use(cors());
app.use(koaBodyParser());

/**
 * check body._method first
 * otherwise check X-HTTP-Method-Override header
 */
app.use(koaOverride());

app.use(async (ctx: any, next) => {
  ctx.state = {
    ...ctx.state,
    path: ctx.request.path,
    user: ctx.state.user || null,
  };
  await next();
});

app.use(async (ctx, next) => {
  try {
    await next();
    if (ctx.status === 404) ctx.throw(404);
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
});
/**
 * Where Angular builds to - In the ./angular/angular.json file, you will find this configuration
 * at the property: projects.angular.architect.build.options.outputPath
 * When you run `ng build`, the output will go to the ./public directory
 */
app.use(ServeStatic(`${__dirname}/public`));

/**
 * Configures the database and opens a global connection that can be used in any module with `typeorm.connection`
 * Once data base loaded, load also controllers and monitoring test.
 * Specify the path to controllers and use that routes.
 * Monitoring heath check starter on all servers loaded.
 *
 */
DbConnect.connectDB().subscribe(() => {
  const apiRouter = load(path.resolve(__dirname, 'controllers'));
  app.use(apiRouter.routes()).use(apiRouter.allowedMethods());
  CheckHealth.startHealthCheck();
});

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
