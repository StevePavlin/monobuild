import Branch from '../branch';
import Commit from '../commit';
import Result from '../../shared/result';

export interface CIProvider {
  getLastSuccessfullyBuiltCommit(branch: Branch): Promise<Result<Commit>>;
  getCurrentBranch(): Branch;
}
