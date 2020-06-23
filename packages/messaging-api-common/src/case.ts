import mapObject from 'map-obj';
import { camelCase } from 'camel-case';
import { pascalCase } from 'pascal-case';
import { snakeCase } from 'snake-case';
import type { Options } from 'map-obj';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PlainObject = Record<string, any>;

function isLastCharNumber(key: string): boolean {
  return /^\d$/.test(key[key.length - 1]);
}

function splitLastChar(key: string): string {
  return `${key.slice(0, key.length - 1)}_${key.slice(
    key.length - 1,
    key.length
  )}`;
}

/**
 * Converts a string to snake case.
 *
 * @param text - The input string
 * @returns The converted string
 *
 * @example
 * ```js
 * snakecase('fooBar');
 * //=> 'foo_bar'
 * ```
 */
function snakecase(text: string): string {
  const matches = text.match(/\d+/g);
  if (!matches) {
    return snakeCase(text);
  }

  let modifiedStr = text;
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

/**
 * Converts object keys to snake case.
 *
 * @param obj - The input object
 * @param options - The options to config this convert function
 * @returns The converted object
 *
 * @example
 * ```js
 * snakecaseKeys({ 'fooBar': true });
 * //=> { 'foo_bar': true }
 * ```
 */
function snakecaseKeys(obj: PlainObject, options: Options = {}): PlainObject {
  return mapObject(
    obj,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (key: string, val: any) => [snakecase(key), val],
    options
  );
}

/**
 * Converts object keys to snake case deeply.
 *
 * @param obj - The input object
 * @returns The converted object
 *
 * @example
 * ```js
 * snakecaseKeysDeep({ 'fooBar': { 'barFoo': true } });
 * //=> { 'foo_bar': { 'bar_foo': true } }
 * ```
 */
function snakecaseKeysDeep(obj: PlainObject): PlainObject {
  return snakecaseKeys(obj, { deep: true });
}

/**
 * Converts a string to camel case.
 *
 * @param text - The input string
 * @returns The converted string
 *
 * @example
 * ```js
 * camelcase('foo_bar');
 * //=> 'fooBar'
 * ```
 */
function camelcase(text: string): string {
  const parts = text.split('_');
  const modifiedStr = parts.reduce((acc, part) => {
    if (acc === '') return part;
    if (/^\d+/.test(part)) {
      return acc + part;
    }
    return `${acc}_${part}`;
  }, '');
  return camelCase(modifiedStr);
}

/**
 * Converts object keys to camel case.
 *
 * @param obj - The input object
 * @param options - The options to config this convert function
 * @returns The converted object
 *
 * @example
 * ```js
 * camelcaseKeys({ 'foo_bar': true });
 * //=> { 'fooBar': true }
 * ```
 */
function camelcaseKeys(obj: PlainObject, options: Options = {}): PlainObject {
  return mapObject(
    obj,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (key: string, val: any) => [camelcase(key), val],
    options
  );
}

/**
 * Converts object keys to camel case deeply.
 *
 * @param obj - The input object
 * @returns The converted object
 *
 * @example
 * ```js
 * camelcaseKeysDeep({ 'foo_bar': { 'bar_foo': true } });
 * //=> { 'fooBar': { 'barFoo': true } }
 * ```
 */
function camelcaseKeysDeep(obj: PlainObject): PlainObject {
  return camelcaseKeys(obj, { deep: true });
}

/**
 * Converts a string to pascal case.
 *
 * @param text - The input string
 * @returns The converted string
 *
 * @example
 * ```js
 * pascalcase('fooBar');
 * //=> 'FooBar'
 * ```
 */
function pascalcase(str: string): string {
  return pascalCase(isLastCharNumber(str) ? splitLastChar(str) : str);
}

/**
 * Converts object keys to pascal case.
 *
 * @param obj - The input object
 * @param options - The options to config this convert function
 * @returns The converted object
 *
 * @example
 * ```js
 * pascalcaseKeys({ 'fooBar': true });
 * //=> { 'FooBar': true }
 * ```
 */
function pascalcaseKeys(obj: PlainObject, options: Options = {}): PlainObject {
  return mapObject(
    obj,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (key: string, val: any) => [pascalcase(key), val],
    options
  );
}

/**
 * Converts object keys to pascal case deeply.
 *
 * @param obj - The input object
 * @returns The converted object
 *
 * @example
 * ```js
 * pascalcaseKeysDeep({ 'fooBar': { 'barFoo': true } });
 * //=> { 'FooBar': { 'BarFoo': true } }
 * ```
 */
function pascalcaseKeysDeep(obj: PlainObject): PlainObject {
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
