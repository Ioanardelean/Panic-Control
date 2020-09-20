import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { AbstractEntity } from './Entity';
import { History } from './History';
import { Status } from './Status';
import { User } from './User';

@Entity()
@Index('monitor_name_url_IDX', ['name', 'url'])
@Unique('monitor_name_url_UNIQUE', ['name', 'url'])
export class Monitor extends AbstractEntity {
  @Column({ nullable: false, length: 100, unique: true })
  private name: string;

  @Column({ nullable: true, length: 5000 })
  private description: string;

  @Column({ nullable: false, length: 250, unique: true })
  private url: string;

  @Column({ nullable: false, length: 255 })
  private receiver: string;

  @Column({ nullable: true, type: 'text', name: 'email_template' })
  private emailTemplate: string;

  @Column({ nullable: false })
  private ping: number;

  @Column({ nullable: false, name: 'monitor_interval' })
  private monitorInterval: number;

  @Column({ nullable: false, default: false, name: 'test_running' })
  private testRunning: boolean;

  @Column({ type: 'enum', enum: Status, default: Status.STOPPED })
  private status: Status;

  @ManyToOne(
    () => User,
    (user: User) => user,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE', nullable: false }
  )
  @JoinColumn({ name: 'user_id' })
  private user: User;

  @OneToMany(
    () => History,
    history => history.Monitor
  )
  private histories: History[];
  constructor() {
    super();
  }
  get Name(): string {
    return this.name;
  }

  set Name(name: string) {
    this.name = name;
  }
  get Description(): string {
    return this.description;
  }

  set Description(description: string) {
    this.description = description;
  }
  get Receiver(): string {
    return this.receiver;
  }

  set Receiver(receiver: string) {
    this.receiver = receiver;
  }
  get Histories(): History[] {
    return this.histories;
  }

  set Histories(histories: History[]) {
    this.histories = histories;
  }
  get Ping(): number {
    return this.ping;
  }

  set Ping(ping: number) {
    this.ping = ping;
  }
  get MonitorInterval(): number {
    return this.monitorInterval;
  }

  set MonitorInterval(monitorInterval: number) {
    this.monitorInterval = monitorInterval;
  }
  get Status(): Status {
    return this.status;
  }

  set Status(status: Status) {
    this.status = status;
  }
  get Url(): string {
    return this.url;
  }

  set Url(url: string) {
    this.url = url;
  }
  get TestRunning(): boolean {
    return this.testRunning;
  }

  set TestRunning(testRunning: boolean) {
    this.testRunning = testRunning;
  }
  get EmailTemplate(): string {
    return this.emailTemplate;
  }

  set EmailTemplate(emailTemplate: string) {
    this.emailTemplate = emailTemplate;
  }
  get User(): User {
    return this.user;
  }

  set User(user: User) {
    this.user = user;
  }
}
