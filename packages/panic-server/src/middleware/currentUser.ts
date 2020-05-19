import Koa from 'koa';
export default () => async (ctx: Koa.Context, next: () => Promise<any>) => {
  ctx.state = {
    ...ctx.state,
    path: ctx.request.path,
    user: ctx.state.user || null,
  };
  await next();
};
