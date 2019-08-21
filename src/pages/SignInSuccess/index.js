/**
 * @fileOverview redirect to here when user successfully login
 * @name index.js
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { auth } from '../../utils';

class SignInSuccess extends Component {
  constructor(...args) {
    super(...args);
    const {
      history: {
        replace,
        location: { search },
      },
    } = this.props;

    if (search.includes('?access_token=')) {
      const token = search.slice('?access_token='.length);
      auth.setToken(token);
      replace('/');
    } else if (auth.loggedIn()) {
      replace('/');
    } else {
      replace('/signin', { signinFailed: true });
    }
  }

  componentDidMount() {
    document.title = 'Sign In Success';
  }

  render() {
    return <div></div>;
  }
}

SignInSuccess.defaultProps = {
  history: {},
};

SignInSuccess.propTypes = {
  /* eslint react/forbid-prop-types: 0 */
  history: PropTypes.object,
};

export default SignInSuccess;
