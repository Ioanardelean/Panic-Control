import { getRepository } from 'typeorm';
import { History } from '../../models/History';
import { Project } from '../../models/Project';
import { User } from '../../models/User';

export class HistoryService {
  repo = getRepository(History);

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
      .innerJoinAndSelect('project.user', 'user')
      .where('event.status =:status', { status: 'down' })
      .andWhere('user.id=:id', { id: userId })
      .orderBy('event.startedAt', 'DESC')
      .getOne();
  }
}
