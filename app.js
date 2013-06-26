//Tulsabot: Merge of tulsawebdevs irc bot and turntable bot.
//version: 1.0.0
//authon: Blixa Morgan <blixa@projectmakeit.com>
/*
This work is licensed under the Creative Commons Attribution-NonCommercial 3.0 Unported License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/3.0/ or send a letter to Creative Commons, 444 Castro Street, Suite 900, Mountain View, California, 94041, USA.
*/

//Dependencies
var Bot    = require('ttapi');
var irc    = require('irc');
var mongodb = require('mongodb')
  , repl = require('repl');
//Plugins
var plugins = ['hello','logging','turntable','karma','botsnack','music', 'web', 'help'];
var plug = new Array();

//Enviroment variables
var AUTH   = process.env.AUTH;
var USERID = process.env.USERID;
var ROOMID = process.env.ROOMID;
var NICK = process.env.NICK;
var ROOM = "#"+process.env.ROOM;
var SERVER = process.env.SERVER;
var DBSERVER = process.env.DBSERVER;
var DBPASS = process.env.PASS;
var DBUSER = process.env.DBUSER;
var DBNAME = process.env.DB;
var IRCPASS = process.env.IRC;

//Server Settings
var server = new mongodb.Server(DBSERVER,31617, {});
var db = new mongodb.Db(DBNAME, server, {})

var includer = {room: ROOM, botnick: NICK, db:db, commands:{}, plugins:{}}
//Connect to turntable and IRC
var table = new Bot(AUTH, USERID, ROOMID);
var irc = new irc.Client(SERVER, NICK, {
    channels: [ROOM]
});
//table.debug = true;
repl.start('> ').context.table = table;
db.open(function(err,res){  
  db.authenticate(DBUSER,DBPASS,function(err,res){
  });
});
irc.addListener('error', function(message) {
        console.log('error: ', message);
});
//irc.say('nickserv','identify minecraft');

irc.say('nickserv',IRCPASS);

//import plugins
for(x=0; x<plugins.length;x++){
  plug[x] = require('./plugins/'+plugins[x]+'.js');
  plug[x].setup(table,irc,includer);
}
