// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
const os = require('os');
const chromeHeadlessSupported =
  os.platform() !== 'win32' ||
  Number((os.release().match(/^(\d+)/) || ['0', '0'])[1]) >= 10;

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage/panic-app'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true,
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: true,
    restartOnFileChange: true,
    concurrency: Infinity,
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 60000,
    browsers: [chromeHeadlessSupported ? 'ChromeHeadless' : 'Chrome'],
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--no-sandbox',
          '--headless',
          '--disable-gpu',
          '--remote-debugging-port=9222',
        ],
      },
    },
  });
};
