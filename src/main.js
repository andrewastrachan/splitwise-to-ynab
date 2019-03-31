const fs = require('fs');
const parse = require('csv-parse');
const _ = require('lodash');
const uuidv4 = require('uuid/v4');

function getHeaderIndices(row, identityLabel) {
  const dateIndex = _.indexOf(row, 'Date');
  const descriptionIndex = _.indexOf(row, 'Description');
  const categoryIndex = _.indexOf(row, 'Category');
  const costIndex = _.indexOf(row, 'Cost');
  const currencyIndex = _.indexOf(row, 'Currency');
  const yourTransactions = _.indexOf(row, identityLabel);
  return {
    dateIndex,
    descriptionIndex,
    categoryIndex,
    costIndex,
    currencyIndex,
    yourTransactions
  };
}

async function readCSV(filePath, callback) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(parse({ delimiter: ',' }))
      .on('data', (row) => {
        callback(row);
      })
      .on('end', () => {
        callback(null);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

async function readWriteCSV(readPath, writePath, transformer) {
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(writePath);
    let index = 0;
    readCSV(readPath, (data) => {
      if (data) {
        writeStream.write(`${transformer(data, index).join(',')}\n`);
        index++;
      } else {
        writeStream.end();
        resolve(writePath);
      }
    });
  });
}

function createTransformer(identityLabel) {
  let headersConfig;
  console.log({ identityLabel });

  return function (data, index) {
    if (index == 0) {
      headersConfig = {
        dateIndex: _.indexOf(data, 'Date'),
        descriptionIndex: _.indexOf(data, 'Description'),
        categoryIndex: _.indexOf(data, 'Category'),
        transactionIndex: _.indexOf(data, identityLabel)
      };

      return ['Date', 'Payee', 'Memo', 'Outflow', 'Inflow'];
    }
    const {
      dateIndex, descriptionIndex, categoryIndex, transactionIndex
    } = headersConfig;

    const date = data[dateIndex];
    const description = data[descriptionIndex];
    const category = data[categoryIndex];
    const transactionValue = data[transactionIndex];
    const transactionValueNum = Number(transactionValue);

    return [
      date,
      description,
      category,
      transactionValueNum < 0 ? Math.abs(transactionValueNum) : '',
      transactionValueNum > 0 ? transactionValueNum : ''
    ];
  };
}

module.exports = async function convertFromSplitwiseToYnab(
  inputFilePath,
  outputFilePath,
  identityLabel
) {
  const transformer = createTransformer(identityLabel);

  await readWriteCSV(inputFilePath, outputFilePath, transformer);

  return true;
};
