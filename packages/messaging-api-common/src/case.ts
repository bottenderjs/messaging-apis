import mapObject from 'map-obj';
import { camelCase } from 'camel-case';
import { pascalCase } from 'pascal-case';
import { snakeCase } from 'snake-case';
import type {
  CamelCase,
  CamelCasedProperties,
  CamelCasedPropertiesDeep,
  PascalCase,
  PascalCasedProperties,
  PascalCasedPropertiesDeep,
  SnakeCase,
  SnakeCasedProperties,
  SnakeCasedPropertiesDeep,
} from 'type-fest';
import type { Options as MapOptions } from 'map-obj';

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
function snakecase<T extends string>(text: T): SnakeCase<T> {
  const matches = text.match(/\d+/g);
  if (!matches) {
    return snakeCase(text) as SnakeCase<T>;
  }

  let modifiedStr: string = text;
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const mathIndex = modifiedStr.indexOf(match);
    modifiedStr = `${modifiedStr.slice(0, mathIndex)}_${modifiedStr.slice(
      mathIndex,
      modifiedStr.length
    )}`;
  }

  return snakeCase(modifiedStr) as SnakeCase<T>;
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
function snakecaseKeys<T extends PlainObject, O extends MapOptions>(
  obj: T,
  options?: O
): O['deep'] extends true
  ? SnakeCasedPropertiesDeep<T>
  : SnakeCasedProperties<T> {
  return mapObject(
    obj,
    (key, val) => [snakecase(key as string), val],
    options
  ) as O['deep'] extends true
    ? SnakeCasedPropertiesDeep<T>
    : SnakeCasedProperties<T>;
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
function snakecaseKeysDeep<T extends PlainObject>(
  obj: T
): SnakeCasedPropertiesDeep<T> {
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
function camelcase<T extends string>(text: T): CamelCase<T> {
  const parts = text.split('_');
  const modifiedStr = parts.reduce((acc, part) => {
    if (acc === '') return part;
    if (/^\d+/.test(part)) {
      return acc + part;
    }
    return `${acc}_${part}`;
  }, '');
  return camelCase(modifiedStr) as CamelCase<T>;
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
function camelcaseKeys<T extends PlainObject, O extends MapOptions>(
  obj: T,
  options?: O
): O['deep'] extends true
  ? CamelCasedPropertiesDeep<T>
  : CamelCasedProperties<T> {
  return mapObject(
    obj,
    (key, val) => [camelcase(key as string), val],
    options
  ) as O['deep'] extends true
    ? CamelCasedPropertiesDeep<T>
    : CamelCasedProperties<T>;
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
function camelcaseKeysDeep<T extends PlainObject>(
  obj: T
): CamelCasedPropertiesDeep<T> {
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
function pascalcase<T extends string>(str: T): PascalCase<T> {
  return pascalCase(
    isLastCharNumber(str) ? splitLastChar(str) : str
  ) as PascalCase<T>;
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
function pascalcaseKeys<T extends PlainObject, O extends MapOptions>(
  obj: T,
  options?: O
): O['deep'] extends true
  ? PascalCasedPropertiesDeep<T>
  : PascalCasedProperties<T> {
  return mapObject(
    obj,
    (key, val) => [pascalcase(key as string), val],
    options
  ) as O['deep'] extends true
    ? PascalCasedPropertiesDeep<T>
    : PascalCasedProperties<T>;
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
function pascalcaseKeysDeep<T extends PlainObject>(
  obj: T
): PascalCasedPropertiesDeep<T> {
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
