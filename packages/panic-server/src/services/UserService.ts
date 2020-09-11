import { validate, ValidationError } from 'class-validator';
import { getRepository } from 'typeorm';
import { BadRequest } from '../helpers/errors';
import { CreateUserDto } from '../models/dtos/CreateUserDto';
import { UpdateUserDto } from '../models/dtos/UpdateUserDto';
import { Role } from '../models/Role';
import { User } from '../models/User';
import { AuthService } from '../services/AuthService';

export class UserService {
  repo = getRepository(User);
  authsrv = new AuthService();
  userRole = getRepository(Role);
  async getAllUsers(): Promise<User[]> {
    return this.repo.find();
  }

  async createUser(user: CreateUserDto) {
    const password = await this.authsrv.hashPassword(user.password);
    const userRole = await this.userRole.findOne({
      where: { name: 'user' },
    });
    const dto: CreateUserDto = {
      username: user.username,
      email: user.email,
      password,
      roles: [userRole],
    };
    const usernameExist = await this.findUserByName(user.username);
    const emailExist = await this.findUserByEmail(user.email);

    if (usernameExist || emailExist) {
      throw new BadRequest('User already exist');
    } else {
      const errors: ValidationError[] = await validate(user);
      if (errors.length > 0) {
        throw new BadRequest(errors);
      } else {
        await this.repo.save(dto);
        return dto;
      }
    }
  }
  async findUserById(id: any) {
    return this.repo.findOne({
      relations: ['roles'],
      where: { id },
    });
  }
  async findUserByEmail(email: any) {
    return this.repo
      .createQueryBuilder('userRole')
      .addSelect('userRole.id', 'id')
      .addSelect('userRole.email', 'email')
      .where('userRole.email = :email', { email })
      .getRawOne();
  }

  async findUserByName(username: any) {
    return this.repo
      .createQueryBuilder('userRole')
      .addSelect('userRole.id', 'id')
      .addSelect('userRole.username', 'username')
      .addSelect('userRole.password', 'password')
      .addSelect('role.name', 'role')
      .innerJoin('userRole.roles', 'role')
      .where('userRole.username = :username', { username })
      .getRawOne();
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
