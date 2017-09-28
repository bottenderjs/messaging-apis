const { raw } = require('body-parser');

const validateSignature = require('../validate/signature');

const isString = str => typeof str === 'string';

const verifyMiddleware = config => (req, res, next) => {
  const signature = req.headers['x-line-signature'];
  const { channelSecret } = config;

  if (!signature || !isString(signature)) {
    res.status(401);
  } else {
    const validate = bodybuffer => {
      if (validateSignature(bodybuffer, channelSecret, signature)) {
        req.body = JSON.parse(bodybuffer);
        next();
      } else {
        throw new Error('Signature Failed.');
      }
    };
    if (typeof req.body === 'string' || Buffer.isBuffer(req.body)) {
      validate(req.body);
    } else {
      raw({ type: '*/*' })(req, res, () => validate(req.body));
    }
  }
};

module.exports = verifyMiddleware;
