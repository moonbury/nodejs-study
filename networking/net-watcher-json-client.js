`use strict`;

const net = require('net');
const client = net.connect({port: 60300});
client.on('data', data => {
  const message = JSON.parse(data);
  if (message.type === 'watching') {
    console.log(`now watching: ${message.file}`);
  } else if (message.type === "changed") {
    const date = new Date(message.timestamp);
    console.log(`file chaned: ${date}`);
  } else {
    console.log(`wrong meesage type: ${message.type}`);
  }

});
