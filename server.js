// server.js
const net = require('net');
const fs = require('fs');
const port = 8124;
let clientID = 1;

//Перемешивание массива
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
  return array;
}

const json =  fs.readFileSync('qa.json');
let test = JSON.parse(json);
let testArray = Array.from(test); 
shuffleArray(testArray);


const server = net.createServer((client) => {
  console.log('Client '+clientID +' connected');
  client.setEncoding('utf8');

  client.on('data', (data) => {
   
    console.log('client send: ' + data);
    if(data == 'QA'){  
      fs.writeFile("Client"+clientID+".log", "Client: "+data+"\r\n",function(){});   
      fs.appendFileSync("Client"+clientID+".log", "Server: ACK\r\n");    
      client.write('ACK');
    }else if(data == 'start test' || data == 'false' || data == 'true'){
      fs.appendFileSync("Client"+clientID+".log", "Client: "+data + "\r\n");
      fs.appendFileSync("Client"+clientID+".log", "Server: go\r\n");
      client.write('go');
    }else{
      // client.write('DEC');
      fs.appendFileSync("Client"+clientID+".log", "Client: "+data + "\r\n");
      testArray.forEach(function(currentValue) {
      if(data == currentValue['question']){
        let index = Math.floor(Math.random() * 3);
        let a = testArray[index]['answer'];
        console.log('server answered: '+ a);
        fs.appendFileSync("Client"+clientID+".log","Server: "+ a+"\r\n");
        client.write(a+ 'check');
      }
    });
    } 
  });
  client.on('close', () =>{
    fs.appendFileSync("Client"+clientID+".log", "Client disconnected\r\n");
    console.log('Client disconnected');
    clientID++;
  });
});

server.listen(port, () => {
  console.log(`Server listening on localhost:${port}`);
});
