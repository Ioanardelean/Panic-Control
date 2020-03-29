import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './ProjectModel';

export enum Status {
  DOWN = 'down',
  UP = 'up',
}
@Entity()
export class History {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'enum', enum: Status, default: Status.DOWN })
  status: Status;

  @Column({ default: 0 })
  uptime: number;

  @Column()
  @CreateDateColumn()
  startedAt: Date;

  @ManyToOne(
    () => Project,
    (project: Project) => project.histories,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
