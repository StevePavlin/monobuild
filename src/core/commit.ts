import Entity from '../shared/entity';
import Guard from '../shared/guard';
import Result from '../shared/result';

interface CommitProps {
  shaHash: string;
}
export default class Commit extends Entity<CommitProps> {
  private constructor(props: CommitProps) {
    super(props);
  }

  get shaHash() {
    return this.props.shaHash;
  }

  static create(props: CommitProps): Result<Commit> {
    const guardResult = Guard.againstNullOrUndefined({
      argument: props.shaHash,
      argumentName: 'shaHash',
    });

    if (!guardResult.success) {
      return Result.fail<Commit>(guardResult.message);
    }

    if (props.shaHash.length !== 40) {
      return Result.fail<Commit>('shaHash must be a sha1 hash (40 chars long)');
    }

    return Result.ok<Commit>(new Commit(props));
  }
}
