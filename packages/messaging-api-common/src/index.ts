import camelCase from 'camel-case';
import debug from 'debug';
import mapObject from 'map-obj';
import snakeCase from 'snake-case';

const debugRequest = debug('messaging-api-common:request');

function onRequest(request: {
  method: string;
  url: string;
  headers: Record<string, any>;
  body: Record<string, any>;
}): void {
  if (request.body) {
    debugRequest('Outgoing request body:');
    if (Buffer.isBuffer(request.body)) {
      debugRequest(request.body);
    } else {
      debugRequest(JSON.stringify(request.body, null, 2));
    }
  }
}

function isLastCharNumber(key: string) {
  return /^\d$/.test(key[key.length - 1]);
}

function splitLastChar(key: string) {
  return `${key.slice(0, key.length - 1)}_${key.slice(
    key.length - 1,
    key.length
  )}`;
}

function snakecaseKeysDeep(obj: Record<string, any>) {
  return mapObject(
    obj,
    (key, val) => [
      snakeCase(isLastCharNumber(key) ? splitLastChar(key) : key),
      val,
    ],
    { deep: true }
  );
}

function camelcaseKeysDeep(obj: Record<string, any>) {
  return mapObject(
    obj,
    (key, val) => [
      camelCase(isLastCharNumber(key) ? splitLastChar(key) : key),
      val,
    ],
    { deep: true }
  );
}

export { onRequest, snakecaseKeysDeep, camelcaseKeysDeep };
