import * as HttpStatus from 'http-status-codes';
import Koa from 'koa';
import { NotFound } from '../helpers/errors';
export default () => async (ctx: Koa.Context, next: () => Promise<any>) => {
  try {
    await next();
    if (
      !ctx.body &&
      (!ctx.status ||
        ctx.status === HttpStatus.NOT_FOUND ||
        ctx.status === HttpStatus.METHOD_NOT_ALLOWED)
    ) {
      throw new NotFound();
    }
  } catch (error) {
    ctx.status = error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR;
    error.status = ctx.status;
    ctx.body = { error };
    ctx.app.emit('error', error, ctx);
  }
};
