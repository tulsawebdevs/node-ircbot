var mongodb = require('mongodb');

var server = new mongodb.Server('ds031617.mongolab.com',31617, {});
var db = new mongodb.Db('tulsabot', server, {})

exports.setup=function(table,irc,room){
  db.open(function(err,res){  
    db.authenticate('tulsabot',process.env.PASS,function(err,res){
    });
  });
  var karma = db.collection('karma');
  irc.addListener('message'+room, function (from, message) {
    if(message.match(/^!(\S+)[\+]{2}/)){
      var giveto = message.match(/!(\S+)[\+]{2}/)[1].toLowerCase();
      if(giveto==from){
        irc.say(room, "Just keep telling yourself that.");
        return;
      }
      if(giveto=='tulsabot'){
        irc.say(room, "Are you trying to rip a hole in the space-time continuum?");
        return;
      }
      karma.findOne({"nick":giveto},function (err,data){
        if(!data){
          var count = 1;
        }else{
          var count = data.count+1;
        }
        if(count==0){
          karma.remove({"nick":giveto});
          irc.say(room, giveto+" has no more karma.");
          return;
        }
        karma.update({"nick":giveto}, {"nick":giveto, "count":count}, {upsert:true},function(err,data){show_karma(giveto);});
      });
    }
    if(message.match(/^!(\S+)[\-]{2}/)){
      var giveto = message.match(/!(\S+)[\-]{2}/)[1].toLowerCase();
      if(giveto==from){
        irc.say(room, "There are special rooms on this network for your kind.");
        return;
      }
      if(giveto=='tulsabot'){
        irc.say(room, "I wouldn't do that if I were you...");
        return;
      }
      karma.findOne({"nick":giveto},function (err,data){
        if(!data){
          var data = {"count":"0"};
        }
        var count = data.count-1;
        if(count==0){
          karma.remove({"nick":giveto});
          irc.say(room, giveto+" has no more karma.");
          return;
        }
        karma.update({"nick":giveto}, {"nick":giveto, "count":count}, {upsert:true},function(err,data){show_karma(giveto);});
      });
    }
    if(message.match(/^!karma\?(\s+)?(\S+)?/)){
      if(message.match(/^!karma\?(\s+)?(\S+)?/)[2]){
        show_karma(message.match(/^!karma\?(\s+)?(\S+)?/)[2]);
      return;
      }
      karma.find().toArray(function (err,karmas){
        for(var x=0;x<karmas.length; x++){
          show_karma(karmas[x].nick);
        }
      });
    }
  });

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

               
      
