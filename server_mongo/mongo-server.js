const mongodb =require('mongodb');
const MongoClient = mongodb.MongoClient;
const dbName = 'chatting';
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.use('/', express.static(__dirname + '/build'));

io.sockets.on('connection', function (socket) {
    socket.on('channelJoin',function(channel){
        socket.join(channel);
        MongoClient.connect('mongodb://localhost:27017/', function (error, client) {
            if (error) console.log(error);
            else {
                const db = client.db(dbName);
                db.collection('log').find({channel:channel}).sort({data:1}).toArray(function(err,doc){
                    if (err) console.log(err);
                    doc.forEach(function(item){
                        socket.emit('receive', {chat:item});
                    });
                    let msg={msg:socket.handshake.address+"님이 "+channel+" 채널에 입장하셨습니다."};
                    io.to(channel).emit('receive', {chat:msg});
                    client.close();
                });
            }
        });
    });
    socket.on('send', function (data) {
        let dataAddinfo={ip:socket.handshake.address, msg:data.msg, date:Date.now()};
        MongoClient.connect('mongodb://localhost:27017/', function (error, client) {
            if (error) console.log(error);
            else {
                const db = client.db(dbName);
                db.collection('log').insert({ip:dataAddinfo.ip, msg:dataAddinfo.msg, date:dataAddinfo.date, channel:data.channel}, function (err, doc) {
                    if (err) console.log(err);
                    client.close();
                });
            }
        });
        io.to(data.channel).emit('receive', {chat:dataAddinfo});
    });
    socket.on('channelLeave', function(channel){
        socket.leave(channel);
        let msg={msg:socket.handshake.address+"님이 "+channel+" 채널에서 퇴장하셨습니다."};
        io.to(channel).emit('receive', {chat:msg});
    });
});

http.listen(8000, function(){
    console.log('listening on *:8000');
});