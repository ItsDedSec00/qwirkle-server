const PORT = 3000;

const server = require('http').createServer();
const io = require('socket.io')(server);

// Listen for incoming connections
server.listen(PORT, (err) => {
    if (err) throw err;
	console.log(`\nQwirkle IO Server v2 starting now on Port: ${PORT}\n`);
});

var player = [];

io.on('connection', (client) => {
    console.log(`New connection: ${client.id}\n`);
	// Send clients SID
	client.emit('client_id', {
		client_id: client.id
	});
	
    client.on('login', (data) => {
        console.log(`Player Login: ${data}\n`);

        //send same data back
        client.emit('login', data);
		client.broadcast.emit('create_other', data);
    });
	
    client.on('position_update', (data) => {

        client.broadcast.emit('position_update', data);
    });
	
	client.on('server_create', (data) => {
		console.log(`Create Server: ${data}\n`);
        client.emit('server_create', data);
    });
	
	client.on('server_search', (data) => {
        client.broadcast.emit('server_search', data);
    });
	
	client.on('place_block', (data) => {
        client.broadcast.emit('place_block', data);
    });
	
	client.on('server_broadcast', (data) => {
        io.emit('server_broadcast', data);
    });
	
	client.on('join_server', (data) => {
		console.log(`User try to connect: ${data}\n`);
        client.broadcast.emit('join_server', data);
    });
	
	client.on('host_round', (data) => {
		console.log(`Host sent Round: ${data}\n`);
        io.emit('host_round', data);
    });
	
	client.on('next_round', (data) => {
		console.log(`Client sent Round: ${data}\n`);
        io.emit('next_round', data);
    });

    client.on('disconnect', (data) => {
        console.log(`Client disconnected: ${client.id}\n`);
		client.broadcast.emit('destroy_other', data);
    });
});