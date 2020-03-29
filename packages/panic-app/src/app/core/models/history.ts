export enum Status {
  UP = 'up',
  DOWN = 'down',
  STOPPED = 'stopped',
}
export class History {
  id: string;
  status: Status.DOWN;
  startedAt: string;
  uptime: number;
}
