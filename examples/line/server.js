const express = require('express');
const verifyMiddleware = require('./middleware/verify')
const { Line, LineClient } = require('messaging-api-line');

const client = LineClient.connect(process.env.ACCESS_TOKEN, process.env.CHANNEL_SECRET);

const server = express();

const config = {
  channelSecret: process.env.CHANNEL_SECRET
};

const imageUrl = 'https://camo.githubusercontent.com/aa9c9a7b1257706f763b300fbdbd87f252cdf183/687474703a2f2f6973352e6d7a7374617469632e636f6d2f696d6167652f7468756d622f507572706c653131372f76342f30312f63322f34642f30316332346439392d346161652d373165612d323465322d6430623638663863353364322f736f757263652f313230307836333062622e6a7067'

server.post('/webhook', verifyMiddleware(config), (req, res) => {
  const body = req.body;
  const { events } = body;

  Promise
    .all(events.map(handleEvent))
    .then(result => res.status(200).send(result))
    .catch(err => console.log(err))
});

const handleEvent = (event) => {
  const { type, replyToken, message } = event;
  const messageType = message.type
  if (type !== 'message' || messageType !== 'text') {
    return Promise.resolve(null);
  }
  return client.reply(replyToken, [
    Line.createText('Hello'),
    Line.createImage(
      imageUrl
    ),
    Line.createText('End')
  ])
}

module.exports = server;
