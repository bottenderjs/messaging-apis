import { SlackOAuthClient, SlackWebhookClient } from '..';

it('should export api correctly', () => {
  expect(SlackWebhookClient).toBeDefined();
  expect(SlackOAuthClient).toBeDefined();
});
