import { getRepository, Repository } from 'typeorm';
import { History } from '../../models/History';
import { Project } from '../../models/Project';

let repository = new Repository<History>();
function initialize() {
  repository = getRepository(History);
}

export async function addHistory(history: History, projectId: Project, projectUrl: any) {
  initialize();
  const createHistory = history;
  createHistory.project = projectId;
  createHistory.url = projectUrl;
  await repository.save(createHistory);
  return createHistory.id;
}
export async function getLastEvent() {
  initialize();

  return repository.findOne({
    relations: ['project'],
    where: { status: 'down' },
    order: { id: 'DESC' },
  });
}
