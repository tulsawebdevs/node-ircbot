exports.setup=function(table,irc,room){
  irc.addListener('message'+room, function (from, message) {
      if(message.match(/!botsnack/)){
        irc.say(room ,'yum! thank you'+from);
      }
  });
  table.on('speak', function (data) {
     var name = data.name;
     var text = data.text;
     if (text.match(/^!botsnack/)) {
        table.speak('yum! thank you '+name);
     }
  });
};
