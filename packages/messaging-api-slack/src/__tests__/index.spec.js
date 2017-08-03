import { SlackClient, SlackWebhookClient, SlackOAuthClient } from '../index';

it('should export api correctly', () => {
  expect(SlackClient).toBeDefined();
  expect(SlackWebhookClient).toBeDefined();
  expect(SlackOAuthClient).toBeDefined();
});
