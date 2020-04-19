import Commit from './commit';
import Result from '../shared/result';

it('should fail if hash is invalid', () => {
  const commit: Result<Commit> = Commit.create({
    shaHash: 'not valid',
  });
  expect(commit.isFailure).toBeTruthy();
  expect(commit.error).toEqual('shaHash must be a sha1 hash (40 chars long)');
});
it('should be successful if sha1 hash is passed', () => {
  const commit: Result<Commit> = Commit.create({
    shaHash: 'fd6e4b5f4bb7c2cdeb1abe621734ff95e02c4cbb',
  });
  expect(commit.isSuccess).toBeTruthy();
  expect(commit.getValue().shaHash).toEqual(
    'fd6e4b5f4bb7c2cdeb1abe621734ff95e02c4cbb'
  );
});
