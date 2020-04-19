import CircleCI, { CircleCIWorkflowResponse } from './circleci';
import Commit from '../commit';
import Branch from '../branch';
import { IHttpClient, HttpRequestOptions } from '../../shared/http-client';
import Result from '../../shared/result';

function setup(response: any = []): CircleCI {
  class MockHttpClient implements IHttpClient {
    // eslint-disable-next-line class-methods-use-this
    get(options: HttpRequestOptions): Promise<any> {
      return Promise.resolve(response);
    }
  }

  const circleCi = new CircleCI({
    environment: {
      commit: Commit.create({
        shaHash: 'fd6e4b5f4bb7c2cdeb1abe621734ff95e02c4caa',
      }).getValue(),
      branch: Branch.create({ name: 'master' }).getValue(),
      projectRepoName: 'an-awesome-repo',
      projectUsername: 'PeterGriffin',
      vcsProvider: 'github',
      token: '123',
    },
    httpClient: new MockHttpClient(),
  });

  return circleCi;
}

it('should fail if last branch is not available on circleci', async () => {
  const response = [
    // eslint-disable-next-line @typescript-eslint/camelcase
    { vcs_revision: '123', status: 'not success' },
  ];
  const circleCi = setup(response);
  const result = await circleCi.getLastSuccessfullyBuiltCommit(
    circleCi.getCurrentBranch()
  );

  expect(result.isFailure).toEqual(true);
  expect(result.error).toEqual('Commit was not found on CircleCI');
});
it('should return last successful commit if available on circleci', async () => {
  const theLastSuccessfulCommit: Result<Commit> = Commit.create({
    shaHash: 'fd6e4b5f4bb7c2cdeb1abe621734ff95e02c4cbb',
  });
  const response = [
    {
      // eslint-disable-next-line @typescript-eslint/camelcase
      vcs_revision: theLastSuccessfulCommit.getValue().shaHash,
      status: 'success',
    },
  ];
  const circleCi = setup(response);
  const result = await circleCi.getLastSuccessfullyBuiltCommit(
    circleCi.getCurrentBranch()
  );

  expect(result.isSuccess).toEqual(true);
  expect(result.getValue()).toEqual(theLastSuccessfulCommit.getValue());
});
it('should load environment variables', () => {
  const oldEnv = process.env;

  process.env.CIRCLE_SHA1 = 'fd6e4b5f4bb7c2cdeb1abe621734ff95e02c4cbb';
  process.env.CIRCLE_BRANCH = 'master';
  process.env.CIRCLE_PROJECT_USERNAME = 'PeterGriffin';
  process.env.CIRCLE_PROJECT_REPONAME = 'a-project';
  process.env.CIRCLE_TOKEN = '123';

  expect(CircleCI.getEnvironment()).toEqual({
    commit: Commit.create({
      shaHash: 'fd6e4b5f4bb7c2cdeb1abe621734ff95e02c4cbb',
    }).getValue(),
    branch: Branch.create({
      name: 'master',
    }).getValue(),
    projectUsername: 'PeterGriffin',
    projectRepoName: 'a-project',
    vcsProvider: 'github',
    token: '123',
  });

  process.env = oldEnv;
});

it('should load current branch', () => {
  const circleCi = setup();

  const expected = Branch.create({ name: 'master' });
  expect(circleCi.getCurrentBranch()).toEqual(expected.getValue());
});
