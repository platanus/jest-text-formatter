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
  const path = line.split('|').slice(0)[0].trim();

  return path;
}

function processFileLine(line, currentPath, outputPath, rootPath) {
  const ranges = line.split('|').slice(-1)[0].trim().split(',');
  const filePath = `${currentPath}/${line.trim().split('|').slice(0)[0]}`;
  ranges.forEach((range) => {
    const [from, to] = range.split('-');
    const msg = to ? `${from} to ${to}` : from;
    const outputLine = `${rootPath}/${filePath.trim()}:${from}:1: Not covered lines: ${msg}\n`;
    fs.writeFileSync(outputPath, outputLine, { flag: 'a' });
  });
}

function processLine(line, currentPath, outputPath, rootPath) {
  if (isDirectory(line)) {
    return getPath(line);
  }

  if (isFile(line) && !coveredIsEmpty(line)) {
    processFileLine(line, currentPath, outputPath, rootPath);
  }

  return currentPath;
}

function processFile(processFilePath, outputPath, rootPath) {
  const readInterface = readline.createInterface({
    input: fs.createReadStream(processFilePath),
  });

  let currentPath = '';

  readInterface.on('line', (line) => {
    currentPath = processLine(line, currentPath, outputPath, rootPath);
  });
}

exports.processLine = processLine;
exports.processFile = processFile;
