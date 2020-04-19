import Entity from '../shared/entity';
import Guard from '../shared/guard';
import Result from '../shared/result';

interface BranchProps {
  name: string;
}

export default class Branch extends Entity<BranchProps> {
  private constructor(props: BranchProps) {
    super(props);
  }

  get name(): string {
    return this.props.name;
  }

  static create(props: BranchProps): Result<Branch> {
    const result = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: 'branchName' },
    ]);
    if (!result.message) {
      return Result.fail<Branch>(result.message);
    }

    return Result.ok<Branch>(new Branch(props));
  }
}
