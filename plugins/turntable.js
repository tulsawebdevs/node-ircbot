//Turntable ircbot plugin: impliments turntable commands in both irc and turntable chats.
//version: 1.1.0
//authon: Blixa Morgan <blixa@projectmakeit.com>
/*
This work is licensed under the Creative Commons Attribution-NonCommercial 3.0 Unported License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/3.0/ or send a letter to Creative Commons, 444 Castro Street, Suite 900, Mountain View, California, 94041, USA.
*/

exports.setup = function (table,irc,extra){
  var room = extra.room; 
  //Turntable chat
  table.on('speak', function (data) {
     // Get the data
     var name = data.name;
     var text = data.text;
     // if bop is in the message, upvote current song
     if (text.match(/vote/)){
        console.log('upvote from '+name+'.');
        table.vote('up');
        table.speak('The great DJ accepts!');
     }
     // start DJing
     if (text.match(/^!dj$/)) {
        console.log('djing');
        table.addDj();
     }
     // stop DJing
     if (text.match(/^!listen$/)) {
        console.log('not djing');
        table.remDj();
     }
     if (text.match(/^!skip$/)) {
        table.skip();
     }
     // Summon DJ Wooooo
     if (text.match(/^Woooo/)) {
        table.speak('I Summon the great DJ Wooooo!');
        setTimeout(function() {table.speak('Nope can\'t do it.');},3000);
     }
  });
  //Turntable Private Message
  table.on('pmmed', function(data){
     //Get Data
     var name = data.name;
     var text = data.text;
     //Skip the current song
     if (text.match(/^!skip$/)) {
        table.skip();
     }
     //Change to Chrome laptop
     if (text.match(/^!chrometop$/)){
        table.modifyLaptop ('chrome');
     }
     //Change to Mac laptop
     if (text.match(/^!mactop$/)){
        table.modifyLaptop ('mac');
     }
     //Change to PC laptop
     if (text.match(/^!pctop$/)){
        table.modifyLaptop ('pc');
     }
     //Change to Linux laptop
     if (text.match(/^!linuxtop$/)){
        table.modifyLaptop ('linux');
     }
     //Change to iPhone
     if (text.match(/^!iphone$/)){
        table.modifyLaptop ('iphone');
     }
     //Change to Andriod
     if (text.match(/^!android$/)){
        table.modifyLaptop ('android');
     }
     if (text.match(/^!add/)){
        var song=text.split("?");
        if(song[1]!=""){
          console.log('added '+song[1]);
          table.searchSong(song[1],add);
        }
     }
  });
  irc.addListener('message'+room, function (from, message) {
       // Bop
    if (message.match(/bop/)){
       console.log('upvote from '+from+'.');
       table.vote('up');
       irc.say(room ,'The great DJ accepts!');
    }
    if (message.match(/^!skip$/)) {
        table.skip();
     }
    if (message.match(/^!whereru$/)){
        table.roomRegister(process.env.ROOMID);
    }
    if(message.match(/^!goodbye$/)){
        table.roomDeregister();
    }
    // DeBop: interfears with karma plugin. not used
    /*if (message.match(/^!karma--$/)){
       console.log('downvote from '+from+'.');
       table.vote('down');
       irc.say(room ,'Someone disapproves!');
    }*/
    // start DJing
    if (message.match(/^!dj$/)) {
       table.addDj();
    }
    // stop DJing
    if (message.match(/^!listen$/)) {
       table.remDj();
    }
    // Summon DJ Wooooo
    if (message.match(/^Woooo/)) {
       irc.say(room ,'DJ Wooooo refuses to come to an inferior irc channel.');
    }
  });
  
function add(songid){
  table.playlistAdd(songid.docs[0]._id);
}
}
