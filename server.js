// server.js
const net = require('net');
const fs = require('fs');
const port = 8124;
let clientID = Date.now();

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
      client.write('ACK');
    }else if(data == 'start test' || data == 'false' || data == 'true'){
      client.write('go');
    }else{
      // client.write('DEC');
      testArray.forEach(function(currentValue) {
      if(data == currentValue['question']){
        let index = Math.floor(Math.random() * 3);
        let a = testArray[index]['answer'];
        console.log('server answered: '+ a);
        client.write(a+ 'check');
      }
    });
    } 
  });
  client.on('close', () =>{
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server listening on localhost:${port}`);
});
