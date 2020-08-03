import {
  FacebookUserClient,
  Messenger,
  MessengerBatch,
  MessengerClient,
} from '..';

it('should export api correctly', () => {
  expect(Messenger).toBeDefined();
  expect(MessengerBatch).toBeDefined();
  expect(MessengerClient).toBeDefined();
  expect(FacebookUserClient).toBeDefined();
});
