import childProcess from 'child_process';
import { logger } from '../../shared/logger';

export default abstract class SystemCommand {
  private static cwd: string = process.cwd();

  public static setCwd(cwd: string) {
    SystemCommand.cwd = cwd;
  }

  private executor: Function = childProcess.exec;

  protected async baseExecute(text: string): Promise<string> {
    return new Promise((resolve, reject) => {
      logger.debug(`Executing system cmd: ${text}`);
      this.executor(
        text,
        {
          cwd: SystemCommand.cwd,
          env: process.env,
        },
        (error: string, stdout: string, stderr: string) => {
          if (stderr) {
            logger.debug(`Error for system cmd ${text} -> ${stderr}`);
            return reject(stderr);
          }

          logger.debug(`Response for system cmd ${text} -> ${stdout}`);
          return resolve(stdout);
        }
      );
    });
  }

  abstract async execute(): Promise<any>;
}
