import { defineTest } from 'jscodeshift/dist/testUtils';

describe('migrateIntlShape', () => {
  defineTest(
    __dirname,
    'migrateIntlShape',
    null,
    'migrateIntlShape/migrateIntlShape',
  );

  defineTest(
    __dirname,
    'migrateIntlShape',
    null,
    'migrateIntlShape/removeImport',
  );

  defineTest(
    __dirname,
    'migrateIntlShape',
    null,
    'migrateIntlShape/addPropTypesImport',
  );

  defineTest(
    __dirname,
    'migrateIntlShape',
    null,
    'migrateIntlShape/addPropTypesDefaultImport',
  );

  defineTest(
    __dirname,
    'migrateIntlShape',
    null,
    'migrateIntlShape/noOpNoReactIntl',
  );

  defineTest(
    __dirname,
    'migrateIntlShape',
    null,
    'migrateIntlShape/noOpNoIntlShapeImport',
  );
});
