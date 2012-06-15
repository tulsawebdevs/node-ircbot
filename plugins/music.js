//music ircbot plugin: Manages song to IRC interaction.
//version: 1.2.0
//authon: Blixa Morgan <blixa@projectmakeit.com>
/*
This work is licensed under the Creative Commons Attribution-NonCommercial 3.0 Unported License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/3.0/ or send a letter to Creative Commons, 444 Castro Street, Suite 900, Mountain View, California, 94041, USA.
*/
exports.setup=function(table,irc,extra){
   //set variable global to allow later access.
   var store = extra.db.collection('songs');
   var song;
   var artist;
   var room = extra.room;
   var count = 0;
   setTimeout(song_callback, 1000);
   //list pop songs every hour.
   function song_callback(){
       store.find().toArray(function(err,data){
         if(data.length){
           irc.say(room, "Your http://turntable.fm/tulsawebdevs recap");
           for(x=0;x<data.length;x++){
             irc.say(room,data[x].song+' by '+data[x].artist);
           }
           store.remove();
         }
       });
     setTimeout(song_callback, 60*60*1000);
   };
   table.on('endsong', function(data){
     song = data.room.metadata.current_song.metadata.song;
     artist = data.room.metadata.current_song.metadata.artist;
     vote = data.room.metadata.upvotes - data.room.metadata.downvotes
     if(vote > 0){
       var doc = {song: song, artist: artist};
       count++;
       store.insert(doc);
     }
     //irc.say(room,"Current song: "+song+artist);
   });
   table.on('newsong', function(data){
     song = data.room.metadata.current_song.metadata.song;
     artist = data.room.metadata.current_song.metadata.artist;
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
        irc.say(room,"Current song: "+song+" by "+artist);
      }
    });
};
