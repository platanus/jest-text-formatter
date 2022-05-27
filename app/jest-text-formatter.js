const fs = require('fs');
const readline = require('readline');

function isDirectory(line) {
  return line.match(/^\s\S/g);
}

function isFile(line) {
  return line.match(/^\s\s\S/g);
}

function coveredIsEmpty(line) {
  return line.split('|').slice(-1)[0].trim().replace('-', '').length === 0;
}

function getPath(line) {
  const path = line.split('|').slice(0)[0].trim().split('/').slice(1)
    .join('/');

  return path;
}

function processFileLine(line, currentPath, outputPath) {
  const ranges = line.split('|').slice(-1)[0].trim().split(',');
  const filePath = `${currentPath}/${line.trim().split('|').slice(0)[0]}`;
  ranges.forEach((range) => {
    const [from, to] = range.split('-');
    const msg = to ? `${from} to ${to}` : from;
    const outputLine = `/${filePath.trim()}:${from}:1: Not covered lines: ${msg}\n`;
    fs.writeFileSync(outputPath, outputLine, { flag: 'a' });
  });
}

function processLine(line, currentPath, outputPath) {
  if (isDirectory(line)) {
    return getPath(line);
  }

  if (isFile(line) && !coveredIsEmpty(line)) {
    processFileLine(line, currentPath, outputPath);
  }

  return currentPath;
}

function processFile(processFilePath, outputPath) {
  const readInterface = readline.createInterface({
    input: fs.createReadStream(processFilePath),
  });

  let currentPath = '';

  readInterface.on('line', (line) => {
    currentPath = processLine(line, currentPath, outputPath);
  });
}

exports.processLine = processLine;
exports.processFile = processFile;
