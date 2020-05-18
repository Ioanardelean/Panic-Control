import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { History } from './History';
import { Status } from './Status';
import { User } from './User';

@Entity()
export class Project {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true, nullable: false, length: 100 })
  name: string;

  @Column({ nullable: true, length: 5000 })
  description: string;

  @Column({ unique: true, nullable: false, length: 2083 })
  url: string;

  @Column({ nullable: false, length: 255 })
  receiver: string;

  @Column({ nullable: true, type: 'text' })
  emailTemplate: string;

  @Column({ nullable: false })
  ping: number;

  @Column({ nullable: false })
  monitorInterval: number;

  @Column({ nullable: false, default: false })
  testRunning: boolean;

  @Column({ type: 'enum', enum: Status, default: Status.STOPPED })
  status: Status;

  @ManyToOne(
    () => User,
    (user: User) => user,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE', nullable: false }
  )
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(
    () => History,
    history => history.project,
    { cascade: true }
  )
  histories: History[];
}
