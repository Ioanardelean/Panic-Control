import { getRepository } from 'typeorm';
import { User } from '../../models/User';

export class UserService {
  repo = getRepository(User);
  async getAllUsers() {
    return this.repo.find();
  }

  async createUser(user: User) {
    const newUser = user;
    await this.repo.save(newUser);
    return newUser.id;
  }

  async findUserById(id: any) {
    return this.repo.findOne({ where: { id } });
  }
  async findUserByEmail(email: any) {
    return this.repo.findOne({ where: { email } });
  }

  async findUserByName(username: string) {
    return this.repo.findOne({ where: { username } });
  }

  async updateUserById(id: number, payload: any) {
    const user = await this.repo.findOne({ where: { id } });
    const userToUpdate = this.repo.merge(user, payload);
    return this.repo.save(userToUpdate);
  }

  async deleteById(userToDelete: any) {
    return this.repo.remove(userToDelete);
  }
}
