//Karma ircbot plugin: Allows users to give and take awsome points.
//version: 1.1.0
//authon: Blixa Morgan <blixa@projectmakeit.com>
/*
This work is licensed under the Creative Commons Attribution-NonCommercial 3.0 Unported License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/3.0/ or send a letter to Creative Commons, 444 Castro Street, Suite 900, Mountain View, California, 94041, USA.
*/

exports.setup=function(table,irc,extra){
  //set collection
  var karma = extra.db.collection('karma');
  var room = extra.room;
  var botnick = extra.botnick;
  var commands = extra.commands;
  //set help commands
  extra.commands["!<nick>++"]="Adds 1 karma to <nick>";
  extra.commands["!<nick>--"]="removes 1 karma to <nick>";
  extra.commands["!karma?"]="returns all karma's via pm";
  extra.commands["!karma?<nick>"]="returns the karma of <nick>";
  extra.plugins["Karma"]="allows giving and receiving of karma";
  //IRC messages
  irc.addListener('message'+room, function (from, message) {
    //Give karma
    if(message.match(/^!(\S+)[\+]{2}/)){
      var giveto = message.match(/!(\S+)[\+]{2}/)[1].toLowerCase();
      //User is trying to give himself karma, mock him.
      if(giveto==from){
        irc.say(room, "Just keep telling yourself that.");
        return;
      }
      //User is trying to give Tulsabot karma, This is a bad idea.
      if(giveto==botnick){
        irc.say(room, "Are you trying to rip a hole in the space-time continuum?");
        return;
      }
      if(giveto.match(/!/)){
        irc.say(room, from+", What do you think your doing?");
        return;
      }
      karma.findOne({"nick":giveto},function (err,data){
        
        if(!data){
          var count = 1;
        }else{
	if(isNaN(Number(data.count))){
          irc.say(room, giveto+" Can not receive karma. reason: "+data.count);
          return;
        }
          var count = data.count+1;
        }
        //karma is zero, remove nick from DB to save clutter.
        if(count==0){
          karma.remove({"nick":giveto});
          irc.say(room, giveto+" has no more karma.");
          return;
        }
        karma.update({"nick":giveto}, {"nick":giveto, "count":count}, {upsert:true},function(err,data){answer_karma(giveto);});
      });
    }
    //Take karma
    if(message.match(/^!(\S+)[\-]{2}/)){
      var giveto = message.match(/!(\S+)[\-]{2}/)[1].toLowerCase();
      //User is trying to take karma from himself, Why? I dont know.
      if(giveto==from){
        irc.say(room, "There are special rooms on this network for your kind.");
        return;
      }
      //User is trying to take karma from tulsabot, this won't work.  dont tell him though.
      if(giveto==botnick){
        irc.say(room, "I wouldn't do that if I were you...");
        return;
      }
      if(giveto.match(/!/)){
        irc.say(room, from+", What do you think your doing?");
        return;
      }
      karma.findOne({"nick":giveto},function (err,data){
        if(!data){
          var count = -1;
        }else{
	if(isNaN(Number(data.count))){
          irc.say(room, giveto+" Can not receive karma. reason: "+data.count);
          return;
        }
          var count = data.count - 1;
        }
        //karma is zero, remove nick from DB to clear clutter.
        if(count==0){
          karma.remove({"nick":giveto});
          irc.say(room, giveto+" has no more karma.");
          return;
        }
        karma.update({"nick":giveto}, {"nick":giveto, "count":count}, {upsert:true},function(err,data){answer_karma(giveto);});
      });
    }
    //User requested karma lists
    if(message.match(/^!karma\?(\s+)?(\S+)?/)){
      //Get individual nick
      if(message.match(/^!karma\?(\s+)?(\S+)?/)[2]){
        show_karma(message.match(/^!karma\?(\s+)?(\S+)?/)[2]);
      return;
      }
      //Get all karma
      karma.find().toArray(function (err,karmas){
        if(karmas){
          for(var x=0;x<karmas.length; x++){
            show_karma(karmas[x].nick, from);
          }
        }
      });
    }
  });
  //Return karma for nick.
  function show_karma(nick, from){
    karma.findOne({"nick":nick}, function(err, data){
      if(data){
      var count = data.count;
      irc.say(from, nick + ' has ' + count + ' awesome points.');
      return;
      }
      irc.say(from, nick + ' has no awsome points. How sad.');
    });
  }
  function answer_karma(nick, from){
    karma.findOne({"nick":nick}, function(err, data){
      if(data){
      var count = data.count;
      irc.say(room, nick + ' has ' + count + ' awesome points.');
      return;
      }
      irc.say(room, nick + ' has no awsome points. How sad.');
    });
  }
}

               
      
