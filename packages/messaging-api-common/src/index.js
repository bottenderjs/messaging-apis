import debug from 'debug';

const debugRequest = debug('messaging-api-common:request');

function onRequest(request: any): void {
  debugRequest(`${request.method} ${request.url}`);
  if (request.body) {
    debugRequest('Outgoing request body:');
    debugRequest(JSON.stringify(request.body, null, 2));
  }
}

export { onRequest };
