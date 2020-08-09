import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { AbstractEntity } from './Entity';
import { History } from './History';
import { Status } from './Status';
import { User } from './User';

@Entity()
@Index('monitor_name_url_IDX', ['name', 'url'])
@Unique('monitor_name_url_UNIQUE', ['name', 'url'])
export class Monitor extends AbstractEntity {
  @Column({ nullable: false, length: 100 })
  name: string;

  @Column({ nullable: true, length: 5000 })
  description: string;

  @Column({ nullable: false, length: 250 })
  url: string;

  @Column({ nullable: false, length: 255 })
  receiver: string;

  @Column({ nullable: true, type: 'text', name: 'email_template' })
  emailTemplate: string;

  @Column({ nullable: false })
  ping: number;

  @Column({ nullable: false, name: 'monitor_interval' })
  monitorInterval: number;

  @Column({ nullable: false, default: false, name: 'test_running' })
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
