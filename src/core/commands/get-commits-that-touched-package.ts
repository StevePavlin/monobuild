import Commit from '../commit';
import Package from '../package';
import SystemCommand from './system-command';
import Result from '../../shared/result';

export default class GetCommitsThatTouchedPackage extends SystemCommand {
  constructor(
    private previousCommit: Commit,
    private currentCommit: Commit,
    private pkg: Package
  ) {
    super();
  }

  async execute(): Promise<Result<Commit>[]> {
    const result = await this.baseExecute(
      `git log --format=format:%H ${this.previousCommit.shaHash}..${this.currentCommit.shaHash} ${this.pkg.path}`
    );
    if (result.length > 0) {
      return result.split('\n').map((sha) => Commit.create({ shaHash: sha }));
    }
    return [];
  }
}
