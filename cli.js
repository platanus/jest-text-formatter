#!/usr/bin/env node
const { processFile } = require('./app/jest-text-formatter');

const [,, ...args] = process.argv;

try {
  processFile(args[0], args[1], args[2]); // eslint-disable-line no-magic-numbers
} catch (error) {
  console.log(error);
}
