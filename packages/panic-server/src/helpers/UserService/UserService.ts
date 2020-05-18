import { getRepository, Repository } from 'typeorm';
import { User } from '../../models/User';

let repository = new Repository<User>();
function initialize() {
  repository = getRepository(User);
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

export async function findUserById(id: any) {
  initialize();
  return repository.findOne({ where: { id } });
}
export async function findUserByEmail(email: any) {
  initialize();
  return repository.findOne({ where: { email } });
}

export async function findUserByName(username: string) {
  initialize();
  return repository.findOne({ where: { username } });
}

export async function updateUserById(id: number, payload: any) {
  const user = await repository.findOne({ where: { id } });
  const userToUpdate = repository.merge(user, payload);
  return repository.save(userToUpdate);
}

export async function deleteById(userToDelete: any) {
  return repository.remove(userToDelete);
}
