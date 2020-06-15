import path from 'path';
import app from '../../app';
import { load } from '../../core/DecoratorKoa';
import DbConnect from '../../databases/DatabaseConnection';
import errorHandler from '../../middleware/errorHandler';
import CheckHealth from '../../modules/health/MainCheckHealth';
import server from '../../server';
global.beforeAll(async () => {

  const db = new DbConnect();
  await db.start().then(() => {
    const apiRouter = load(path.resolve('src/controllers'));
    app.use(apiRouter.routes()).use(apiRouter.allowedMethods());
    app.use(errorHandler());
    CheckHealth.startHealthCheck();

  });
  (global as any).socketMap = new Map();

  const io = require('socket.io')(server);
  io.on('connection', (socket: any) => {
    socket.on('init', (id: any) => {
      (global as any).socketMap[id] = socket;
    });
  });
});
