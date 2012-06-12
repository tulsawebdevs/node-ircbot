//music ircbot plugin: Sends the current song to IRC
//version: 1.1.0
//authon: Blixa Morgan <blixa@projectmakeit.com>
/*
This work is licensed under the Creative Commons Attribution-NonCommercial 3.0 Unported License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/3.0/ or send a letter to Creative Commons, 444 Castro Street, Suite 900, Mountain View, California, 94041, USA.
*/

exports.setup=function(table,irc,extra){
   //set variable global to allow later access.
   var song;
   var artist;
   var room = extra.room;
   //when there is a new song.
   table.on('newsong', function(data){
     song = data.room.metadata.current_song.metadata.song;
     artist = " by "+data.room.metadata.current_song.metadata.artist;
     irc.say(room,"Current song: "+song+artist);
   });
   table.on('nosong', function(err,data){
     song = "No song playing.";
     artist = "";
     //let everyone know there is no song now.  they need to fix that.
     irc.say(room,"The tunes have stopped.");
   });
   irc.addListener('message'+room, function (from, message) {
      //User requested current song
      if(message.match(/^!song$/)){
        irc.say(room,"Current song: "+song+artist);
      }
    });
};
