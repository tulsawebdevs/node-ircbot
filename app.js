//Tulsabot: Merge of tulsawebdevs irc bot and turntable bot.
//version: 1.0.0
//authon: Blixa Morgan <blixa@projectmakeit.com>
/*
This work is licensed under the Creative Commons Attribution-NonCommercial 3.0 Unported License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/3.0/ or send a letter to Creative Commons, 444 Castro Street, Suite 900, Mountain View, California, 94041, USA.
*/

//Dependencies
var Bot    = require('ttapi');
var irc    = require('irc');
var mongodb = require('mongodb');

//Plugins
var plugins = ['hello','logging','turntable','karma','botsnack'];
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


//Server Settings
var server = new mongodb.Server(DBSERVER,31617, {});
var db = new mongodb.Db(DBNAME, server, {})

var includer = {room: ROOM, botnick: NICK, db:db}
//Connect to turntable and IRC
var table = new Bot(AUTH, USERID, ROOMID);
var irc = new irc.Client(SERVER, NICK, {
    channels: [ROOM]
});

db.open(function(err,res){  
  db.authenticate(DBUSER,DBPASS,function(err,res){
  });
});

//import plugins
for(x=0; x<plugins.length;x++){
  plug[x] = require('./plugins/'+plugins[x]+'.js');
  plug[x].setup(table,irc,includer);
}

//HTTP server.
table.listen(8080, '0.0.0.0');

var myScriptVersion = '1.0.0';

table.on('httpRequest', function (req, res) {
   var method = req.method;
   var url    = req.url;
   switch (url) {
      //give current verison
      case '/version/':
         if (method == 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end('{"version":"'+myScriptVersion+'"}');
         } else {
            res.writeHead(500);
            res.end();
         }
         break;
      default:
         res.writeHead(200);
         res.end('For api access to TulsaBot');
         break;
   }
});

