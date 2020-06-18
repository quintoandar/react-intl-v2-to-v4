import React from 'react';
import { injectIntl } from 'react-intl';

const Component = () => <div />;

export default injectIntl(Component, { forwardRef: true });
