import {
  camelcase,
  camelcaseKeys,
  camelcaseKeysDeep,
  pascalcase,
  pascalcaseKeys,
  pascalcaseKeysDeep,
  snakecase,
  snakecaseKeys,
  snakecaseKeysDeep,
} from '../case';

it('snakecase', () => {
  expect(snakecase('myKey')).toEqual('my_key');
  expect(snakecase('has2fa')).toEqual('has_2fa');
  expect(snakecase('image1024')).toEqual('image_1024');
});

it('snakecaseKeys', () => {
  expect(snakecaseKeys({ myKey: 'value' })).toEqual({
    my_key: 'value',
  });
  expect(snakecaseKeys({ myObj: { myKey: 'value' } }, { deep: false })).toEqual(
    {
      my_obj: { myKey: 'value' },
    }
  );
  expect(snakecaseKeys({ myObj: { myKey: 'value' } }, { deep: true })).toEqual({
    my_obj: { my_key: 'value' },
  });
});

it('snakecaseKeysDeep', () => {
  expect(snakecaseKeysDeep({ myObj: { myKey: 'value' } })).toEqual({
    my_obj: { my_key: 'value' },
  });
});

it('camelcase', () => {
  expect(camelcase('my_key')).toEqual('myKey');
  expect(camelcase('has_2fa')).toEqual('has2fa');
  expect(camelcase('image_1024')).toEqual('image1024');
});

it('camelcaseKeys', () => {
  expect(camelcaseKeys({ my_key: 'value' })).toEqual({
    myKey: 'value',
  });
  expect(
    camelcaseKeys({ my_obj: { my_key: 'value' } }, { deep: false })
  ).toEqual({
    myObj: { my_key: 'value' },
  });
  expect(
    camelcaseKeys({ my_obj: { my_key: 'value' } }, { deep: true })
  ).toEqual({
    myObj: { myKey: 'value' },
  });
});

it('camelcaseKeysDeep', () => {
  expect(camelcaseKeysDeep({ my_obj: { my_key: 'value' } })).toEqual({
    myObj: { myKey: 'value' },
  });
});

it('pascalcase', () => {
  expect(pascalcase('myKey')).toEqual('MyKey');
});

it('pascalcaseKeys', () => {
  expect(pascalcaseKeys({ myKey: 'value' })).toEqual({
    MyKey: 'value',
  });
  expect(
    pascalcaseKeys({ myObj: { myKey: 'value' } }, { deep: false })
  ).toEqual({
    MyObj: { myKey: 'value' },
  });
  expect(pascalcaseKeys({ myObj: { myKey: 'value' } }, { deep: true })).toEqual(
    {
      MyObj: { MyKey: 'value' },
    }
  );
});

it('pascalcaseKeysDeep', () => {
  expect(pascalcaseKeysDeep({ myObj: { myKey: 'value' } })).toEqual({
    MyObj: { MyKey: 'value' },
  });
});
