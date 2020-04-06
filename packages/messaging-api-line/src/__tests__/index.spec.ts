import { Line, LineClient, LineNotify, LinePay } from '..';

it('should export api correctly', () => {
  expect(Line).toBeDefined();
  expect(LineClient).toBeDefined();
  expect(LinePay).toBeDefined();
  expect(LineNotify).toBeDefined();
});
