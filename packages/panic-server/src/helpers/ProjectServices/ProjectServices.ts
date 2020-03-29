import { getRepository, Repository } from 'typeorm';
import { Project } from '../../models/ProjectModel';
import { User } from '../../models/UserModel';

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
  return repository.find({ relations: ['user'] });
}

export async function addItem(project: Project, userId: User) {
  const proj = project;
  proj.user = userId;
  await repository.save(proj);
  return proj.id;
}

export async function getProjectById(id: string, userId: any) {
  return repository.findOne({
    where: { id, user: userId },
    relations: ['user', 'histories'],
  });
}

export async function updateProjectById(id: string, payload: any) {
  const project = await repository.findOne({ where: { id } });
  const projectToUpdate = repository.merge(project, payload);
  return repository.save(projectToUpdate);
}

export async function deleteProjectById(id: string, userId: any) {
  const projectToRemove = await repository.findOne({
    where: { id, user: userId },
    relations: ['user', 'histories'],
  });
  return repository.remove(projectToRemove);
}
