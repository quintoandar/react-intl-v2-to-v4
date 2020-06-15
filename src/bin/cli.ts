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

// TODO: fix flags type
function runTransform(opts: {
  files: string[];
  flags: any;
  transform: string;
}) {
  const { files, flags, transform } = opts;

  const transformPath = path.join(transformsDirectory, `${transform}.ts`);

  let args = [];

  if (flags.dry) {
    args.push('--dry');
  }

  if (flags.print) {
    args.push('--print');
  }

  args.push(`--parser=${flags.parser}`);
  args.push(`--extensions=${flags.extensions}`);
  args.push(`--ignore-pattern=${flags.ignorePattern}`);
  args.push(`--verbose=${flags.verbose}`);

  args = args.concat(['--transform', transformPath]);

  args = args.concat(files);

  logger.log(`Executing command: jscodeshift ${args.join(' ')}`);

  execa.sync(jscodeshiftExecutable, args, {
    stdio: 'inherit',
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

function run() {
  const cli = meow(helpText, {
    flags: {
      dry: {
        type: 'boolean',
        default: false,
      },
      extensions: {
        type: 'string',
        default: 'js,jsx',
      },
      force: {
        type: 'boolean',
        default: false,
      },
      'ignore-pattern': {
        type: 'string',
        default: '**/node_modules/**',
      },
      parser: {
        type: 'string',
        default: 'babel',
      },
      print: {
        type: 'boolean',
        default: false,
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
        checkGitStatus(cli.flags.force, filesBeforeExpansion);
      }

      return runTransform({
        files: filesExpanded,
        flags: cli.flags,
        transform: selectedTransform,
      });
    });
}

export {
  run,
  runTransform,
  checkGitStatus,
  jscodeshiftExecutable,
  transformsDirectory,
};
