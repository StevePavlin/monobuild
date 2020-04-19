// eslint-disable-next-line max-classes-per-file
import fs from 'fs';
import SystemCommand from '../core/commands/system-command';
import Package from '../core/package';
import Commit from '../core/commit';
import Result from '../shared/result';

class TestCommand extends SystemCommand {
  constructor(private cmd: string) {
    super();
  }

  async execute(): Promise<string> {
    return this.baseExecute(this.cmd);
  }
}

class GetLatestCommitHash extends SystemCommand {
  constructor() {
    super();
  }

  async execute(): Promise<Result<Commit>> {
    const result = await this.baseExecute(`git rev-parse HEAD`);
    return Commit.create({ shaHash: result.trim() });
  }
}

const setupTestProject = async () => {
  SystemCommand.setCwd('/home/test');
  await new TestCommand(`
      rm -rf /home/test && mkdir -p /home/test && cd /home/test &&
      git init &&
      git config --global user.email "test@gmail.com" &&
      git config --global user.name "Test" &&
      mkdir -p ./packages/foo &&
      mkdir -p ./packages/bar &&
      npm init --y
   `).execute();

  const foo = Package.create({
    name: 'foo',
    path: './packages/foo',
  });
  const bar = Package.create({
    name: 'bar',
    path: './packages/bar',
  });
  const pkgJson = JSON.parse(
    fs.readFileSync('/home/test/package.json').toString()
  );

  const dataWithPackages = {
    ...pkgJson,
    monoBuild: {
      packages: [
        { name: 'foo', path: './packages/foo' },
        { name: 'bar', path: './packages/bar' },
      ],
    },
  };
  fs.writeFileSync(
    '/home/test/package.json',
    JSON.stringify(dataWithPackages, null, 4)
  );
  return { foo, bar };
};

const commitToPackage = async (
  pkg: Package,
  message: string,
  fileName: string
): Promise<Result<Commit>> => {
  const path = `${pkg.path}/${fileName}`;
  await new TestCommand(`
      echo ${message} > ${path} && 
      git add . && 
      git commit -m "added message of ${message} to ${path} in the ${pkg.name} package"
  `).execute();
  return new GetLatestCommitHash().execute();
};

export { setupTestProject, commitToPackage, TestCommand, GetLatestCommitHash };
