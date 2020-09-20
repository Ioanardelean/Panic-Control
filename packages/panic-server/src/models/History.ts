import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from './Entity';
import { Monitor } from './Monitor';
import { Status } from './Status';

@Entity()
export class History extends AbstractEntity {
  @Column({ type: 'enum', enum: Status, default: Status.DOWN })
  private status: Status;

  @Column({ nullable: false, length: 2083 })
  private url: string;

  @Column({ default: 0 })
  private uptime: number;

  @Column({ nullable: false })
  @CreateDateColumn()
  private startedAt: Date;

  @ManyToOne(
    () => Monitor,
    (monitor: Monitor) => monitor.Histories,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  @JoinColumn({ name: 'monitor_id' })
  private monitor: Monitor;
  constructor() {
    super();
  }
  get Status(): Status {
    return this.status;
  }

  set Status(status: Status) {
    this.status = status;
  }

  get Uptime(): number {
    return this.uptime;
  }

  set Uptime(uptime: number) {
    this.uptime = uptime;
  }

  get Url(): string {
    return this.url;
  }

  set Url(url: string) {
    this.url = url;
  }
  get StartedAt(): Date {
    return this.startedAt;
  }

  set StartedAt(startedAt: Date) {
    this.startedAt = startedAt;
  }
  get Monitor(): Monitor {
    return this.monitor;
  }

  set Monitor(monitor: Monitor) {
    this.monitor = monitor;
  }

  isAvailable() {
    return (this.status = Status.UP);
  }
  isNotAvailable() {
    return (this.status = Status.DOWN);
  }

  isUP() {
    return (this.uptime = 1);
  }
}
