import { CIProvider } from './ci-provider';
import Branch from '../branch';
import Commit from '../commit';
import { logger } from '../../shared/logger';
import Result from '../../shared/result';
import { IHttpClient } from '../../shared/http-client';

interface CircleCIEnvironment {
  commit: Commit;
  branch: Branch;
  projectUsername: string;
  projectRepoName: string;
  token: string;
  vcsProvider: string;
}

interface CircleCIProps {
  environment: CircleCIEnvironment;
  httpClient: IHttpClient;
}

export interface CircleCIWorkflowResponse {
  vcs_revision: string;
  status: string;
}

export default class CircleCI implements CIProvider {
  private readonly httpClient: IHttpClient;

  private readonly environment: CircleCIEnvironment;

  private readonly baseUrl: string;

  constructor(props: CircleCIProps) {
    this.httpClient = props.httpClient;
    this.environment = props.environment;
    this.baseUrl = 'https://circleci.com/api/v1.1';
  }

  getCurrentBranch(): Branch {
    return this.environment.branch;
  }

  async getLastSuccessfullyBuiltCommit(
    branch: Branch
  ): Promise<Result<Commit>> {
    const {
      vcsProvider,
      projectRepoName,
      projectUsername,
      token,
    } = this.environment;

    const url = `${this.baseUrl}/project/${vcsProvider}/${projectUsername}/${projectRepoName}/tree/${branch.name}`;

    logger.debug('Making request to CircleCI:', url);
    const data: CircleCIWorkflowResponse[] = await this.httpClient.get({
      url,
      headers: {
        'Circle-Token': token,
      },
      queryParameters: {
        filter: 'completed',
        limit: 100,
        shallow: true,
      },
    });

    logger.debug('CircleCI response:', data);

    const match = data.find((item) => item.status === 'success');

    if (match) {
      return Commit.create({ shaHash: match.vcs_revision });
    }
    return Result.fail<Commit>(`Commit was not found on CircleCI`);
  }

  static getEnvironment(): CircleCIEnvironment {
    return {
      commit: Commit.create({
        shaHash: process.env.CIRCLE_SHA1 as string,
      }).getValue(),
      branch: Branch.create({
        name: process.env.CIRCLE_BRANCH as string,
      }).getValue(),
      projectUsername: process.env.CIRCLE_PROJECT_USERNAME as string,
      projectRepoName: process.env.CIRCLE_PROJECT_REPONAME as string,
      token: process.env.CIRCLE_TOKEN as string,
      vcsProvider: 'github',
    };
  }
}
