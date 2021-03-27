var winston = require('winston');
var fs = require( "fs" );
var path = require( "path" );

exports.createWinstonFileTransport = function() {
  fs.mkdir("./logs", 0777, function(err) { //create directory with normal permissions to store logs
          if (err) {
              if (err.code == 'EEXIST'){
                console.log("File already exists!");// ignore the error if the folder already exists
              }
              else {
                throw err;  // something else went wrong
              }
          } else {
            console.log("successfully created folder!");// successfully created folder
          }
      });
  winston.add( //add transport (console is default)
  	winston.transports.File, { //add File transport type
  		filename: 'standardLog.log', //base filename
  		level: 'info', //level at which to log messages
  		json: true, //log in JSON format
  		timestamp: true, //append timestamp to log if true
  		dirname: './logs', //directory name
  		maxsize: 10000000, //size in bytes where roll over will occur
  		maxFiles: 0, //# of files to keep after roll over occurs
  		tailable: true //keep roll over in ascending order so that most current file is always base file name
  	}
  )
};
