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
      karma.findOne({"nick":giveto},function (err,data){
        if(!data){
          var count = 1;
        }else{
          var count = data.count+1;
        }
        //karma is zero, remove nick from DB to save clutter.
        if(count==0){
          karma.remove({"nick":giveto});
          irc.say(room, giveto+" has no more karma.");
          return;
        }
        karma.update({"nick":giveto}, {"nick":giveto, "count":count}, {upsert:true},function(err,data){show_karma(giveto);});
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
      karma.findOne({"nick":giveto},function (err,data){
        if(!data){
          var data = {"count":"0"};
        }
        var count = data.count-1;
        //karma is zero, remove nick from DB to save clutter.
        if(count==0){
          karma.remove({"nick":giveto});
          irc.say(room, giveto+" has no more karma.");
          return;
        }
        karma.update({"nick":giveto}, {"nick":giveto, "count":count}, {upsert:true},function(err,data){show_karma(giveto);});
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
            show_karma(karmas[x].nick);
          }
        }
      });
    }
  });
  //Return karma for nick.
  function show_karma(nick){
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

               
      
