/**
 * @fileOverview tests of input component
 * @name index.test.js
 */

import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import Input from '..';

describe('<Input />', () => {
  it('should render the input element with the right label text', () => {
    const { getByLabelText } = render(
      <IntlProvider locale="en">
        {/* eslint-disable-next-line no-console */}
        <Input id="test-input" label="test-label" onChange={console.log} value="" />
      </IntlProvider>
    );
    expect(getByLabelText(/test-label/)).not.toBeNull();
  });
});
