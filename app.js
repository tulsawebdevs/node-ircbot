var Bot    = require('ttapi');
var irc    = require('irc');

var plugins = ['hello','logging','turntable','karma','botsnack'];
var plug = new Array();

var AUTH   = process.env.AUTH;
var USERID = process.env.USERID;
var ROOMID = process.env.ROOMID;
var NICK = "tulsabot";
var ROOM = "#tulsawebdevs";

var table = new Bot(AUTH, USERID, ROOMID);

var irc = new irc.Client('irc.freenode.net', NICK, {
    channels: [ROOM]
});

for(x=0; x<plugins.length;x++){
  plug[x] = require('./plugins/'+plugins[x]+'.js');
  plug[x].setup(table,irc,ROOM);
}

table.listen(8080, '0.0.0.0');

var myScriptVersion = '0.0.1';

table.on('httpRequest', function (req, res) {
   var method = req.method;
   var url    = req.url;
   switch (url) {
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

