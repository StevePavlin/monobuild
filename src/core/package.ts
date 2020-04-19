import Entity from '../shared/entity';
import Commit from './commit';
import Guard from '../shared/guard';
import Result from '../shared/result';

interface PackageProps {
  name: string;
  path: string;
}
export default class Package extends Entity<PackageProps> {
  private commits: Commit[] = [];

  private constructor(props: PackageProps) {
    super(props);
  }

  get name() {
    return this.props.name;
  }

  get path() {
    return this.props.path;
  }

  setCommits(commits: Commit[]) {
    this.commits = commits;
  }

  get isBuildable() {
    return this.commits.length > 0;
  }

  static create(props: PackageProps): Result<Package> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: 'name' },
      { argument: props.path, argumentName: 'path' },
    ]);
    if (!guardResult.success) {
      return Result.fail<Package>(guardResult.message);
    }

    if (props.name.length < 2) {
      return Result.fail<Package>(
        'Package name must be at least 2 chars in length'
      );
    }

    return Result.ok<Package>(new Package(props));
  }
}
