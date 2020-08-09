import passport from 'passport';

export async function userRole(ctx: any, next: any) {
  if (ctx.isAuthenticated() && jwtAuth && ctx.state.user.role === 'user') {
    await next();
  }
}
// tslint:disable-next-line: no-identical-functions
export async function adminRole(ctx: any, next: any) {
  if (ctx.isAuthenticated() && ctx.state.user.role === 'admin') {
    await next();
  }
}
export const jwtAuth = passport.authenticate('jwt', { session: false });
