import MessengerBroadcast from '../MessengerBroadcast';

const { and, or, not } = MessengerBroadcast;

it('#and', () => {
  expect(and('<CUSTOM_LABEL_ID_1>', '<CUSTOM_LABEL_ID_2>')).toEqual({
    operator: 'AND',
    values: ['<CUSTOM_LABEL_ID_1>', '<CUSTOM_LABEL_ID_2>'],
  });
});

it('#or', () => {
  expect(or('<CUSTOM_LABEL_ID_1>', '<CUSTOM_LABEL_ID_2>')).toEqual({
    operator: 'OR',
    values: ['<CUSTOM_LABEL_ID_1>', '<CUSTOM_LABEL_ID_2>'],
  });
});

it('#not', () => {
  expect(not('<CUSTOM_LABEL_ID_1>', '<CUSTOM_LABEL_ID_2>')).toEqual({
    operator: 'NOT',
    values: ['<CUSTOM_LABEL_ID_1>', '<CUSTOM_LABEL_ID_2>'],
  });
});

it('nested predicate', () => {
  expect(
    and(
      '<CUSTOM_LABEL_ID_1>',
      or('<CUSTOM_LABEL_ID_2>', not('<CUSTOM_LABEL_ID_3>'))
    )
  ).toEqual({
    operator: 'AND',
    values: [
      '<CUSTOM_LABEL_ID_1>',
      {
        operator: 'OR',
        values: [
          '<CUSTOM_LABEL_ID_2>',
          {
            operator: 'NOT',
            values: ['<CUSTOM_LABEL_ID_3>'],
          },
        ],
      },
    ],
  });
});
