const winston = require('winston');
const fs = require('fs');

exports.createWinstonFileTransport = function createWinstonFileTransport() {
  // create directory with normal permissions to store logs
  fs.mkdir('./logs', 0o777, (err) => {
    if (err) {
      if (err.code === 'EEXIST') {
        console.log('File already exists!');
      } else {
        throw err;
      }
    } else {
      console.log('successfully created folder!');
    }
  });

  // add transport (console is default)
  winston.add(
    winston.transports.File,
    {
      filename: 'standardLog.log',
      level: 'info',
      json: true,
      timestamp: true,
      dirname: './logs',
      maxsize: 10000000,
      maxFiles: 0,
      // keep roll over in ascending order so that most current file is always base file name
      tailable: true,
    },
  );
};
