/**
 * @fileOverview email input
 * @name index.js
 */
import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Input from '../Input';
import { REGEX } from '../../constants';
import { reqCheckDupEmail, reqCheckUserEmail } from '../../utils/api';
import { i18nTxt } from '../../utils';

export default class Email extends Component {
  state = {
    email: '',
    emailErrMsg: '',
    changed: false,
  };

  onEmailChangeDebounced = async e => {
    if (e.target.value === '') return;
    const { userId } = this.props;
    if (!REGEX.EMAIL.test(e.target.value)) {
      this.setState({ emailErrMsg: i18nTxt('Invalid email address') });
      return;
    }

    this.setState({ emailErrMsg: '' });
    const { errorIfIsNotOwner, errorIfRegistered, errorIfNotRegistered, errorIfHalfWayThirdPartyRegisterd } = this.props;
    if (errorIfIsNotOwner) {
      const { result } = await reqCheckUserEmail({ email: e.target.value, userId });
      if (!result.isValid) {
        this.setState({
          emailErrMsg: i18nTxt('Please enter your current email address here'),
        });
        return;
      }
    }

    const { result } = await reqCheckDupEmail({ email: e.target.value, userId });
    if (errorIfHalfWayThirdPartyRegisterd && result.googleAccountUnregisterd) {
      this.setState({
        emailErrMsg: i18nTxt(
          "We detect that you signed up with Google last time and didn't finish the sign up process. Please sign in with Google again."
        ),
      });
      return;
    }

    if (errorIfRegistered && result.isDuplicate) {
      this.setState({
        emailErrMsg: i18nTxt('Already registered , try another one'),
      });
      return;
    }

    if (errorIfNotRegistered && !result.isDuplicate) {
      this.setState({
        emailErrMsg: i18nTxt("This email isn't registered"),
      });
    }
  };

  onEmailChange = async e => {
    this.setState({ email: e.target.value, changed: true });
    const { onChange } = this.props;
    onChange(e);
  };

  hasError = () => {
    const { emailErrMsg } = this.state;
    return !!emailErrMsg.length || this.isEmpty();
  };

  isEmpty = () => {
    const { email, changed } = this.state;
    const { email: defaultEmail } = this.props;
    const isEmpty = (!changed && !defaultEmail.length) || (changed && !email.length);
    if (isEmpty) {
      this.setState({ emailErrMsg: 'Email is empty' });
    }
    return isEmpty;
  };

  render() {
    const { email, emailErrMsg, changed } = this.state;
    const { email: defaultEmail, label, disabled } = this.props;
    return (
      <Wrapper>
        <Input
          label={label || i18nTxt('Email')}
          type="email"
          disabled={disabled}
          autocomplete="email username"
          value={changed ? email : defaultEmail}
          onChange={this.onEmailChange}
          onChangeDebounced={this.onEmailChangeDebounced}
          errMsg={emailErrMsg}
        />
      </Wrapper>
    );
  }
}

Email.defaultProps = {
  email: '',
  userId: '',
  label: '',
  disabled: false,
  errorIfRegistered: false,
  errorIfIsNotOwner: false,
  errorIfNotRegistered: false,
  errorIfHalfWayThirdPartyRegisterd: false,
};

Email.propTypes = {
  errorIfHalfWayThirdPartyRegisterd: PropTypes.bool,
  errorIfNotRegistered: PropTypes.bool,
  errorIfIsNotOwner: PropTypes.bool,
  errorIfRegistered: PropTypes.bool,
  email: PropTypes.string,
  userId: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

const Wrapper = styled.div`
  > div {
    margin: 0 0 12px 0;
  }
`;
