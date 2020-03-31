import fs from 'fs';
import isReachable = require('is-reachable');
import { MailerTransport } from 'lib/mailer/mailerTransport';
import { template } from 'lodash';
import { addHistory } from '../../helpers/HistoryService/HistoryService';
import { updateProjectById } from '../../helpers/ProjectServices/ProjectServices';
import { History, Status } from '../../models/HistoryModel';
import { Project } from '../../models/ProjectModel';

const cwd = process.cwd();
const panicMailTpl = fs.readFileSync(
  `${cwd}/src/public/assets/templates/panic_mail.html`,
  'utf8'
);

export default class HealthCheck {
  mailerTransport: MailerTransport;

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
   * @function isRechable check avaibility of servers
   * @param {string} url the target of methode
   * @param {number} ping in miliseconds.
   * @param {number} monitorInterval in miliseconds.
   * @returns {boolean} response.
   *
   * @remarks insert incident stat into database with addHistory methode
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
    const monitorInterval = this.project.monitorInterval * 1000;
    const ping = this.project.ping * 1000;

    this.timer = setTimeout(async () => {
      if (this.running) {
        const reachable: boolean = await isReachable(this.project.url, {
          timeout: ping,
        });
        console.log(reachable);
        if (!reachable) {
          payloadHistory.status = Status.DOWN;
          await addHistory(payloadHistory, this.project);
          await updateProjectById(this.project.id, { status: 'down' });

          if (socketClient) {
            socketClient.emit(`projectsUpdate-${this.project.user.id}`, {
              ...this.project,
              status: 'down',
            });
          }

          this.sendEmail(this.project.receiver, this.project.emailTemplate);
          this.stop();

          setTimeout(() => {
            this.start();
          }, 1000 * 60 * 10);
        } else {
          payloadHistory.status = Status.UP;
          payloadHistory.uptime = 1;
          await addHistory(payloadHistory, this.project);
          await updateProjectById(this.project.id, { status: 'up' });
          if (socketClient) {
            socketClient.emit(`projectsUpdate-${this.project.user.id}`, {
              ...this.project,
              status: 'up',
            });
          }
          this.init();
        }
      }
    }, monitorInterval);
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

    try {
      await this.mailerTransport.sendEmail({
        from: 'panic.control.all@gmail.com',
        to,
        subject: 'test uptime',
        html,
      });
    } catch (error) {
      console.log(error);
    }
  }
}