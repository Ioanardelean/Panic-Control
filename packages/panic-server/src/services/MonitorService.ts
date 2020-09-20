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
    return this.repo.find({ relations: ['user'], where: { user: userId } });
  }
  async getAll() {
    return this.repo.find({ relations: ['user'] });
  }

  async countAll(userId: User) {
    return this.repo.findAndCount({ where: { user: userId } });
  }
  async createMonitor(monitorDto: CreateMonitorDto, userId: User) {
    const monitor: Monitor = new Monitor();
    monitor.Name = monitorDto.name;
    monitor.Description = monitorDto.description;
    monitor.Url = monitorDto.url;
    monitor.Receiver = monitorDto.receiver;
    monitor.Ping = monitorDto.ping;
    monitor.MonitorInterval = monitorDto.monitorInterval;
    monitor.EmailTemplate = monitorDto.emailTemplate;
    monitor.TestRunning = monitorDto.testRunning;
    monitor.User = userId;

    const nameExist = await this.findMonitorByName(monitorDto.name);
    const urlExist = await this.findMonitorByUrl(monitorDto.url);

    if (nameExist || urlExist) {
      throw new BadRequest('Monitor already exist');
    } else {
      const errors: ValidationError[] = await validate(monitor);
      if (errors.length > 0) {
        throw new BadRequest(errors);
      } else {
        await this.repo.save(monitor);
        return monitor;
      }
    }
  }

  async getMonitorById(id: number, userId: any) {
    return this.repo.findOne({
      where: { id, user: userId },
      relations: ['user'],
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

  async deleteMonitorById(id: number, userId: number) {
    const monitorToRemove = await this.repo.findOne({
      where: { id, user: userId },
      relations: ['user'],
    });
    return this.repo.remove(monitorToRemove);
  }
  async deleteMonitor(id: number) {
    const monitorToRemove = await this.repo.findOne({
      where: { id },
    });
    return this.repo.remove(monitorToRemove);
  }

  async findMonitorByName(name: string) {
    return this.repo.findOne({ where: { name } });
  }
  async findMonitorByUrl(url: string) {
    return this.repo.findOne({ where: { url } });
  }
}
