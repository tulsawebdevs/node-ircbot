//Help ircbot plugin: Allows users to give and take awsome points.
//version: 1.0.0
//authon: Blixa Morgan <blixa@projectmakeit.com>
/*
This work is licensed under the Creative Commons Attribution-NonCommercial 3.0 Unported License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/3.0/ or send a letter to Creative Commons, 444 Castro Street, Suite 900, Mountain View, California, 94041, USA.
*/

exports.setup=function(table,irc,extra){
  var commands = extra.commands;
  var plugins = extra.plugins;
  var room = extra.room;
  irc.addListener('message'+room, function (from, message) {
    //Give karma
    if(message.match(/^!help/)){
      var responce="";
      for(var name in commands){
        responce = responce+name+": "+commands[name]+"\n"
      }
      irc.say(room, responce);
    }
    if(message.match(/^!plugins/)){
      var responce="";
      for(var name in plugins){
        responce = responce+name+": "+plugins[name]+"\n"
      }
      irc.say(room, responce);
    }
  });
}
