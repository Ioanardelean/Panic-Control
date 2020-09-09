import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from './Entity';
import { Monitor } from './Monitor';
import { Status } from './Status';

@Entity()
export class History extends AbstractEntity {
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
    () => Monitor,
    (monitor: Monitor) => monitor.histories,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  @JoinColumn({ name: 'monitor_id' })
  monitor: Monitor;
}
