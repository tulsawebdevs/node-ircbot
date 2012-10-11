//Logging ircbot plugin: Logs all irc and turntable activity on mongoDB.
//version: 1.1.0
//authon: Blixa Morgan <blixa@projectmakeit.com>
/*
This work is licensed under the Creative Commons Attribution-NonCommercial 3.0 Unported License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/3.0/ or send a letter to Creative Commons, 444 Castro Street, Suite 900, Mountain View, California, 94041, USA.
*/
//Dependencies
var moment = require('moment');


exports.setup=function(table,irc,extra){
  var room = extra.room;
  var botname = extra.botname;
  //add commands
  extra.plugins["Logging"]="records logs from turntable and irc";
  var logs = extra.db.collection('logs');
  //Record messages from irc
  irc.addListener('message'+room, function(from,message){
    logging(from,message,'irc');
  });
  //Record messages from Turntable chat
  table.on('speak', function (data) {
     logging(data.name,data.text,'tt');
  });
  //Record to DB
  function logging(from,message,serv) {
    var current = moment().subtract('hours',5);
    var doc={from:from, year:current.format('YY'), month:current.format('MM'), day: current.format('DD'), time:current.format('hh:mm:ss a'), message: message, service:serv}
    logs.insert(doc,function(err){});
}
}


