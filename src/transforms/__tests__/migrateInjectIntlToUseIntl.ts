import { defineTest } from 'jscodeshift/dist/testUtils';

describe('migrateInjectIntlToUseIntl', () => {
  defineTest(
    __dirname,
    'migrateInjectIntlToUseIntl',
    null,
    'migrateInjectIntlToUseIntl/migrateInjectIntlToUseIntl',
  );

  defineTest(
    __dirname,
    'migrateInjectIntlToUseIntl',
    null,
    'migrateInjectIntlToUseIntl/noOp',
  );
});
