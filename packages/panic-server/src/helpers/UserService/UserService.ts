import { getRepository } from 'typeorm';
import { User } from '../../models/User';
import { UserCreateDto } from '../../models/UserCreateDto';
import { hashPassword } from './HashPassword';

export class UserService {
  repo = getRepository(User);
  async createUser(user: UserCreateDto) {
    const password = await hashPassword(user.password);
    const dto: UserCreateDto = {
      email: user.email,
      username: user.username,
      password,
    };
    return this.repo.save(dto);
  }

  async findAll() {
    return this.repo.find();
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
  async deleteUser(id: number) {
    const userToDelete = await this.repo.findOne({ where: { id } });
    return this.repo.remove(userToDelete);
  }
}
