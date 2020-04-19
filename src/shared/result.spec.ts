import Result from './result';

it('should set correct values for Result.ok', () => {
  const test = Result.ok('test');

  expect(test.error).toEqual(null);
  expect(test.isFailure).toEqual(false);
  expect(test.isSuccess).toEqual(true);
  expect(test.getValue()).toEqual('test');
});
it('should set correct values for Result.fail', () => {
  const test = Result.fail('test');

  expect(test.error).toEqual('test');
  expect(test.isFailure).toEqual(true);
  expect(test.isSuccess).toEqual(false);
  expect(() => test.getValue()).toThrow(
    'getValue() not possible, result failed with error: test'
  );
});
it('should combine good + bad into bad result', () => {
  const good = Result.ok('yay');
  const bad = Result.fail('boo');

  const goodAndBad = Result.combine([good, bad]);
  expect(goodAndBad).toEqual(bad);
});
it('should combine good + good into good result', () => {
  const good = Result.ok('yay');
  const woo = Result.ok('woo');

  const bothGood = Result.combine([good, woo]);
  expect(bothGood).toEqual(Result.ok());
});
