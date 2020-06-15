import { BatchRequestError, FacebookBatchQueue, isError613 } from '..';

it('FacebookBatchQueue should be exported', () => {
  expect(FacebookBatchQueue).toBeDefined();
});

it('BatchRequestError should be exported', () => {
  expect(BatchRequestError).toBeDefined();
});

it('error predicate should be exported', () => {
  expect(isError613).toBeDefined();
});
