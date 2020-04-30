const path = require('path');
const shell = require('shelljs');
const npmModule = path.resolve(`${__dirname}/../node_modules/.bin`);
const linterBin = path.resolve(npmModule, './tslint');
shell.exec(`cd ..`);
shell.exec(`${linterBin} --project tsconfig.json --config tslint.json`);
