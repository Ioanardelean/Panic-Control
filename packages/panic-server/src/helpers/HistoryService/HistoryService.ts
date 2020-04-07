import { getRepository, Repository } from 'typeorm';
import { History } from '../../models/HistoryModel';
import { Project } from '../../models/ProjectModel';

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
