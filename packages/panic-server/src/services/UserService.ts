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
  authService = new AuthService();
  userRole = getRepository(Role);
  async getAllUsers(): Promise<User[]> {
    return this.repo.find();
  }

  async createUser(userDto: CreateUserDto) {
    const password = await this.authService.hashPassword(userDto.password);
    const userRole = await this.userRole.findOne({
      where: { name: 'user' },
    });
    const user: User = new User();
    user.Email = userDto.email;
    user.Password = password;
    user.Roles = [userRole];
    user.Username = userDto.username;

    const username = await this.findUserByName(userDto.username);
    const mail = await this.findUserByEmail(userDto.email);

    if (username || mail) {
      throw new BadRequest('User already exist');
    } else {
      const errors: ValidationError[] = await validate(user);
      if (errors.length > 0) {
        throw new BadRequest(errors);
      } else {
        await this.repo.save(user);
        return user;
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
    return this.repo.findOne({ where: { email } });
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

  async updateUserById(Id: number, data: UpdateUserDto) {
    const user = await this.repo.findOne({ Id });
    const userToUpdate = this.repo.merge(user, data);
    const errors: ValidationError[] = await validate(data);
    if (errors.length > 0) {
      throw new BadRequest(errors);
    } else {
      return this.repo.save(userToUpdate);
    }
  }

  async deleteById(id: number) {
    const userToDelete = await this.repo.findOne({
      where: { id },
    });
    return this.repo.remove(userToDelete);
  }
  async delete(userToDelete: any) {
    return this.repo.remove(userToDelete);
  }
}
