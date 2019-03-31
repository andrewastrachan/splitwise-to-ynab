const fs = require('fs');
const parse = require('csv-parse');

module.exports = async function readCSV(file) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(file.path)
      .pipe(parse({ delimiter: ':' }))
      .on('data', (csvrow) => {
        console.log(csvrow);
        // do something with csvrow
        csvData.push(csvrow);
      })
      .on('end', () => {
        // do something wiht csvData
        console.log(csvData);
      });
  });
};
