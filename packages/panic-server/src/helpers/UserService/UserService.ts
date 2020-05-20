import { validate, ValidationError } from 'class-validator';
import { getRepository } from 'typeorm';
import { BadRequest } from '../../helpers/errors';
import { CreateUserDto } from '../../models/dtos/CreateUserDto';
import { UpdateUserDto } from '../../models/dtos/UpdateUserDto';
import { User } from '../../models/User';
import { AuthService } from './AuthService';

export class UserService {
  repo = getRepository(User);
  authsrv = new AuthService();
  async getAllUsers() {
    return this.repo.find();
  }

  async createUser(user: CreateUserDto) {
    const password = await this.authsrv.hashPassword(user.password);
    const dto: CreateUserDto = {
      username: user.username,
      email: user.email,
      password,
    };
    const errors: ValidationError[] = await validate(user);
    if (errors.length > 0) {
      throw new BadRequest(errors);
    } else {
      await this.repo.save(dto);
      return dto;
    }
  }
  async findUserById(id: any) {
    return this.repo.findOne({ where: { id } });
  }
  async findUserByEmail(email: any) {
    return this.repo.findOne(email);
  }

  async findUserByName(username: string) {
    return this.repo.findOne({ where: { username } });
  }

  async updateUserById(id: number, data: UpdateUserDto) {
    const user = await this.repo.findOne({ id });
    const userToUpdate = this.repo.merge(user, data);
    const errors: ValidationError[] = await validate(data);
    if (errors.length > 0) {
      throw new BadRequest(errors);
    } else {
      return this.repo.save(userToUpdate);
    }
  }

  async deleteById(userToDelete: any) {
    return this.repo.remove(userToDelete);
  }
}
