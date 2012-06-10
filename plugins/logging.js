var moment = require('moment');
var mongodb = require('mongodb');

var server = new mongodb.Server('ds031617.mongolab.com',31617, {});
var db = new mongodb.Db('tulsabot', server, {})
var logs;

exports.setup=function(table,irc,room){
  db.open(function(err,res){  
  db.authenticate('tulsabot',process.env.PASS,function(err,res){
  });});
  logs = db.collection('logs');
  irc.addListener('message'+room, function(from,message){
    logging(from,message,'irc');
  });
  table.on('speak', function (data) {
     logging(data.name,data.text,'tt');
  });
}

function logging(from,message,serv) {
  var current = moment().subtract('hours',5);
  var doc={from:from, year:current.format('YY'), month:current.format('MM'), day: current.format('DD'), time:current.format('hh:mm:ss a'), message: message, service:serv}
  logs.insert(doc,function(err){});
}
