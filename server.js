var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(3000, function () {
	console.log('Server running in port 3000');
});

//статические ресурсы
app.use(express.static(__dirname + '/static'));

var users={};
// подключение пользователя
io.sockets.on('connection', function(client){
	// добавление пользователя в объект всех пользователей
	users[client.id] = 'Аноним';
	broadcast('user', users);
	broadcast('system', 'В чат вошел новый пользователь');

	// подписываемся на сообщения от пользователя
	client.on('message', function(message) {
		try {
			// проверяем смнеил ли имя пользователь
			if (users[client.id] !== message.name) {
				broadcast('system', `Пользователь  ${users[client.id]} сменил имя на ${message.name}`);
			}

			users[client.id] = message.name;
			
			broadcast('message', message);
			broadcast('user', users);
		} catch(e) {
			console.log(e);
			client.disconnect();
		}
	});

	client.on('disconnect', function(data) {
		broadcast('system', `Чат покинул пользователь ${users[client.id]}`);
		delete users[client.id];
		client.broadcast.emit('user', users);
	});

	function broadcast( event, data) {
		client.emit(event, data);
		client.broadcast.emit(event, data);
	}
})
