import passport from 'passport';
import { getRepository, Repository } from 'typeorm';
import { User } from '../../models/UserModel';

let repository = new Repository<User>();
function initialize() {
  repository = getRepository(User);
}

export async function userMdw(ctx: any, next: any) {
  if (ctx.isAuthenticated() && ctx.state.user.role === 'user') {
    await next();
  }
}
export async function adminMdw(ctx: any, next: any) {
  if (ctx.isAuthenticated() && ctx.state.user.role === 'admin') {
    await next();
  }
}
export async function getAllUsers() {
  initialize();
  return repository.find();
}

export async function createUser(user: User) {
  initialize();
  const newUser = user;
  await repository.save(newUser);
  return newUser.id;
}

export async function getUserById(id: any) {
  initialize();
  return repository.findOne({ where: { id } });
}
export async function getUserByName(username: string) {
  initialize();
  return repository.findOne({ where: { username } });
}

export async function updateUserById(id: number, payload: any) {
  const user = await repository.findOne({ where: { id } });
  const userToUpdate = repository.merge(user, payload);
  return repository.save(userToUpdate);
}

export async function deleteById(id: number) {
  const userToDelete = await repository.findOne({ where: { id } });
  return repository.remove(userToDelete);
}
export const jwtAuth = passport.authenticate('jwt', { session: false });
