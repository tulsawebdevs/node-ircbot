//Botsnack ircbot plugin: basic turntable commands
//version: 1.0.0
//authon: Blixa Morgan <blixa@projectmakeit.com>
/*
This work is licensed under the Creative Commons Attribution-NonCommercial 3.0 Unported License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/3.0/ or send a letter to Creative Commons, 444 Castro Street, Suite 900, Mountain View, California, 94041, USA.
*/

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
