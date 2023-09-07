'use strict';

const runner = require('@ali/def-init-runner');

runner.kit_yo({
  generatorPath: `${__dirname}`,
  // generatorPath: `${__dirname}:component`,
  // generatorPath: `${__dirname}:page`,
  // generatorPath: `${__dirname}:service`,
  // argv: []
});

process.on('unhandledRejection', (reason, promise) => {
  console.log(promise, 'reason:', reason);
});
