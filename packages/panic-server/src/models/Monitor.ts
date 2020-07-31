import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from './Entity';
import { History } from './History';
import { Status } from './Status';
import { User } from './User';

@Entity()
export class Monitor extends AbstractEntity {
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
    history => history.monitor,
    { cascade: true }
  )
  histories: History[];
}
