`use strict`;

const server = require('net').createServer(connection => {
  console.log("subscriber connected.");

  const firstChunk = '{"type":"changed","timesta';
  const secondChunk = 'mp":1450694370094}\n';

  connection.write(firstChunk);

  const timer = setTimeout(() => {
    connection.write(secondChunk);
    connection.end();
  }, 100);

  //clear timer
  connection.on('end', () => {
    clearTimeout(timer);
    console.log('subscriber disconnected');
  });
});

server.listen(60300, function() {
  console.log('Test server listen for subscribers...');
});
