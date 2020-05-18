import { getRepository } from 'typeorm';
import { History } from '../../models/History';
import { Project } from '../../models/Project';

export class HistoryService {
  repo = getRepository(History);

  async addHistory(history: History, projectId: Project, projectUrl: any) {
    const createHistory = history;
    createHistory.project = projectId;
    createHistory.url = projectUrl;
    await this.repo.save(createHistory);
    return createHistory.id;
  }
  async getLastEvent() {
    return this.repo.findOne({
      relations: ['project'],
      where: { status: 'down' },
      order: { id: 'DESC' },
    });
  }
}
