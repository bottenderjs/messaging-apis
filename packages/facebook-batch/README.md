# facebook-batch

> Gracefully batching facebook requests.

This module is based on the approach described in [Making Batch Requests](https://developers.facebook.com/docs/graph-api/making-multiple-requests/).

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)

## Installation

```sh
npm i --save facebook-batch
```

or

```sh
yarn add facebook-batch
```

<br />

## Usage

```js
const { MessengerClient, MessengerBatch } = require('messaging-api-messenger');
const { FacebookBatchQueue } = require('facebook-batch');

const queue = new FacebookBatchQueue({
  accessToken: ACCESS_TOKEN,
});

(async () => {
  await queue.push(
    MessengerBatch.sendText('psid', 'hello!');
  );

  await queue.push(
    MessengerBatch.sendMessage('psid', {
      attachment: {
        type: 'image',
        payload: {
          url:
            'https://cdn.free.com.tw/blog/wp-content/uploads/2014/08/Placekitten480-g.jpg',
        },
      },
    })
  );

  const profile = await queue.push(MessengerBatch.getUserProfile('psid'));


  console.log(profile);

  queue.stop();
})();
```

Retry for error: `(#613) Calls to this api have exceeded the rate limit.`.

```js
const { FacebookBatchQueue, isError613 } = require('facebook-batch');

const queue = new FacebookBatchQueue(
  {
    accessToken: ACCESS_TOKEN,
  },
  {
    shouldRetry: isError613,
    retryTimes: 2,
  }
);
```

## Options

### delay

Default: `1000`.

### retryTimes

Default: `0`.

### shouldRetry

Default: `() => true`.
