const fs = require('fs');
const net = require('net');
const exec = require('child_process');
const clientSwarm = require('./client-swarm.js');
const port = 8124;

clientSwarm(process.argv[2]);

var right = 0;
var quest;
var count = 0;
var clientCount;

const client = new net.Socket();
client.setEncoding('utf8');

const qaFile = fs.readFileSync('qa.json',"utf8");  
let arrQuestion = JSON.parse(qaFile);
max = arrQuestion.length;

client.connect(port, function () {
  shuffleArray(arrQuestion);
  console.log('Connected');
  sendQA();
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

client.on('data', function (data) {
  if(data.indexOf('ASK') == 0){
    clientCount = (data.toString()).substring(3);
    console.log('----------start test----------');

    sendMessageToServer(client, arrQuestion);
  }
  else if(data == 'DEC'){
    client.destroy();
  }
  else if(data.indexOf('answer') == 0){
    let answer = (data.toString()).substring(6);
    console.log('Вопрос: ' + quest + ' ' + 'Ответ: ' + answer);
    count = count + 1;

    fs.appendFileSync('client' + clientCount + '.txt', 'Вопрос: ' + quest + ' ' + 'Ответ: ' + answer + '\r\n');

    for(let i = 0; i < arrQuestion.length; i++){
      if(arrQuestion[i].question == quest && arrQuestion[i].answer == answer){
        right = right + 1;;
      }
    }

    if(count != arrQuestion.length){
      sendMessageToServer(client, arrQuestion);
    }
    else{
      fs.appendFileSync('client' + clientCount + '.txt', 'Количество правильных ответов: ' + right);
      console.log('Количество правильных ответов: ' + right);
      client.destroy();
    }
  }
});


function sendQA() {
  console.log('client want to talk');
  client.write('QA');
};

function sendMessageToServer(client, arrQuestion) {

  quest = arrQuestion[count].question;
  client.write('ask' + quest);
};


client.on('close', function () {
  console.log('Connection closed');
});