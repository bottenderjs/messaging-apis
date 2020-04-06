import mapObject from 'map-obj';
import { camelCase } from 'camel-case';
import { pascalCase } from 'pascal-case';
import { snakeCase } from 'snake-case';

function isLastCharNumber(key: string) {
  return /^\d$/.test(key[key.length - 1]);
}

function splitLastChar(key: string) {
  return `${key.slice(0, key.length - 1)}_${key.slice(
    key.length - 1,
    key.length
  )}`;
}

function snakecase(str: string) {
  const matches = str.match(/\d+/g);
  if (!matches) {
    return snakeCase(str);
  }

  let modifiedStr = str;
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const mathIndex = modifiedStr.indexOf(match);
    modifiedStr = `${modifiedStr.slice(0, mathIndex)}_${modifiedStr.slice(
      mathIndex,
      modifiedStr.length
    )}`;
  }

  return snakeCase(modifiedStr);
}

function snakecaseKeys(
  obj: Record<string, any>,
  options: { deep?: boolean } = {}
) {
  return mapObject(obj, (key, val) => [snakecase(key), val], options);
}

function snakecaseKeysDeep(obj: Record<string, any>) {
  return snakecaseKeys(obj, { deep: true });
}

function camelcase(str: string) {
  const parts = str.split('_');
  const modifiedStr = parts.reduce((acc, part) => {
    if (acc === '') return part;
    if (/^\d+/.test(part)) {
      return acc + part;
    }
    return `${acc}_${part}`;
  }, '');
  return camelCase(modifiedStr);
}

function camelcaseKeys(
  obj: Record<string, any>,
  options: { deep?: boolean } = {}
) {
  return mapObject(obj, (key, val) => [camelcase(key), val], options);
}

function camelcaseKeysDeep(obj: Record<string, any>) {
  return camelcaseKeys(obj, { deep: true });
}

function pascalcase(str: string) {
  return pascalCase(isLastCharNumber(str) ? splitLastChar(str) : str);
}

function pascalcaseKeys(
  obj: Record<string, any>,
  options: { deep?: boolean } = {}
) {
  return mapObject(obj, (key, val) => [pascalcase(key), val], options);
}

function pascalcaseKeysDeep(obj: Record<string, any>) {
  return pascalcaseKeys(obj, { deep: true });
}

export {
  snakecase,
  snakecaseKeys,
  snakecaseKeysDeep,
  camelcase,
  camelcaseKeys,
  camelcaseKeysDeep,
  pascalcase,
  pascalcaseKeys,
  pascalcaseKeysDeep,
};
