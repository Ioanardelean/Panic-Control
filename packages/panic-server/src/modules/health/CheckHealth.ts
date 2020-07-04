import fs from 'fs';
import isReachable from 'is-reachable';
import { MailerTransport } from 'lib/mailer/mailerTransport';
import { template } from 'lodash';
import { HistoryService } from '../../helpers/HistoryService/HistoryService';
import { ProjectService } from '../../helpers/ProjectServices/ProjectService';
import { History } from '../../models/History';
import { Project } from '../../models/Project';
import { Status } from '../../models/Status';

const cwd = process.cwd();
const panicMailTpl = fs.readFileSync(
  `${cwd}/src/public/assets/templates/panic_mail.html`,
  'utf8'
);

export default class HealthCheck {
  mailerTransport: MailerTransport;

  projectService = new ProjectService();
  historyService = new HistoryService();

  project: Project;

  running: boolean;

  timer: any;

  constructor(project: Project, mailerTransport: MailerTransport) {
    this.project = project;

    this.running = this.project.testRunning;
    this.mailerTransport = mailerTransport;
    this.init();
  }
  /**
   * @function isReachable check availability of servers
   * @param {string} url the target of methods
   * @param {number} ping in milliseconds.
   * @param {number} monitorInterval in milliseconds.
   * @returns {boolean} response.
   *
   * @remarks insert incident stat into database with addHistory method
   * @param {History} payloadHistory.
   * @param {Project}  projectId;
   *
   * server is not reachable, change status into database
   * show up in frontend with socket io the status down
   *
   * response of is reachable method is false, sent a email alert
   * stop the running test for 10 minutes and retest the server
   *
   *
   */

  init() {
    const payloadHistory = new History();
    const socketClient = (global as any).socketMap[this.project.user.id];
    const monitorInterval = this.convertMinutesToMilliseconds(
      this.project.monitorInterval
    );
    const ping = this.project.ping * 1000;

    this.timer = setTimeout(async () => {
      if (this.running) {
        const reachable: boolean = await isReachable(this.project.url, {
          timeout: ping,
        });
        console.log(reachable);
        if (!reachable) {
          payloadHistory.status = Status.DOWN;
          this.getHistory(payloadHistory);
          this.monitorStatus('down');

          if (socketClient) {
            socketClient.emit(`projectsUpdate-${this.project.user.id}`, {
              ...this.project,
              status: 'down',
            });
          }

          this.sendEmail(this.project.receiver, this.project.emailTemplate);
          this.stop();

          setTimeout(() => {
            if (this.running) {
              this.start();
            }
          }, 1000 * 60 * 10);
        } else {
          payloadHistory.status = Status.UP;
          payloadHistory.uptime = 1;
          this.getHistory(payloadHistory);
          this.monitorStatus('up');
          if (socketClient) {
            socketClient.emit(`projectsUpdate-${this.project.user.id}`, {
              ...this.project,
              status: 'up',
            });
          }
        }
        this.init();
      }
    }, monitorInterval);
  }
  convertMinutesToMilliseconds(minutes: any) {
    return Math.floor(minutes * 60 * 1000);
  }

  async monitorStatus(stat: string) {
    await this.projectService.changeStatus(this.project.id, { status: stat });
  }

  async getHistory(payload: any) {
    await this.historyService.addHistory(payload, this.project, this.project.url);
  }
  stop() {
    clearTimeout(this.timer);
    this.running = false;
  }

  start() {
    this.running = true;
    this.init();
  }
  async sendEmail(to: string, html: string) {
    if (!html) {
      html = template(panicMailTpl)({
        data: { ProjectUrl: this.project.url, ProjectName: this.project.name },
      });
    }

    await this.mailerTransport.sendEmail({
      from: 'panic.control.all@gmail.com',
      to,
      subject: 'Downtime alert',
      html,
    });
  }
}
