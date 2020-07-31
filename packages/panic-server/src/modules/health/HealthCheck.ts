import fs from 'fs';
import isReachable from 'is-reachable';
import { MailerTransport } from 'lib/mailer/mailerTransport';
import { template } from 'lodash';
import { History } from '../../models/History';
import { Monitor } from '../../models/Monitor';
import { Status } from '../../models/Status';
import { HistoryService } from '../../services/HistoryService';
import { MonitorService } from '../../services/MonitorService';

const cwd = process.cwd();
const panicMailTpl = fs.readFileSync(
  `${cwd}/src/public/assets/templates/panic_mail.html`,
  'utf8'
);

export default class HealthCheck {
  mailerTransport: MailerTransport;

  monitorService = new MonitorService();
  historyService = new HistoryService();

  monitor: Monitor;

  running: boolean;

  timer: any;

  constructor(monitor: Monitor, mailerTransport: MailerTransport) {
    this.monitor = monitor;

    this.running = this.monitor.testRunning;
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
   * @param {Monitor}  monitorId;
   *
   * server is not reachable, change status into database
   * show up in frontend with socket io the status down
   *
   * response of is reachable method is false, sent a email alert
   * stop the running test for 10 minutes and retest the server
   *
   *
   */

  // tslint:disable-next-line: cognitive-complexity
  init() {
    const payloadHistory = new History();
    const socketClient = (global as any).socketMap[this.monitor.user.id];
    const monitorInterval = this.convertMinutesToMilliseconds(
      this.monitor.monitorInterval
    );
    const ping = this.monitor.ping * 1000;

    this.timer = setTimeout(async () => {
      if (this.running) {
        const reachable: boolean = await isReachable(this.monitor.url, {
          timeout: ping,
        });
        console.log(reachable);
        if (!reachable) {
          payloadHistory.status = Status.DOWN;
          this.getHistory(payloadHistory);
          this.monitorStatus('down');

          if (socketClient) {
            socketClient.emit(`projectsUpdate-${this.monitor.user.id}`, {
              ...this.monitor,
              status: 'down',
            });
          }

          this.sendEmail(this.monitor.receiver, this.monitor.emailTemplate);
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
            socketClient.emit(`projectsUpdate-${this.monitor.user.id}`, {
              ...this.monitor,
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
    await this.monitorService.changeStatus(this.monitor.id, { status: stat });
  }

  async getHistory(payload: any) {
    await this.historyService.addHistory(payload, this.monitor, this.monitor.url);
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
        data: { MonitorUrl: this.monitor.url, MonitorName: this.monitor.name },
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
