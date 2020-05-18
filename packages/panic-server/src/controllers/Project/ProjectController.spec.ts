import ValidUrl from 'valid-url';
import * as projectService from '../../helpers/ProjectServices/ProjectServices';
import CheckHealth from '../../modules/health/MainCheckHealth';
import ProjectController from './ProjectController';

describe('should get a CRUD project ', () => {
  let project: ProjectController;

  const ctx: any = {
    state: {
      user: {
        id: 23,
      },
    },
    body: { error: 'Url or email is wrong' },
    params: {
      id: 2,
    },
    request: {
      body: {},
    },
    status: 204,
  };

  beforeAll(() => {
    project = new ProjectController();
  });

  it('to be defined', () => {
    expect(project.create).toBeDefined();
  });

  it('should get all projects', async () => {
    spyOn(projectService, 'getProjects').and.returnValue({});
    await project.getAllProjects(ctx);
    expect(projectService.getProjects).toHaveBeenCalled();
  });

  it('should get project by id', async () => {
    spyOn(projectService, 'getProjectById').and.returnValue({});
    await project.getProject(ctx);
    expect(projectService.getProjectById).toHaveBeenCalled();
  });

  it('should create a project', async () => {
    spyOn(ValidUrl, 'isUri').and.returnValue(true);
    spyOn(projectService, 'addItem').and.returnValue(Promise.resolve([]));
    await project.create(ctx);
    expect(ValidUrl.isUri).toHaveBeenCalled();
    expect(projectService.addItem).toHaveBeenCalled();
  });

  it('should show error if fail creation', async () => {
    spyOn(ValidUrl, 'isUri').and.returnValue(false);
    spyOn(projectService, 'addItem').and.returnValue(Promise.resolve([]));
    await project.create(ctx);
    expect(ValidUrl.isUri).toHaveBeenCalled();
    expect(projectService.addItem).not.toHaveBeenCalled();
  });

  it('should update project', async () => {
    spyOn(ValidUrl, 'isUri').and.returnValue(true);
    spyOn(projectService, 'updateProjectById').and.returnValue(Promise.resolve({}));
    await project.update(ctx);
    expect(ValidUrl.isUri).toHaveBeenCalled();
    expect(projectService.updateProjectById).toHaveBeenCalled();
  });

  it('should delete project', async () => {
    spyOn(projectService, 'deleteProjectById').and.returnValue(Promise.resolve({}));
    await project.delete(ctx);
    expect(projectService.deleteProjectById).not.toHaveBeenCalledWith();
  });

  it('should start project', async () => {
    spyOn(CheckHealth, 'startTestByProjectId').and.returnValue({});
    await project.start(ctx);
    expect(CheckHealth.startTestByProjectId).not.toHaveBeenCalledWith(ctx.params.id);
  });
  it('should stop project', async () => {
    spyOn(CheckHealth, 'stopTestByProjectId');
    await project.stop(ctx);
    expect(CheckHealth.stopTestByProjectId).not.toHaveBeenCalledWith(ctx.params.id);
  });

  it('should count project on their status', async () => {
    const userId = 23;
    spyOn(projectService, 'getProjectOnStatusActive').and.returnValue({});
    spyOn(projectService, 'getProjectOnStatusDown').and.returnValue({});
    spyOn(projectService, 'getProjectOnStatusStopped').and.returnValue({});
    await project.getCountProject(ctx);
    expect(projectService.getProjectOnStatusActive).toHaveBeenCalledWith(userId);
    expect(projectService.getProjectOnStatusDown).toHaveBeenCalledWith(userId);
    expect(projectService.getProjectOnStatusStopped).toHaveBeenCalledWith(userId);
  });
});
