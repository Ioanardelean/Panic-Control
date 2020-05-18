import { getRepository, Repository } from 'typeorm';
import { Project } from '../../models/Project';
import { User } from '../../models/User';

let repository = new Repository<Project>();
function initialize() {
  repository = getRepository(Project);
}

export async function getProjects(userId: User) {
  initialize();
  return repository.find({ relations: ['user', 'histories'], where: { user: userId } });
}
export async function getAll() {
  initialize();
  return repository.find({ relations: ['user', 'histories'] });
}

export async function addItem(project: Project, userId: User) {
  const proj = project;
  proj.user = userId;
  await repository.save(proj);
  return proj.id;
}

export async function getProjectById(id: number, userId: any) {
  return repository.findOne({
    where: { id, user: userId },
    relations: ['user', 'histories'],
  });
}

export async function getProjectOnStatusStopped(userId: User) {
  initialize();
  return repository.findAndCount({
    where: { user: userId, status: 'stopped' },
  });
}

// tslint:disable-next-line: no-identical-functions
export async function getProjectOnStatusActive(userId: User) {
  initialize();
  return repository.findAndCount({
    where: { user: userId, status: 'up' },
  });
}
// tslint:disable-next-line: no-identical-functions
export async function getProjectOnStatusDown(userId: User) {
  initialize();
  return repository.findAndCount({
    where: { user: userId, status: 'down' },
  });
}

export async function updateProjectById(id: number, payload: any) {
  const project = await repository.findOne({ where: { id } });
  const projectToUpdate = repository.merge(project, payload);
  return repository.save(projectToUpdate);
}

export async function deleteProjectById(id: number, userId: any) {
  const projectToRemove = await repository.findOne({
    where: { id, user: userId },
    relations: ['user', 'histories'],
  });
  return repository.remove(projectToRemove);
}
export async function deleteProject(id: number) {
  const projectToRemove = await repository.findOne({
    where: { id },
    relations: ['histories'],
  });
  return repository.remove(projectToRemove);
}

export async function getDowntimeOnYear(userId: User, id: number) {
  return repository.query(`SELECT project.id,user_id, name, "startedAt", history.status, history.uptime
	FROM project
	INNER JOIN history ON history.project_id = project.id
	inner join user on project.user_id= ${userId}
  WHERE EXTRACT(year FROM "startedAt") = extract (year FROM CURRENT_DATE)
  and project.id = ${id}
  order by "startedAt" asc
 `);
}

export async function getDowntimeOnMonth(userId: User) {
  return repository.query(`SELECT project.id, user_id, name, "startedAt", history.status
	FROM project
	INNER JOIN history ON history.project_id = project.id
	inner join user on project.user_id= ${userId}
  WHERE EXTRACT(month FROM "startedAt") = extract (month FROM CURRENT_DATE)
  and  history.status = 'down'`);
}
export async function getDowntimeSinceCreation(userId: User, id: number) {
  return repository.query(`SELECT project.id,user_id, name, project.url, "startedAt", history.status
	FROM project
	INNER JOIN history ON history.project_id = project.id
	inner join user on project.user_id= ${userId}
  WHERE  project.id = ${id}
  and  history.status = 'down'`);
}
