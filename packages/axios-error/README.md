# axios-error

> Axios error wrapper that aim to provide clear error message to developers

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

// You can construct it from the error thrown by axios
const error = new AxiosError(errorThrownByAxios);

// Or with an custom error message
const error = new AxiosError(message, errorThrownByAxios);

// Or construct it from axios config, axios request and axios response
const error = new AxiosError(message, { config, request, response });
```

Calling `console.log` on the error instance returns the formatted message. If you'd like to get the axios `request`, `response`, or `config`, you can still get them via the following keys on the error instance:

```js
console.log(error); // formatted error message
console.log(error.stack); // error stack trace
console.log(error.config); // axios request config
console.log(error.request); // HTTP request
console.log(error.response); // HTTP response
```
