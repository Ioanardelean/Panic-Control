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
   * init Health test for each monitor
   *
   */
  init() {
    const monitorInterval = this.convertMinutesToMilliseconds();
    const ping = this.convertSecondsToMilliseconds();
    // if monitor is started, it will e tested over the specific interval
    this.timer = setTimeout(async () => {
      if (this.running) {
        /**
         * @function isReachable check availability of servers
         * @param {string} url the target of methods
         * @param {number} ping in milliseconds.
         * @returns {boolean} response.
         */
        const reachable: boolean = await isReachable(this.monitor.url, {
          timeout: ping,
        });
        console.log(reachable);
        if (!reachable) {
          /**
           * given server is not available the downtime is store in db
           * socket.io emit down event
           * send email alert
           */
          this.storeIncident();
          this.emitAvailability('down');
          this.sendEmail(this.monitor.receiver, this.monitor.emailTemplate);
          /**
           * the availability test will be stopped
           * and retest during the incident of 10 min interval
           */
          this.stop();
          this.retest();
        } else {
          // given server is available the metric is stored in db and emit event
          this.storeAvailability();
          this.emitAvailability('up');
        }
        this.init();
      }
    }, monitorInterval);
  }

  async emitAvailability(stat: string) {
    await this.monitorService.changeStatus(this.monitor.id, { status: stat });
    const socketClient = (global as any).socketMap[this.monitor.user.id];
    if (socketClient) {
      socketClient.emit(`projectsUpdate-${this.monitor.user.id}`, {
        ...this.monitor,
        status: stat,
      });
    }
  }
  retest() {
    setTimeout(() => {
      this.start();
    }, 1000 * 60 * 10);
  }
  storeAvailability() {
    const payloadHistory = new History();
    payloadHistory.status = Status.UP;
    payloadHistory.uptime = 1;
    this.getHistory(payloadHistory);
  }

  storeIncident() {
    const payloadHistory = new History();
    payloadHistory.status = Status.DOWN;
    this.getHistory(payloadHistory);
  }
  convertMinutesToMilliseconds() {
    const minutes = this.monitor.monitorInterval;
    return Math.floor(minutes * 60 * 1000);
  }

  convertSecondsToMilliseconds() {
    return this.monitor.ping * 1000;
  }

  async getHistory(payload: any) {
    await this.historyService.addHistory(payload, this.monitor, this.monitor.url);
    const payloadHistory = new History();
    payloadHistory.status = Status.DOWN;
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
