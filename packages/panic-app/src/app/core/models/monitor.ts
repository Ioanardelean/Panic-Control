export enum Status {
  UP = 'up',
  DOWN = 'down',
  STOPPED = 'stopped',
}
export class Project {
  id: string;
  name: string;
  description: string;
  url: string;
  receiver: string;
  emailTemplate: string;
  ping: number;
  monitorInterval: number;
  testRunning: boolean;
  status: Status;
}
