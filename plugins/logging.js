var moment = require('moment');
var logfile;
var job;

var mongodb = require('mongodb');
var server = new mongodb.Server('ds031617.mongolab.com',31617, {});
var db = new mongodb.Db('tulsabot', server, {})
var logs;

exports.setup=function(table,irc,room){
  db.open(function(err,res){  
  db.authenticate('tulsabot',process.env.PASS,function(err,res){
  });});
  logs = db.collection('logs');
  irc.addListener('message'+room, logging);
  table.on('speak', function (data) {
     logging(data.name,data.text);
  });
}

function logging(from,message) {
  var doc={from:from, year:moment().format('YY'), month:moment().format('MM'), day: moment().format('DD'), time:('hh:mm:ss a'), message: message}
  logs.insert(doc,function(err){});
}
