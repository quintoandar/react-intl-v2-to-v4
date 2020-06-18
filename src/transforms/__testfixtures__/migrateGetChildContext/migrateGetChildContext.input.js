import React from 'react';
import { IntlProvider } from 'react-intl';

const intlProvider = new IntlProvider(
  { locale: 'en', defaultLocale: 'en' },
  {},
);
const { intl } = intlProvider.getChildContext();
