import cors from '@koa/cors';
import fs from 'fs';
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
import DbConnect from './databases/DbConnect';
import currentUser from './middleware/currentUser';
import errorHandler from './middleware/errorHandler';
import CheckHealth from './modules/health/HealthCheckHandler';

/**
 * Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
 */
require('dotenv').config();
const cwd = process.cwd();

const app: Koa = new Koa();

// Generic error handling middleware.
app.use(errorHandler());

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

/**
 * current user middleware
 */
app.use(currentUser());

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

const db = new DbConnect();
db.start().then(() => {
  const apiRouter = load(path.resolve(__dirname, 'controllers'));
  app.use(apiRouter.routes()).use(apiRouter.allowedMethods());
  CheckHealth.startHealthCheck();
});

export default app;
