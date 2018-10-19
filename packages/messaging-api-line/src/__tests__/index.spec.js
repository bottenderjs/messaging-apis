import { Line, LineClient, LinePay } from '..';

it('should export api correctly', () => {
  expect(Line).toBeDefined();
  expect(LineClient).toBeDefined();
  expect(LinePay).toBeDefined();
});
