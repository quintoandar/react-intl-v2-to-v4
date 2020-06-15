import { defineTest } from 'jscodeshift/dist/testUtils';

describe('migrateInjectIntlToUseIntlHook', () => {
  defineTest(
    __dirname,
    'migrateInjectIntlToUseIntlHook',
    null,
    'migrateInjectIntlToUseIntlHook/migrateInjectIntlToUseIntlHook',
  );

  defineTest(
    __dirname,
    'migrateInjectIntlToUseIntlHook',
    null,
    'migrateInjectIntlToUseIntlHook/noOp',
  );
});
