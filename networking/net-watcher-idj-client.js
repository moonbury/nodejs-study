`use strict`;

const netClient = require('net').connect({port:60300});
const idjClient = require('./lib/ldj-client.js').connect(netClient);

idjClient.on('message',message=>{
  if (message.type === 'watching') {
    console.log(`now watching: ${message.file}`);
  } else if (message.type === "changed") {
    const date = new Date(message.timestamp);
    console.log(`file chaned: ${date}`);
  } else {
    console.log(`wrong meesage type: ${message.type}`);
  }
});
