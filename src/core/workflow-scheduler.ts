import Package from './package';
import { CIProvider } from './ci-plugins/ci-provider';
import Result from '../shared/result';

interface WorkflowSchedulerProps {
  ciProvider: CIProvider;
}

export default class WorkflowScheduler {
  constructor(private ciProvider: CIProvider) {}

  static loadPackagesFromConfig(): Result<Package>[] {
    const json = require('./package.json');

    console.log('got package json', json);

    if (json && json.monoBuild) json.monoBuild;
    return packageConfig.map((pkg) => {
      try {
        require(pkg.path);
      } catch (err) {
        return Result.fail<Package>(
          `Package does not exist on disk at ${pkg.path}`
        );
      }

      return Package.create({
        name: pkg.name,
        path: pkg.path,
      });
    });
  }
  /*
  async scheduleWorkflows(): void {
    
    const branch = this.props.ciProvider.
  }

  async getLastCompletedBuildSHAForBranch(branch: Branch) {
    return this.ciProvider.getLastCompletedBuildSHAForBranch(branch);
  }

  async markPackagesThatChangedSinceLastBuild({
    lastSuccessfulBuildCommit,
    currentCommit,
  }) {
    await Promise.all(
      this.packages.map((pkg) => {
        const cmd = new GetCommitsThatTouchedPackage({
          lastSuccessfulBuildCommit,
          currentCommit,
          pkg,
        });

        // call git cli
        return cmd.execute();
      })
    );

    return this.packages;
  }

  printPackagesToBuild() {
    writeLog('Packages to build:');
    this.packages.forEach((pkg) =>
      writeLog(
        `[${pkg.shouldBuild() ? '+' : '-'}] ${pkg.name} (${
          pkg.numberOfTouchedCommits
        } commit(s) since last successful ci build)`
      )
    );
  }

  async scheduleWorkflowsForChangedPackages() {} */
}
