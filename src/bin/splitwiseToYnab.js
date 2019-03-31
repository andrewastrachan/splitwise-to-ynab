#!/usr/bin/env node

const Joi = require('joi');
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const pkg = require('../../package');
const convertFromSplitwiseToYnab = require('../main');

const definitions = [
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Display help message.'
  },
  {
    name: 'version',
    alias: 'v',
    type: Boolean,
    description: 'Display the version.'
  },
  {
    name: 'input-file-path',
    alias: 'f',
    description: 'The file path for the splitwise export csv'
  },
  {
    name: 'output-file-path',
    alias: 'o',
    description: 'The file path for the exported ynab import csv'
  },
  {
    name: 'identity',
    alias: 'i',
    description: 'The identity column in the splitwise export csv'
  }
];

const usage = [
  {
    header: 'Convert a splitwise export csv to YNAB import format',
    content: ''
  },
  {
    header: 'Options',
    optionList: definitions
  }
];

const schema = Joi.object().keys({
  help: Joi.bool(),
  version: Joi.bool(),
  'input-file-path': Joi.string()
    .regex(/.*\.(csv)$/)
    .required(),
  'output-file-path': Joi.string()
    .regex(/.*\.(csv)$/)
    .required(),
  identity: Joi.string().required()
});

const cmdLine = {
  definitions,
  schema,
  parse: async () => {
    let options = commandLineArgs(definitions);

    if (options.help || options.version) {
      return options;
    }

    options = await Joi.validate(options, schema);
    return options;
  }
};

async function execute() {
  const options = await cmdLine.parse();
  console.log(`writing file to ${options['output-file-path']}`);
  const outFile = await convertFromSplitwiseToYnab(
    options['input-file-path'],
    options['output-file-path'],
    options.identity
  );
  console.log('done');
  return true;
}

execute()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.log(e.stack);
    process.exit(1);
  });
