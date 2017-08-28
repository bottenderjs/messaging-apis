import { SlackWebhookClient, SlackOAuthClient } from '../index';

it('should export api correctly', () => {
  expect(SlackWebhookClient).toBeDefined();
  expect(SlackOAuthClient).toBeDefined();
});
