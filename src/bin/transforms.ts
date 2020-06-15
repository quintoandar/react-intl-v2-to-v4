// TODO: type transform names
const TRANSFORM_INQUIRER_CHOICES = [
  {
    name: 'Migrate intlShape prop type',
    value: 'migrateIntlShape',
  },
  {
    name: 'Migrate intlProvider.getChildContext()',
    value: 'migrateGetChildContext',
  },
  {
    name: 'Migrate injectIntl withRef option',
    value: 'migrateInjectIntlWithRef',
  },
  {
    name: 'Migrate injectIntl HOC to useIntl hook',
    value: 'migrateInjectIntlToUseIntlHook',
  },
];

export { TRANSFORM_INQUIRER_CHOICES };
