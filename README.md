# Jest Coverage Formatter

Library to convert Jest coverage output files to a format readable by Reviewdog.

## Installation

```bash
npm install jest-text-formatter --save-dev
# or
yarn add jest-text-formatter --dev
```

## Usage

First run Jest with file output. Make sure to have coverage reporters set to ```["text"]```.

For example:

```
yarn test > coverage.txt
```

Then run Jest Coverage Formatter

```
format-coverage ./coverage.txt ./outputPath/coverage.txt /root/path
```

It will save the output to ```./outputPath/coverage.txt```