import { Messenger, MessengerBatch, MessengerBroadcast } from '../browser';

it('should export api correctly', () => {
  expect(Messenger).toBeDefined();
  expect(MessengerBatch).toBeDefined();
  expect(MessengerBroadcast).toBeDefined();
});
