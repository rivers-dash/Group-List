var http = require('http');
var fs = require('fs');

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
		socket.emit('clientConnected');

		// Quand un petit nouveau envoie son pseudo
		socket.on('pseudo', function(pseudo) {
			socket.pseudo = pseudo;
			if (socket.pseudo) {
				let data = {
					user: socket.pseudo,
					message: ' viens de rejoindre la conversation '
				}
				socket.broadcast.emit('newUser', data);
			}
			console.log(socket.pseudo + ' viens de rejoindre la conversation ');
			 socket.on('message', function(message) {
				 console.log('Sombody is trying to send a message !')
				 let data = {
					 message: message,
					 author: socket.pseudo,
				 }
				 socket.broadcast.emit('newMessage', data);
			 })

		});
});


server.listen(8080);
