// server.js
const net = require('net');
const port = 8124;
let clientID = Date.now();


const server = net.createServer((client) => {
  console.log('Client '+clientID +' connected');

  client.setEncoding('utf8');

  client.on('data', (data) => {
    console.log('client send: ' +data);
    if(data == 'QA'){      
      client.write('ACK');
    }else{
      client.write('DEC');
    }
  
  });

  client.on('end', () => console.log('Client disconnected'));
});

server.listen(port, () => {
  console.log(`Server listening on localhost:${port}`);
});
