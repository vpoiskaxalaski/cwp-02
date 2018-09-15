// client.js
const net = require('net');
const fs = require('fs');
const port = 8124;

const client = new net.Socket();

client.setEncoding('utf8');

//Перемешивание массива
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

client.connect(port, function() {
  client.write('QA');
  qaFile = fs.readFileSync('qa.json');  
  let questions = JSON.parse(qaFile);
  let questionArray = Array.from(questions);
  shuffleArray(questionArray);
  let obj = questionArray[3];
  console.log(obj);
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
