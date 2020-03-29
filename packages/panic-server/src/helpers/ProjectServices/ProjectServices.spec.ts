import {  Repository } from 'typeorm';
import { Project } from '../../models/ProjectModel';



describe('should get a CRUD project ', () => {
   const repository = new Repository<Project>();

    it('should initialise the repository', async() => {
        expect(repository).toBeDefined();
    });
});
