import chalk from 'chalk';
import isGitClean from 'is-git-clean';

const logger = console;

function checkGitStatus(force: boolean, dir = process.cwd()) {
  let clean = false;
  let errorMessage = 'Unable to determine if git directory is clean';

  try {
    clean = isGitClean.sync(dir);
    errorMessage = 'Git directory is not clean';
  } catch (err) {
    if (err && err.stderr && err.stderr.indexOf('Not a git repository') >= 0) {
      clean = true;
    }
  }

  if (!clean) {
    if (force) {
      logger.log(`WARNING: ${errorMessage}. Forcibly continuing.`);
    } else {
      logger.log(
        chalk.yellow(
          '\nBefore continue, please stash or commit your git changes.',
        ),
      );
      logger.log(
        '\nYou may use the --force flag to override this safety check.',
      );
      process.exit(1);
    }
  }
}

export { checkGitStatus };
