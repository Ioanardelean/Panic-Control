const shell = require('shelljs');
const os = require('os');
const colors = require('colors');
const prog = require('caporal');
const run = function(cmd) {
  const resp = shell.exec(run);
  console.log(resp);
  if (resp.code !== 0) {
    console.log(colors.red(resp.stdout));
    shell.exit(resp.code);
  }
  return resp.stdout;
};

prog
  .version('1.0.0')
  .option('-e, --env <env>', 'build environment', ['dev', 'prod'])
  .action(function(args, options) {
    shell.cd(process.cwd());
    shell.mkdir('-p', './dist/config');
    shell.mkdir('-p', './dist/src/databases');
    shell.cp('-r', './scripts', './dist/');
    shell.cp('-r', './config', './dist/');
    shell.cp('-r', './src/public', './dist/');
    shell.cp('./package.json', './dist/');
  });
prog.parse(process.argv);
