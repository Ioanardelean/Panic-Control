import config from 'config';
import { MailerTransport } from '../../lib/mailer/mailerTransport';
import { MonitorService } from '../../services/MonitorService';
import HealthCheck from './HealthCheck';

class MainCheckHealth {
  mailerTransport: MailerTransport;

  monitorsTest: any[];

  constructor() {
    this.monitorsTest = [];
    this.initMailer();
  }
  initMailer() {
    const configMailer = config.get('mailer');
    this.mailerTransport = new MailerTransport(configMailer);
  }
  async startHealthCheck() {
    const monitorService = new MonitorService();
    const monitors = await monitorService.getAll();
    monitors.forEach(async (monitor: any) => {
      this.monitorsTest.push({
        id: monitor.id,
        healthCheck: new HealthCheck(monitor, this.mailerTransport),
      });
    });
  }

  stopTestByMonitorId(monitorId: string) {
    const monitorTest = this.monitorsTest.filter(
      (monitor: any) => String(monitor.id) === String(monitorId)
    )[0];

    if (monitorTest) {
      monitorTest.healthCheck.stop();
    }
  }
  startTestByMonitorId(monitorId: string) {
    const monitorTest = this.monitorsTest.filter(
      (monitor: any) => String(monitor.id) === String(monitorId)
    )[0];
    if (monitorTest) {
      monitorTest.healthCheck.start();
    }
  }
}

const HealthCheckHandler = new MainCheckHealth();
export default HealthCheckHandler;
