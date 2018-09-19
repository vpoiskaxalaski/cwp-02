// client.js
const net = require('net');
const fs = require('fs');
var S = require('string');
const port = 8124;
let questionArray;
const client = new net.Socket();
let i = 0;


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

client.connect(port, function() {
	i=0;
  	client.write('QA');
  	qaFile = fs.readFileSync('qa.json');  
  	let questions = JSON.parse(qaFile);
  	questionArray = Array.from(questions); 
	 shuffleArray(questionArray); 
});


function checkAnswer(ans, iterator){
	if(S(ans).include(questionArray[iterator]['answer'])){
			client.write('true');
		}else{
			client.write('false');
		}
}

client.on('data', (data) => {
	//если серрвер подключил клиента
	if(data == 'ACK'){
		console.log('Connection is successful');
		client.write('start test');		
	}else if(data == 'DEC'){
		console.log('Connection isn\'t successful');
		client.destroy();
	}else if(S(data).endsWith('check')){
		questionArray.forEach(function(currentValue) {
      		if(S(data).strip('check').s == currentValue['answer']){
      		checkAnswer(data, i);
			i++;
      		}
    	});
	}
	else{
		
		//отправка вопросов
		if(i==5){
			client.destroy();
		}else{
			client.write(questionArray[i]['question']);
		}
	}
	
});

client.on('close', function() {
  console.log('Connection closed');
});
