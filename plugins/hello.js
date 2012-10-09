//Hello ircbot plugin: Replys to !hello command with greeting and the time.
//version: 1.1.0
//authon: Blixa Morgan <blixa@projectmakeit.com>
/*
This work is licensed under the Creative Commons Attribution-NonCommercial 3.0 Unported License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/3.0/ or send a letter to Creative Commons, 444 Castro Street, Suite 900, Mountain View, California, 94041, USA.
*/

var moment = require('moment');

exports.setup=function(table,irc,extra){
  var room = extra.room;
  var botnick = extra.botnick;
  //add commands
  extra.plugins["Hello"]="Says Hello";
  extra.commands["!hello"]="Tulsabot says hi back.  In Japanese.";
  //IRC chat
  irc.addListener('message'+room, function (from, message) {
      //User said !hello, Say hi back. In japanese. ;)
      if(message.match(/^!hello$/)){
        var current = moment().subtract("hours",5);
        irc.say(room ,'こんにちは'+from+'お元気ですか。時間は'+current.format('h:mm:ss a'));
      }
  });
  table.on('speak', function (data) {
     // Get the data
     var name = data.name;
     var text = data.text;
     // Respond to "!hello" command
     if (text.match(/^!hello$/)) {
        table.speak('Hello '+name+'.');
     }
  });
};
