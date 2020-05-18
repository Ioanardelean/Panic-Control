import passport from 'passport';

export async function userMdw(ctx: any, next: any) {
  if (ctx.isAuthenticated() && ctx.state.user.role === 'user') {
    await next();
  }
}
// tslint:disable-next-line: no-identical-functions
export async function adminMdw(ctx: any, next: any) {
  if (ctx.isAuthenticated() && ctx.state.user.role === 'admin') {
    await next();
  }
}
export const jwtAuth = passport.authenticate('jwt', { session: false });
