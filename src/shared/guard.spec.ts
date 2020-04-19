import Guard from './guard';

describe('againstNullOrUndefined', () => {
  it('should display correct error when falsy value is passed', () => {
    const result = Guard.againstNullOrUndefined({
      argument: null,
      argumentName: 'test',
    });

    expect(result).toEqual({
      success: false,
      message: `argument 'test' cannot be null or undefined`,
    });
  });
  it('should return successfully when non-falsy value is passed', () => {
    const result = Guard.againstNullOrUndefined({
      argument: 'not null',
      argumentName: 'test',
    });

    expect(result).toEqual({
      success: true,
      message: 'OK',
    });
  });
});
describe('againstNullOrUndefinedBulk', () => {
  it('should display multiple errors messages correctly', () => {
    const result = Guard.againstNullOrUndefinedBulk([
      { argument: null, argumentName: 'onyxia' },
      { argument: undefined, argumentName: 'nefarian' },
      { argument: 'ok', argumentName: 'varian' },
    ]);

    expect(result).toEqual({
      success: false,
      message: `argument 'onyxia' cannot be null or undefined, argument 'nefarian' cannot be null or undefined`,
    });
  });
  it('should return successfully when non-falsy values are passed', () => {
    const result = Guard.againstNullOrUndefinedBulk([
      { argument: 'ok', argumentName: 'nefarian' },
      { argument: 'ok', argumentName: 'varian' },
    ]);

    expect(result).toEqual({
      success: true,
      message: 'OK',
    });
  });
});
