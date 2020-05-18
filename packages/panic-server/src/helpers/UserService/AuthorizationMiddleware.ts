import passport from 'passport';
import { getRepository, Repository } from 'typeorm';
import { User } from '../../models/User';

let repository = new Repository<User>();
function initialize() {
  repository = getRepository(User);
}

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

export async function findUserById(id: any) {
  initialize();
  return repository.findOne({ where: { id } });
}

export async function findUserByName(username: string) {
  initialize();
  return repository.findOne({ where: { username } });
}

export const jwtAuth = passport.authenticate('jwt', { session: false });
