import Debug from 'debug';

export class Logger {
  debugger: Function;

  constructor(name: string) {
    this.debugger = Debug('monorepo-tooling');
  }

  debug(...args: any[]) {
    this.debugger(...args);
  }
}

export const logger = new Logger('monorepo-tooling');
