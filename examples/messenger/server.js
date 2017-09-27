const express = require('express');
const bodyParser = require('body-parser');
const { MessengerClient } = require('messaging-api-messenger');

const server = express();
const client = MessengerClient.connect(process.env.ACCESS_TOKEN);

server.use(bodyParser.json());

server.get('/', (req, res) => {
  if (
    req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === process.env.VERIFY_TOKEN
  ) {
    res.send(req.query['hub.challenge']);
  } else {
    console.error('Failed validation. Make sure the validation tokens match.');
    res.sendStatus(403);
  }
});

server.post('/', (req, res) => {
  const event = req.body.entry[0].messaging[0];
  const userId = event.sender.id;
  const { text } = event.message;
  client.sendText(userId, text);
  res.sendStatus(200);
});

module.exports = server;
