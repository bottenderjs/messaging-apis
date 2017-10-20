# axios-error

> An axios error wrapper that aim to provide clear error message to the user

## Installation

```sh
npm i --save axios-error
```
or
```sh
yarn add axios-error
```

<br />

## Usage

```js
const AxiosError = require('axios-error');

// You can construct it from error throw by axios
new AxiosError(message, errorThrowByAxios);

// Or construct it from axios config, axios request and axios response
new AxiosError(message, { config, request, response });
```
