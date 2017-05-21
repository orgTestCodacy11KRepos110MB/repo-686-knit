/* @flow */

const chalk = require('chalk');
const updateRdrr = require('listr-update-renderer');
const silentRdrr = require('listr-silent-renderer');
const verboseRdrr = require('listr-verbose-renderer');

exports.info = (...msg: Array<string>) => console.log(chalk.blue('info'), ...msg);
exports.command = (...msg: Array<string>) => console.log(chalk.blue('command'), ...msg);
exports.warning = (...msg: Array<string>) => console.log(chalk.yellow('warning'), ...msg);
exports.error = (...msg: Array<string>) => console.log(chalk.red('error'), ...msg);
exports.success = (...msg: Array<string>) => console.log(chalk.green('success'), ...msg);
exports.missing = (...msg: Array<string>) => console.log(chalk.red('missing'), ...msg);
exports.subtree = (...msg: Array<string>) => console.log(chalk.white('└─'), ...msg);

type TGetRenderer = {
  silent: boolean,
  verbose: boolean,
};

exports.getRenderer = (opts: TGetRenderer) => {
  const { silent, verbose } = opts || {};
  if (silent) {
    return silentRdrr;
  } else if (verbose) {
    return verboseRdrr;
  }

  return updateRdrr;
};