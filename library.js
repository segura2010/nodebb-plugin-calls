'use strict';

var User = module.parent.require('./user');
var Topic = module.parent.require('./topics');
var db = module.parent.require('./database');
var SocketAdmins = module.parent.require('./socket.io/admin');
var SocketPlugins = module.parent.require('./socket.io/plugins');
var websockets = module.parent.require('./socket.io');

var calls = {};


  // Sockets

  SocketPlugins.callUser = function (socket, data, callback) {
    console.log(socket.uid+" is calling to "+data.uid);
    User.getUserData(socket.uid, function(err, usData){
      websockets.server.sockets.emit('plugins.incomingCall.'+data.uid, {uid:socket.uid, username:usData.username});
    });
  };

  SocketPlugins.acceptedIncomingCall = function (socket, data, callback) {
    console.log(socket.uid+" accepted call from "+data.youruid);
    User.getUserData(socket.uid, function(err, usData){
      websockets.server.sockets.emit('plugins.acceptedIncomingCall.'+data.youruid, {peerid:data.peerid, username:usData.username});
    });
  };

module.exports = calls;
