import { getRepository } from 'typeorm';
import { History } from '../../models/History';
import { Project } from '../../models/Project';
import { User } from '../../models/User';

export class HistoryService {
  repo = getRepository(History);

  projectRelation = 'project.user';

  async addHistory(history: History, projectId: Project, projectUrl: any) {
    const createHistory = history;
    createHistory.project = projectId;
    createHistory.url = projectUrl;
    await this.repo.save(createHistory);
    return createHistory.id;
  }
  async getLastEvent(userId: User) {
    return this.repo
      .createQueryBuilder('event')
      .innerJoinAndSelect('event.project', 'project')
      .innerJoinAndSelect(this.projectRelation, 'user')
      .where('event.status =:status', { status: 'down' })
      .andWhere('user.id=:id', { id: userId })
      .orderBy('event.startedAt', 'DESC')
      .getOne();
  }

  async getDowntimeSinceCreation(projectId: Project) {
    return this.repo
      .createQueryBuilder('downtime')
      .addSelect('project.name', 'project_name')
      .innerJoin('downtime.project', 'project')
      .innerJoin(this.projectRelation, 'user')
      .where('project.id=:id', { id: projectId })
      .andWhere('downtime.status =:status', { status: 'down' })
      .getRawMany();
  }

  async getDowntimeOnMonth(userId: any) {
    const date = new Date();

    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return this.repo
      .createQueryBuilder('month')
      .addSelect('month.id', 'id')
      .addSelect('month.uptime', 'uptime')
      .addSelect('month.url', 'url')
      .addSelect('month.startedAt', 'startedAt')
      .addSelect('month.status', 'status')
      .addSelect('project.name', 'name')
      .innerJoin('month.project', 'project')
      .innerJoin(this.projectRelation, 'user')
      .where('month.status =:status', { status: 'down' })
      .andWhere('user.id=:id', { id: userId })
      .andWhere(
        `month.startedAt BETWEEN '${firstDay.toUTCString()}' AND '${lastDay.toUTCString()}'`
      )
      .orderBy('month.startedAt', 'DESC')
      .getRawMany();
  }

  async getDowntimeOnYear(projectId: number) {
    const lastDayOfPassedYear = new Date(new Date().getFullYear(), 0, 1);
    const now = new Date();
    return this.repo
      .createQueryBuilder('year')
      .innerJoinAndSelect('year.project', 'project')
      .innerJoinAndSelect('project.user', 'user')
      .where('project.id=:id', { id: projectId })
      .andWhere(
        `year.startedAt BETWEEN '${lastDayOfPassedYear.toLocaleString()}' AND '${now.toLocaleString()}'`
      )
      .orderBy('year.startedAt', 'ASC')
      .getMany();
  }
}
