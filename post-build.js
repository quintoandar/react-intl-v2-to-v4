const fs = require('fs-extra');
const { join } = require('path');

const logger = console;

async function copyHelp(filePath, destination) {
  try {
    await fs.copy(filePath, destination);
    logger.log(`=> Copied help from ${filePath} to ${destination}`);
  } catch (err) {
    logger.error(
      `=> Error when copying help from ${filePath} to ${destination}:`,
      err
    );
    process.exit(1);
  }
}

async function copyTransforms(transformsDir, destination) {
  const ignoredFiles = (src) => {
    const IGNORED_FOLDERS = ['__testfixtures__', '__tests__', 'tests'];
    return !IGNORED_FOLDERS.some((ignoredFolder) =>
      src.includes(ignoredFolder)
    );
  };

  try {
    await fs.copy(transformsDir, destination, { filter: ignoredFiles });
    logger.log(`=> Copied transforms from ${transformsDir} to ${destination}`);
  } catch (err) {
    logger.error(
      `=> Error when copying transforms from ${transformsDir} to ${destination}:`,
      err
    );
    process.exit(1);
  }
}

async function postBuild() {
  await copyHelp(
    join(__dirname, './src/bin/help.txt'),
    join(__dirname, './dist/bin/help.txt')
  );
  await copyTransforms(
    join(__dirname, './src/transforms'),
    join(__dirname, './dist/transforms')
  );
  process.exit(0);
}

postBuild();
