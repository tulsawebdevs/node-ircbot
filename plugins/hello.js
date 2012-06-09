var moment = require('moment');

exports.setup=function(table,irc,room){
  irc.addListener('message'+room, function (from, message) {
      if(message.match(/^!hello$/)){
        irc.say(room ,'こんにちは'+from+'お元気ですか。時間は'+moment().format('h:mm:ss a'));
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
