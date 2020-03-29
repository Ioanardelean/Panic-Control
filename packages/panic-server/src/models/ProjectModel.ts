import { IsEmail, IsNotEmpty, IsUrl } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { History } from './HistoryModel';
import { User } from './UserModel';

export enum Status {
  UP = 'up',
  DOWN = 'down',
  STOPPED = 'stopped',
}

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true, nullable: false, length: 100 })
  @IsNotEmpty()
  name: string;

  @Column({ nullable: true, length: 5000 })
  description: string;

  @Column({ unique: true, nullable: false, length: 2083 })
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @Column({ nullable: false, length: 255 })
  @IsEmail()
  @IsNotEmpty()
  receiver: string;

  @Column({ nullable: true, type: 'text' })
  emailTemplate: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  ping: number;

  @Column({ nullable: false })
  @IsNotEmpty()
  monitorInterval: number;

  @Column({ nullable: false, default: false })
  testRunning: boolean;

  @Column({ type: 'enum', enum: Status, default: Status.STOPPED })
  status: Status;

  @ManyToOne(
    () => User,
    (user: User) => user
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
