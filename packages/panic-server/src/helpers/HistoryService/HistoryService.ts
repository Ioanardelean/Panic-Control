import { getRepository, Repository } from 'typeorm';
import { History } from '../../models/HistoryModel';
import { Project } from '../../models/ProjectModel';

let repository = new Repository<History>();
function initialize() {
  repository = getRepository(History);
}

export async function getHistorie() {
  initialize();
  return repository.find({
    relations: ['project'],
    where: { status: 'down' },
  });
}

export async function addHistory(history: History, projectId: Project) {
  initialize();
  const createHistory = history;
  createHistory.project = projectId;
  await repository.save(createHistory);
  return createHistory.id;
}
