const fs = require('fs');
const net = require('net');
const port = 8124;

var i = 0; //уникальный идентификатор для клиента

var formJSON = fs.readFileSync('qa.json', 'utf8');
let arrQuestion = JSON.parse(formJSON);
max = arrQuestion.length;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

const server = net.createServer((client) => {
  console.log('--------------- client: ' + (++i) + ' ---------------');

    shuffleArray(arrQuestion); 

  client.on('data', (data) => {
    if(data == 'QA'){
      client.write('ASK' + i.toString());
    }
    else if(data == 'DEC') {
      client.write('DEC');
    }
    else if(data.indexOf('ask') == 0){

      var rand = max * Math.random();
      rand = Math.floor(rand);

      console.log('Вопрос: ' + (data.toString()).substring(3) + ' ' + 'Ответ: ' + arrQuestion[rand].answer);
      client.write('answer' + arrQuestion[rand].answer);
    }
  });


  client.on('end', () => console.log('Client disconnected'));
});


server.listen(port, () => {
  console.log(`Server listening on localhost:${port}`);
});