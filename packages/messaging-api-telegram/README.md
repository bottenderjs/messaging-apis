# messaging-api-telegram

> Messaging API client for Telegram

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)

## Installation

```sh
npm i --save messaging-api-slack
```
or
```sh
yarn add messaging-api-slack
```

## Usage

### Initialize

```js
import { TelegramClient } from 'messaging-api-telegram';

// get accessToken from telegram [@BotFather](https://telegram.me/BotFather)
const client = SlackClient.connect('12345678:AaBbCcDdwhatever');
```

## API Reference

All methods return a Promise.

### Send API

[Official docs](https://core.telegram.org/bots/api#available-methods)
