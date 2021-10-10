import { SetupServerApi, setupServer } from 'msw/node';

export function setupLineServer(): SetupServerApi {
  const lineServer = setupServer();
  if (typeof beforeAll === 'function') {
    beforeAll(() => {
      // Establish requests interception layer before all tests.
      lineServer.listen();
    });
  }

  afterEach(() => {
    // Reset any runtime handlers tests may use.
    lineServer.resetHandlers();
  });
  afterAll(() => {
    // Clean up after all tests are done, preventing this
    // interception layer from affecting irrelevant tests.
    lineServer.close();
  });

  return lineServer;
}
