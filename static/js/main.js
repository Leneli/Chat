$(document).ready(function () {
	var socket = io();
	var $text = $('#msg_txt');
	var $messages = $('#messages');
	var $users = $('#users');

	socket.on('connect', function(data) {
		// TODO
	});

	socket.on('user', function(data) {
		$users.empty();
		var template = '<li class="nav-header"> Пользователи в чате </li>';

		for (var i in data) {
			template += `<li> ${data[i]} </li>`;
		}

		$users.append(template);
	});

	function msg(name, message) {
		var template = `<tr class="msg"> 
						<td class="span2" > ${name} </td>
						<td class="span7" > ${message} </td>
						</tr>`;

		$messages.prepend(template);
	}

	socket.on('message', function(data){
		msg(data.name, data.message);
	});

	socket.on('system', function(data){
		msg('<i>System message</i>', `<i> ${data} </i>`)
	});

	$(window).on('unload', function(){
		socket.disconnect();
	});

	$('#msg_btn').on('click', function(){
		var text = $text.val();
		var name = $('#msg_name').val();

		if (!text.length) return;
		if (!name.length) name = 'Аноним';

		$text.val('').focus();

		socket.emit('message', {
			message: text,
			name: name
		});
	})
});