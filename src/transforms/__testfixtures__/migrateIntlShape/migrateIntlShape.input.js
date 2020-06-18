import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

const componentPropTypes = {
  someProp: PropTypes.number.isRequired,
  intl: intlShape,
};
