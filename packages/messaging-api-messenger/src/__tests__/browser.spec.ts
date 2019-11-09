import { Messenger, MessengerBatch } from '../browser';

it('should export api correctly', () => {
  expect(Messenger).toBeDefined();
  expect(MessengerBatch).toBeDefined();
});
