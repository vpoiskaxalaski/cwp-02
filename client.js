// client.js
const net = require('net');
const port = 8124;

const client = new net.Socket();

client.setEncoding('utf8');

client.connect(port, function() {
  client.write('QA');
});


client.on('data', function(data) {
	if(data == 'ACK'){
		console.log('Connection is successful');
	}else if(data == 'DEC'){
		console.log('Connection isn\'t successful');
	}
	client.destroy();
});

client.on('close', function() {
  console.log('Connection closed');
});
