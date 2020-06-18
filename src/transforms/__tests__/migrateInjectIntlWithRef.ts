import { defineTest } from 'jscodeshift/dist/testUtils';

describe('migrateInjectIntlWithRef', () => {
  defineTest(
    __dirname,
    'migrateInjectIntlWithRef',
    null,
    'migrateInjectIntlWithRef/migrateInjectIntlWithRef',
  );

  defineTest(
    __dirname,
    'migrateInjectIntlWithRef',
    null,
    'migrateInjectIntlWithRef/noOp',
  );
});
