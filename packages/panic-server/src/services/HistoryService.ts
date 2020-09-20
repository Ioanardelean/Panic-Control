import { getRepository } from 'typeorm';
import { History } from '../models/History';
import { Monitor } from '../models/Monitor';
import { User } from '../models/User';
import { withoutTimestamp } from '../modules/utils/Datetime';

export class HistoryService {
  repo = getRepository(History);

  monitorRelation = 'monitor.user';

  async addHistory(history: History, monitorId: Monitor, monitorUrl: any) {
    const createHistory = history;
    createHistory.Monitor = monitorId;
    createHistory.Url = monitorUrl;
    await this.repo.save(createHistory);
    return createHistory.Id;
  }
  async getLastEvent(userId: User) {
    return this.repo
      .createQueryBuilder('event')
      .innerJoinAndSelect('event.monitor', 'monitor')
      .innerJoinAndSelect(this.monitorRelation, 'user')
      .where('event.status =:status', { status: 'down' })
      .andWhere('user.id=:id', { id: userId })
      .orderBy('event.startedAt', 'DESC')
      .getOne();
  }

  async getDowntimeSinceCreation(monitorId: Monitor) {
    return this.repo
      .createQueryBuilder('downtime')
      .addSelect('monitor.name', 'monitor_name')
      .innerJoin('downtime.monitor', 'monitor')
      .innerJoin(this.monitorRelation, 'user')
      .where('monitor.id=:id', { id: monitorId })
      .andWhere('downtime.status =:status', { status: 'down' })
      .getRawMany();
  }

  async getDowntimeOnMonth(userId: any) {
    const date = new Date();

    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1);
    return this.repo
      .createQueryBuilder('month')
      .addSelect('month.id', 'id')
      .addSelect('month.uptime', 'uptime')
      .addSelect('month.url', 'url')
      .addSelect('month.startedAt', 'startedAt')
      .addSelect('month.status', 'status')
      .addSelect('monitor.name', 'name')
      .innerJoin('month.monitor', 'monitor')
      .innerJoin(this.monitorRelation, 'user')
      .where('month.status =:status', { status: 'down' })
      .andWhere('user.id=:id', { id: userId })
      .andWhere(
        `month.startedAt BETWEEN '${withoutTimestamp(firstDay)}' AND'${withoutTimestamp(
          lastDay
        )}' `
      )
      .orderBy('month.startedAt', 'DESC')
      .getRawMany();
  }

  async getDowntimeOnYear(monitorId: number) {
    const lastDayOfPassedYear = new Date(new Date().getFullYear(), 0, 1);
    const now = new Date();
    return this.repo
      .createQueryBuilder('year')
      .innerJoinAndSelect('year.monitor', 'monitor')
      .innerJoinAndSelect('monitor.user', 'user')
      .where('monitor.id=:id', { id: monitorId })
      .andWhere(
        `year.startedAt BETWEEN '${withoutTimestamp(
          lastDayOfPassedYear
        )}' AND '${withoutTimestamp(now)}'`
      )
      .orderBy('year.startedAt', 'ASC')
      .getMany();
  }
}
