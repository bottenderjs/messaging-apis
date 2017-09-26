const { raw } = require('body-parser')
const validateSignature = require('../validate/signature')

const isString = str => (typeof str) === 'string';

const verifyMiddleware = (config) =>
  (req, res, next) => {
    const signature = req.headers['x-line-signature'];
    const channelSecret = config.channelSecret;

    if (!signature || !isString(signature)) {
      return res.status(401);
    }

    const validate = (bodybuffer) => {
      if (validateSignature(bodybuffer, channelSecret, signature)) {
        req.body = JSON.parse(bodybuffer);
        next();
      } else {
        throw new Error('Signature Failed.')
      }
    }

    if (typeof req.body === "string" || Buffer.isBuffer(req.body)) {
      return validate(req.body);
    }

    raw({ type: "*/*" })(req, res, () => validate(req.body));
  }

module.exports = verifyMiddleware
