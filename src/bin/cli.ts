import globby from 'globby';
import inquirer from 'inquirer';
import meow from 'meow';
import path from 'path';
import execa from 'execa';

import { checkGitStatus } from './checkGitStatus';
import { helpText } from './help';
import { TRANSFORM_INQUIRER_CHOICES } from './transforms';

const transformsDirectory = path.join(__dirname, '..', 'transforms');
const jscodeshiftExecutable = require.resolve('.bin/jscodeshift');

const logger = console;

function run() {
  const cli = meow(helpText, {
    flags: {
      dry: {
        type: 'boolean',
        default: false,
        alias: 'd',
      },
      extensions: {
        type: 'string',
        default: 'js,jsx',
      },
      force: {
        type: 'boolean',
        default: false,
      },
      'ignore-config': {
        type: 'string',
      },
      'ignore-pattern': {
        type: 'string',
        default: '**/node_modules/**',
      },
      jscodeshift: {
        type: 'string',
      },
      print: {
        type: 'boolean',
        default: false,
        alias: 'p',
      },
      silent: {
        type: 'boolean',
        default: false,
        alias: 's',
      },
      verbose: {
        type: 'number',
        default: 2,
        alias: 'v',
      },
    },
  });

  inquirer
    .prompt<{ files: string; transform: string }>([
      {
        type: 'input',
        name: 'files',
        message: 'On which files or directory should the codemods be applied?',
        when: !cli.input[0],
        default: '.',
        filter: (files) => files.trim(),
      },
      {
        type: 'list',
        name: 'transform',
        message: 'Which transform would you like to apply?',
        when: !cli.input[1],
        pageSize: TRANSFORM_INQUIRER_CHOICES.length,
        choices: TRANSFORM_INQUIRER_CHOICES,
      },
    ])
    .then((answers) => {
      const { files, transform } = answers;

      const filesBeforeExpansion = cli.input[0] || files;
      const filesExpanded = expandFilePathsIfNeeded([filesBeforeExpansion]);

      const selectedTransform = cli.input[1] || transform;

      if (!filesExpanded.length) {
        logger.log(`No files found matching ${filesBeforeExpansion}`);
        return null;
      }

      if (!cli.flags.dry) {
        // Can't check against filesBeforeExpansion when it's a glob
        checkGitStatus(cli.flags.force, process.cwd());
      }

      return runTransform({
        files: filesExpanded,
        flags: cli.flags,
        transform: selectedTransform,
      });
    });
}

function expandFilePathsIfNeeded(filesBeforeExpansion: string[]) {
  const shouldExpandFiles = filesBeforeExpansion.some((file) =>
    file.includes('*'),
  );
  return shouldExpandFiles
    ? globby.sync(filesBeforeExpansion)
    : filesBeforeExpansion;
}

function runTransform(opts: {
  files: string[];
  flags: any;
  transform: string;
}) {
  const args = parseArgs(opts);

  if (!opts.flags.silent) {
    logger.log(`Executing command: jscodeshift ${args.join(' ')}`);
  }

  execa.sync(jscodeshiftExecutable, args, {
    stdin: 'inherit',
    stdout: opts.flags.silent ? 'ignore' : 'inherit',
    stderr: 'inherit',
  });
}

// TODO: fix flags type
function parseArgs(opts: { files: string[]; flags: any; transform: string }) {
  const { files, flags, transform } = opts;
  let args = [];

  if (flags.dry) {
    args.push('--dry');
  }

  args.push(`--extensions=${flags.extensions}`);

  if (flags.ignoreConfig !== undefined) {
    args.push(`--ignore-config=${flags.ignoreConfig}`);
  }

  args.push(`--ignore-pattern=${flags.ignorePattern}`);

  if (flags.print) {
    args.push('--print');
  }

  if (flags.silent) {
    args.push('--silent');
  }

  args.push(`--verbose=${flags.verbose}`);

  const transformPath = path.join(transformsDirectory, `${transform}.ts`);
  args = args.concat(['--transform', transformPath]);

  if (flags.jscodeshift !== undefined) {
    args = args.concat(flags.jscodeshift);
  }

  args = args.concat(files);

  return args;
}

export {
  run,
  runTransform,
  checkGitStatus,
  jscodeshiftExecutable,
  transformsDirectory,
};
