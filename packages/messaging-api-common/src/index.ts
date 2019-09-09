import debug from 'debug';

const debugRequest = debug('messaging-api-common:request');

function onRequest(request: {
  method: string;
  url: string;
  headers: Record<string, any>;
  body: Record<string, any>;
}): void {
  if (request.body) {
    debugRequest('Outgoing request body:');
    debugRequest(JSON.stringify(request.body, null, 2));
  }
}

export { onRequest };
