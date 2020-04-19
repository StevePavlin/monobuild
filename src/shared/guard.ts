interface GuardResult {
  success: boolean;
  message: string;
}

interface GuardArgument {
  argument: unknown;
  argumentName: string;
}

export default class Guard {
  static againstNullOrUndefined(args: GuardArgument): GuardResult {
    if (args.argument === null || args.argument === undefined) {
      return {
        success: false,
        message: `argument '${args.argumentName}' cannot be null or undefined`,
      };
    }

    return {
      success: true,
      message: 'OK',
    };
  }

  static againstNullOrUndefinedBulk(args: GuardArgument[]): GuardResult {
    const failureMessages = args.reduce(
      (allMessages: string[], arg: GuardArgument) => {
        const result = Guard.againstNullOrUndefined(arg);

        if (!result.success) {
          return [...allMessages, result.message];
        }

        return allMessages;
      },
      []
    );

    if (failureMessages.length > 0) {
      return {
        success: false,
        message: failureMessages.join(', '),
      };
    }

    return {
      success: true,
      message: 'OK',
    };
  }
}
