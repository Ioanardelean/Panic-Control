import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './ProjectModel';
import { Status } from './Status';

@Entity()
export class History {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'enum', enum: Status, default: Status.DOWN })
  status: Status;

  @Column({ nullable: false, length: 2083 })
  url: string;

  @Column({ default: 0 })
  uptime: number;

  @Column({ nullable: false })
  @CreateDateColumn()
  startedAt: Date;

  @ManyToOne(
    () => Project,
    (project: Project) => project.histories,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE', nullable: false }
  )
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
