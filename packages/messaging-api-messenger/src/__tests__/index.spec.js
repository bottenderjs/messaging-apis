import {
  Messenger,
  MessengerBatch,
  MessengerClient,
  MessengerBroadcast,
} from '..';

it('should export api correctly', () => {
  expect(Messenger).toBeDefined();
  expect(MessengerBatch).toBeDefined();
  expect(MessengerClient).toBeDefined();
  expect(MessengerBroadcast).toBeDefined();
});
