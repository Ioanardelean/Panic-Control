import { validate, ValidationError } from 'class-validator';
import { getRepository } from 'typeorm';
import { BadRequest } from '../helpers/errors';
import { CreateMonitorDto } from '../models/dtos/CreateMonitorDto';
import { UpdateMonitorDto } from '../models/dtos/UpdateMonitorDto';
import { Monitor } from '../models/Monitor';
import { User } from '../models/User';

export class MonitorService {
  repo = getRepository(Monitor);

  async getMonitors(userId: User) {
    return this.repo.find({ relations: ['user', 'histories'], where: { user: userId } });
  }
  async getAll() {
    return this.repo.find({ relations: ['user'] });
  }

  async countAll(userId: User) {
    return this.repo.findAndCount({ where: { user: userId } });
  }
  async createMonitor(monitor: CreateMonitorDto, userId: User) {
    const dto: CreateMonitorDto = {
      name: monitor.name,
      description: monitor.description,
      url: monitor.url,
      receiver: monitor.receiver,
      ping: monitor.ping,
      monitorInterval: monitor.monitorInterval,
      emailTemplate: monitor.emailTemplate,
      testRunning: monitor.testRunning,
      user: userId,
    };
    const errors: ValidationError[] = await validate(monitor);
    if (errors.length > 0) {
      throw new BadRequest(errors);
    } else {
      await this.repo.save(dto);
      return dto;
    }
  }

  async getMonitorById(id: number, userId: any) {
    return this.repo.findOne({
      where: { id, user: userId },
      relations: ['user', 'histories'],
    });
  }

  async getMonitorOnStatusStopped(userId: User) {
    return this.repo.findAndCount({
      where: { user: userId, status: 'stopped' },
    });
  }

  // tslint:disable-next-line: no-identical-functions
  async getMonitorOnStatusActive(userId: User) {
    return this.repo.findAndCount({
      where: { user: userId, status: 'up' },
    });
  }

  // tslint:disable-next-line: no-identical-functions
  async getMonitorOnStatusDown(userId: User) {
    return this.repo.findAndCount({
      where: { user: userId, status: 'down' },
    });
  }

  async updateMonitorById(id: number, data: UpdateMonitorDto) {
    const monitor = await this.repo.findOne({ where: { id } });
    const monitorToUpdate = this.repo.merge(monitor, data);
    const errors: ValidationError[] = await validate(data);
    if (errors.length > 0) {
      throw new BadRequest(errors);
    } else {
      return this.repo.save(monitorToUpdate);
    }
  }
  async changeStatus(id: number, payload: any) {
    const monitor = await this.repo.findOne({ where: { id } });
    const monitorToUpdate = this.repo.merge(monitor, payload);
    return this.repo.save(monitorToUpdate);
  }

  async deleteMonitorById(id: number, userId: any) {
    const monitorToRemove = await this.repo.findOne({
      where: { id, user: userId },
      relations: ['user', 'histories'],
    });
    return this.repo.remove(monitorToRemove);
  }
  async deleteMonitor(id: number) {
    const monitorToRemove = await this.repo.findOne({
      where: { id },
      relations: ['histories'],
    });
    return this.repo.remove(monitorToRemove);
  }
}
