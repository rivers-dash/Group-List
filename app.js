var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'), // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
    fs = require('fs');

let list = []

// Chargement de la page index.html
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket, user) {
    // Dès qu'on nous donne un user, on le stocke en variable de session et on informe les autres personnes
    socket.on('newUser', function(user) {
        user = ent.encode(user);
        socket.user = user;
        socket.broadcast.emit('newUser', user);
				socket.emit('list', list);
    });

    // Dès qu'on reçoit un item, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('item', function (item) {
        item = ent.encode(item);
				let data = { item: item, user: socket.user };
				list.push(data)
        socket.broadcast.emit('item', data);
    });
});

server.listen(8080);
