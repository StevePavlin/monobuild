// eslint-disable-next-line max-classes-per-file
import GetCommitsThatTouchedPackage from '../core/commands/get-commits-that-touched-package';
import { setupTestProject, commitToPackage } from './helper';
import WorkflowScheduler from '../core/workflow-scheduler';

describe('GetCommitsThatTouchedPackage', () => {
  it('should be able to return commits that touch a package', async () => {
    const { foo, bar } = await setupTestProject();

    const firstCommit = await commitToPackage(
      foo.getValue(),
      'testing',
      'a.file'
    );
    const secondCommit = await commitToPackage(
      foo.getValue(),
      'testing',
      'b.file'
    );
    const thirdCommit = await commitToPackage(
      foo.getValue(),
      'testing',
      'c.file'
    );
    const fourthCommit = await commitToPackage(
      bar.getValue(),
      'testing',
      'c.file'
    );

    expect(firstCommit.isSuccess).toBeTruthy();
    expect(secondCommit.isSuccess).toBeTruthy();
    expect(thirdCommit.isSuccess).toBeTruthy();
    expect(fourthCommit.isSuccess).toBeTruthy();

    const fooResult = await new GetCommitsThatTouchedPackage(
      firstCommit.getValue(),
      fourthCommit.getValue(),
      foo.getValue()
    ).execute();

    expect(fooResult).toHaveLength(2);
    expect(fooResult).toContainEqual(secondCommit);
    expect(fooResult).toContainEqual(thirdCommit);

    const barResult = await new GetCommitsThatTouchedPackage(
      firstCommit.getValue(),
      fourthCommit.getValue(),
      bar.getValue()
    ).execute();

    expect(barResult).toHaveLength(1);
    expect(barResult).toContainEqual(fourthCommit);
  });
});
describe.skip('GetLatestCommitFromParentBranch', () => {});

describe.skip('WorklowScheduler#loadPackagesFromConfig', () => {
  it('should load packages from package.json', async () => {
    const { foo, bar } = await setupTestProject();

    process.chdir('/home/test');
  });

  it('should throw an error if a package doesnt exist on disk', () => {});
});
