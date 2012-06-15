//Web ircbot plugin: adds web api's.
//version: 1.0.0
//authon: Blixa Morgan <blixa@projectmakeit.com>
/*
This work is licensed under the Creative Commons Attribution-NonCommercial 3.0 Unported License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/3.0/ or send a letter to Creative Commons, 444 Castro Street, Suite 900, Mountain View, California, 94041, USA.
*/

exports.setup=function(table,irc,extra){
  var express = require("express");

  var myScriptVersion = '1.0.0';

  var server = express.createServer(),
    io = require('socket.io').listen(server);
  server.use(express.static(__dirname + "/web"));
  server.enable("jsonp callback");
  server.get("/version", function(req, res) {
    // this is important - you must use Response.json()
    res.json('{"version":"'+myScriptVersion+'"}');
  });
  server.get("/playlist",function(req,res){
    res.sendfile(__dirname + "/web/playlist.html");
  });
  server.get("/playlist/get", function(req, res) {
    table.playlistAll(function(data){
      res.json(data);
    });
  });
  server.get("/playlist/:start/:stop/change", function(req, res) {
    var start = req.params.start;
    var stop = req.params.stop;
    console.log(parseInt(start)+", "+parseInt(stop));
    table.playlistReorder(parseInt(start),parseInt(stop));
    res.json("{done:'true'}");
  });
  server.get("/playlist/:index/delete", function(req, res) {
    var index = req.params.index;
    console.log(parseInt(index));
    table.playlistRemove(parseInt(index));
    res.json("{done:'true'}");
  });
  server.get("/playlist/:query/search", function(req, res) {
    var query = req.params.query;
    table.searchSong(query, function(data){
      res.json(data);
    });
  });
  server.get("/playlist/:id/add", function(req,res){
    var id = req.params.id;
    table.playlistAdd(id);
    res.json("{done:'true'}");
  });
  server.listen(8081);
  io.sockets.on('connection', function (socket) {
    table.playlistAll(function(data){
      socket.emit('playlist', data);
    });
    socket.on('add song', function (id) {
      table.playlistAdd(id, function(data){
      table.playlistAll(function(data){
        socket.emit('playlist', data);
      });
      });
    });
    socket.on('remove song', function (index){
      table.playlistRemove(index, function(data){
      table.playlistAll(function(data){
        socket.emit('playlist', data);
      });
      });
    });
    socket.on('change song', function(data){
      var start = data.start;
      var stop = data.stop;
      table.playlistReorder(start,stop, function(data){
      table.playlistAll(function(data){
        socket.emit('playlist', data);
      });
      });
    });  
    socket.on('search song', function(query){
      table.searchSong(query, function(data){
        socket.emit('search results', data);
      });
    });
  });
};
