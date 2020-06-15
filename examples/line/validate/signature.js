/*
 * ref: https://github.com/line/line-bot-sdk-nodejs/blob/master/lib/validate-signature.ts
 */

const { createHmac, timingSafeEqual } = require('crypto');

function s2b(str, encoding) {
  if (Buffer.from) {
    try {
      return Buffer.from(str, encoding);
    } catch (err) {
      if (err.name === 'TypeError') {
        return Buffer.from(str, encoding);
      }
      throw err;
    }
  } else {
    return Buffer.from(str, encoding);
  }
}

function safeCompare(a, b) {
  if (a.length !== b.length) {
    return false;
  }

  if (timingSafeEqual) {
    return timingSafeEqual(a, b);
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i]; /* eslint no-bitwise: 0 */
  }
  return result === 0;
}

function validateSignature(body, channelSecret, signature) {
  return safeCompare(
    createHmac('SHA256', channelSecret).update(body).digest(),
    s2b(signature, 'base64')
  );
}

module.exports = validateSignature;
