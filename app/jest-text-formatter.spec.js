const { processLine } = require('./jest-text-formatter');
const fs = require('fs');

jest.mock('fs');

describe('process line', () => {
  const currentPath = 'current/path';
  const outputPath = 'output.txt';
  const rootPath = '/app/javascript';

  it('does not format invalid line', () => {
    expect(processLine('Invalid line --', currentPath, outputPath)).toBe(currentPath);
  });

  it('correctly formats folder path', () => {
    const folderLine = ' app-name/app/new/path |     100 |      100 |     100 |     100 |';
    expect(processLine(folderLine, currentPath, outputPath)).toBe('app/new/path');
  });

  it('correctly formats file line with coverage lines', async () => {
    const filePathCoverage = '  file.js |       0 |        0 |       0 |       0 | 11-69,78';
    processLine(filePathCoverage, currentPath, outputPath, rootPath);
    expect(fs.writeFileSync).toHaveBeenCalledTimes(2); // eslint-disable-line no-magic-numbers
    expect(fs.writeFileSync).toHaveBeenNthCalledWith(
      1, outputPath, '/app/javascript/current/path/file.js:11:1: Not covered lines: 11 to 69\n', { flag: 'a' },
    );
    expect(fs.writeFileSync).toHaveBeenNthCalledWith(
      2, outputPath, '/app/javascript/current/path/file.js:78:1: Not covered lines: 78\n', { flag: 'a' },
    );
  });

  it('does not format file line without coverage', () => {
    const filePathNoCoverage = '  file.js |       0 |        0 |       0 |       0 | ';
    expect(processLine(filePathNoCoverage, currentPath, outputPath)).toBe(currentPath);
  });
});
