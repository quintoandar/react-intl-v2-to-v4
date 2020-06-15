import React from 'react';
import { createIntl, createIntlCache } from 'react-intl';

const intlCache = createIntlCache();
const intl = createIntl({
  locale: 'en-US',
  defaultLocale: 'en-US',
}, intlCache);
