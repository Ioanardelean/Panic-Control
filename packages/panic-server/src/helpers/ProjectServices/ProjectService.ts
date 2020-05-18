import { getRepository } from 'typeorm';
import { Project } from '../../models/Project';
import { User } from '../../models/User';

export class ProjectService {
  repo = getRepository(Project);

  async getProjects(userId: User) {
    return this.repo.find({ relations: ['user', 'histories'], where: { user: userId } });
  }
  async getAll() {
    return this.repo.find({ relations: ['user', 'histories'] });
  }

  async addItem(project: Project, userId: User) {
    const proj = project;
    proj.user = userId;
    await this.repo.save(proj);
    return proj.id;
  }

  async getProjectById(id: number, userId: any) {
    return this.repo.findOne({
      where: { id, user: userId },
      relations: ['user', 'histories'],
    });
  }

  async getProjectOnStatusStopped(userId: User) {
    return this.repo.findAndCount({
      where: { user: userId, status: 'stopped' },
    });
  }

  // tslint:disable-next-line: no-identical-functions
  async getProjectOnStatusActive(userId: User) {
    return this.repo.findAndCount({
      where: { user: userId, status: 'up' },
    });
  }

  // tslint:disable-next-line: no-identical-functions
  async getProjectOnStatusDown(userId: User) {
    return this.repo.findAndCount({
      where: { user: userId, status: 'down' },
    });
  }

  async updateProjectById(id: number, payload: any) {
    const project = await this.repo.findOne({ where: { id } });
    const projectToUpdate = this.repo.merge(project, payload);
    return this.repo.save(projectToUpdate);
  }

  async deleteProjectById(id: number, userId: any) {
    const projectToRemove = await this.repo.findOne({
      where: { id, user: userId },
      relations: ['user', 'histories'],
    });
    return this.repo.remove(projectToRemove);
  }
  async deleteProject(id: number) {
    const projectToRemove = await this.repo.findOne({
      where: { id },
      relations: ['histories'],
    });
    return this.repo.remove(projectToRemove);
  }

  async getDowntimeOnYear(userId: User, id: number) {
    return this.repo
      .query(`SELECT project.id,user_id, name, "startedAt", history.status, history.uptime
    FROM project
    INNER JOIN history ON history.project_id = project.id
    inner join user on project.user_id= ${userId}
    WHERE EXTRACT(year FROM "startedAt") = extract (year FROM CURRENT_DATE)
    and project.id = ${id}
    order by "startedAt" asc
   `);
  }

  async getDowntimeOnMonth(userId: User) {
    return this.repo.query(`SELECT project.id, user_id, name, "startedAt", history.status
    FROM project
    INNER JOIN history ON history.project_id = project.id
    inner join user on project.user_id= ${userId}
    WHERE EXTRACT(month FROM "startedAt") = extract (month FROM CURRENT_DATE)
    and  history.status = 'down'`);
  }
  async getDowntimeSinceCreation(userId: User, id: number) {
    return this.repo
      .query(`SELECT project.id,user_id, name, project.url, "startedAt", history.status
    FROM project
    INNER JOIN history ON history.project_id = project.id
    inner join user on project.user_id= ${userId}
    WHERE  project.id = ${id}
    and  history.status = 'down'`);
  }
}
