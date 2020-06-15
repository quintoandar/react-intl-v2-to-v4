import { defineTest } from 'jscodeshift/dist/testUtils';

describe('migrateGetChildContext', () => {
  defineTest(
    __dirname,
    'migrateGetChildContext',
    null,
    'migrateGetChildContext/migrateGetChildContext',
  );

  defineTest(
    __dirname,
    'migrateGetChildContext',
    null,
    'migrateGetChildContext/noOp',
  );
});
