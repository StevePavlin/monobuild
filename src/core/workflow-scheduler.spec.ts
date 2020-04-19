/* eslint-disable class-methods-use-this */
import WorkflowScheduler from './workflow-scheduler';
import { CIProvider } from './ci-plugins/ci-provider';
import Commit from './commit';
import Result from '../shared/result';
import Branch from './branch';
import Package from './package';

class MockCIProvider implements CIProvider {
  getLastSuccessfullyBuiltCommit(branch: Branch): Promise<Result<Commit>> {
    return Promise.resolve(
      Commit.create({ shaHash: 'fd6e4b5f4bb7c2cdeb1abe621734ff95e02c4cbb' })
    );
  }

  getCurrentBranch(): Branch {
    return Branch.create({ name: 'master' }).getValue();
  }
}

it.skip('should fail with path error if path doesnt exist on disk', () => {
  const pkg: Result<Package> = Package.create({
    name: 'valid',
    path: './packages/test',
  });

  expect(pkg.isFailure).toBeTruthy();
  expect(pkg.error).toEqual('Package does not exist on disk: ./packages/test');
});
