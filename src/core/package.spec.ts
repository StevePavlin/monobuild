import Package from './package';
import Result from '../shared/result';

it('should be successful with valid package', () => {
  const pkg: Result<Package> = Package.create({
    name: 'test',
    path: './packages/test',
  });

  expect(pkg.isSuccess).toBeTruthy();
});
it('should fail with path error if name is less than 2 chars', () => {
  const pkg: Result<Package> = Package.create({
    name: '1',
    path: '1',
  });

  expect(pkg.isFailure).toBeTruthy();
  expect(pkg.error).toEqual('Package name must be at least 2 chars in length');
});
