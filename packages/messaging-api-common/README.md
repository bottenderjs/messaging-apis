# messaging-api-common

> Helpers for common usages in Messaging API clients

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)

## Installation

```sh
npm i --save messaging-api-common
```

or

```sh
yarn add messaging-api-common
```

<br />

## Usage

Case Convertors:

```js
const {
  snakecase,
  snakecaseKeys,
  snakecaseKeysDeep,
  camelcase,
  camelcaseKeys,
  camelcaseKeysDeep,
  pascalcase,
  pascalcaseKeys,
  pascalcaseKeysDeep,
} = require('messaging-api-common');

snakecase('fooBar');
//=> 'foo_bar'
snakecaseKeys({ fooBar: true });
//=> { 'foo_bar': true }
snakecaseKeysDeep({ fooBar: { barFoo: true } });
//=> { 'foo_bar': { 'bar_foo': true } }

camelcase('foo_bar');
//=> 'fooBar'
camelcaseKeys({ foo_bar: true });
//=> { 'fooBar': true }
camelcaseKeysDeep({ foo_bar: { bar_foo: true } });
//=> { 'fooBar': { 'barFoo': true } }

pascalcase('fooBar');
//=> 'FooBar'
pascalcaseKeys({ fooBar: true });
//=> { 'FooBar': true }
pascalcaseKeysDeep({ fooBar: { barFoo: true } });
//=> { 'FooBar': { 'BarFoo': true } }
```

Axios Request Interceptors:

```js
const { onRequest, createRequestInterceptor } = require('messaging-api-common');

// use the default onRequest function
axios.interceptors.request.use(createRequestInterceptor());

// use the custom onRequest function
axios.interceptors.request.use(
  createRequestInterceptor({
    onRequest: (request) => {
      console.log(request);
    },
  })
);
```
