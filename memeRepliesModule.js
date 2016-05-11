//These three required for the fs.readdirSync()
var fs = require( "fs" );
var path = require( "path" );
var process = require( "process" );

var MemeManager = function (bot){
  //initialize cena
  var cenaImageFolder = "./cenaImages/";
  var cenaImageArray = new Array();
  cenaImageArray = fs.readdirSync(cenaImageFolder); //Loops through a given folder and creates an array of file names

}

module.exports.cena = cenaReply;
