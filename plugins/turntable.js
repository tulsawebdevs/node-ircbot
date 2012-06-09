//basic turntable commands
exports.setup = function (table,irc,room){
table.on('speak', function (data) {
   // Get the data
   var name = data.name;
   var text = data.text;
   // Bop
   if (text.match(/bop/)){
      console.log('upvote from '+name+'.');
      table.vote('up');
      table.speak('The great DJ accepts!');
   }
   // DeBop
   if (text.match(/^!karma--$/)){
      console.log('downvote from '+name+'.');
      table.vote('down');
      table.speak('Someone disapproves!');
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
   if (text.match(/^Woooo/)) {
      table.speak('I Summon the great DJ Wooooo!');
      setTimeout(function() {table.speak('Nope can\'t do it.');},3000);
   }
});
table.on('pmmed', function(data){
   var name = data.name;
   var text = data.text;
   if (text.match(/^!skip$/)) {
      table.skip();
   }
   if (text.match(/^!chrometop$/)){
      table.modifyLaptop ('chrome');
   }
   if (text.match(/^!mactop$/)){
      table.modifyLaptop ('mac');
   }
   if (text.match(/^!pctop$/)){
      table.modifyLaptop ('pc');
   }
   if (text.match(/^!linuxtop$/)){
      table.modifyLaptop ('linux');
   }
   if (text.match(/^!iphone$/)){
      table.modifyLaptop ('iphone');
   }
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
   // DeBop
   if (message.match(/^!karma--$/)){
      console.log('downvote from '+from+'.');
      table.vote('down');
      irc.say(room ,'Someone disapproves!');
   }
   // start DJing
   if (message.match(/^!dj$/)) {
      table.addDj();
   }
   // stop DJing
   if (message.match(/^!listen$/)) {
      table.remDj();
   }
   if (message.match(/^Woooo/)) {
      irc.say(room ,'DJ Wooooo refuses to come.');
   }
  });
}
function add(songid){
  table.playlistAdd(songid.docs[0]._id);
  console.log(songid.docs[0]._id);
}
