# messaging-apis

## Packages

| Package | Version | Platform |
|---------|---------|-------------|
| [`messaging-api-messenger`](/packages/messaging-api-messenger) | [![npm](https://img.shields.io/npm/v/messaging-api-messenger.svg?style=flat-square)](https://www.npmjs.com/package/messaging-api-messenger) | [Messenger](https://www.messenger.com/) |
| [`messaging-api-line`](/packages/messaging-api-line) | [![npm](https://img.shields.io/npm/v/messaging-api-line.svg?style=flat-square)](https://www.npmjs.com/package/messaging-api-line) | [LINE](https://line.me/) |

## Usage

### Messenger

Install `messaging-api-messenger` package from the registry:

```sh
npm i --save messaging-api-messenger
```
or
```sh
yarn add messaging-api-messenger
```

Then, create a MessengerClient to call Messenger APIs:

```js
import { MessengerClient } from 'messaging-api-line';

// get accessToken from facebook developers website
const client = MessengerClient.connect(accessToken);

client.sendText(userId, 'Hello World')
  .then(() => {
    console.log('sent');
  });
```

Check out [full API documentation](./packages/messaging-api-messenger/README.md) for more detail information.

### LINE

Install `messaging-api-line` package from the registry:

```sh
npm i --save messaging-api-line
```
or
```sh
yarn add messaging-api-line
```

Then, create a LINEClient to call LINE APIs:

```js
import { LINEClient } from 'messaging-api-line';

// get accessToken and channelSecret from LINE developers website
const client = LINEClient.connect(accessToken, channelSecret);

client.pushText(userId, 'Hello World')
  .then(() => {
    console.log('pushed');
  });
```

Check out [full API documentation](./packages/messaging-api-line/README.md) for more detail information.

## License

MIT © [Yoctol](https://github.com/Yoctol/messaging-apis)
