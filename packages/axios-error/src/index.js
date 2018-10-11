import util from 'util';

function indent(str) {
  return str
    .split('\n')
    .map(s => (s ? `  ${s}` : ''))
    .join('\n');
}

function json(data) {
  return JSON.stringify(data, null, 2);
}

module.exports = class AxiosError extends Error {
  constructor(messageOrErr, _err = {}) {
    let err;
    if (messageOrErr instanceof Error) {
      super(messageOrErr.message);
      err = messageOrErr;
    } else {
      super(messageOrErr);
      err = _err;
    }
    const { config, request, response } = err;

    this.config = config;
    this.request = request;
    this.response = response;
    if (response && response.status) {
      this.status = response.status;
    }
  }

  // TODO: remove inspect until we drop node < 6.6
  inspect(...args) {
    return this[util.inspect.custom](...args);
  }

  [util.inspect.custom]() {
    let requestMessage = '';

    if (this.config) {
      let { data } = this.config;

      try {
        data = JSON.parse(data);
      } catch (_) {} // eslint-disable-line

      let requestData = '';

      if (this.config.data) {
        requestData = `
Request Data -
${indent(json(data))}`;
      }

      requestMessage = `
Request -
  ${this.config.method.toUpperCase()} ${this.config.url}
${requestData}`;
    }

    let responseMessage = '';

    if (this.response) {
      let responseData;

      if (this.response.data) {
        responseData = `
Response Data -
${indent(json(this.response.data))}`;
      }

      responseMessage = `
Response -
  ${this.response.status} ${this.response.statusText}
${responseData}`;
    }

    return `
${this.stack}

Error Message -
  ${this.message}
${requestMessage}
${responseMessage}
`;
  }
};
