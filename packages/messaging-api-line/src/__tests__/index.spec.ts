import { Line, LineClient, LineNotify } from '..';

it('should export api correctly', () => {
  expect(Line).toBeDefined();
  expect(LineClient).toBeDefined();
  expect(LineNotify).toBeDefined();
});
