import {
  Messenger,
  MessengerBatch,
  MessengerBroadcast,
  MessengerClient,
} from '..';

it('should export api correctly', () => {
  expect(Messenger).toBeDefined();
  expect(MessengerBatch).toBeDefined();
  expect(MessengerClient).toBeDefined();
  expect(MessengerBroadcast).toBeDefined();
});
