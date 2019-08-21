/**
 * @fileOverview password input
 * @name index.js
 */

import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { REGEX } from '../../constants';
import Input from '../Input';
import { i18nTxt } from '../../utils';

export default class Password extends Component {
  state = {
    password: '',
    passwordErrMsg: '',
    repeatPassword: '',
    repeatPasswordErrMsg: '',
  };

  onPasswordChangeDebounced = async e => {
    if (e.target.value === '') return;

    if (e.target.value.length < 6) {
      this.setState({
        passwordErrMsg: i18nTxt('Invalid password. At least 6 character'),
      });
    } else if (!REGEX.PASSWORD.test(e.target.value)) {
      this.setState({
        passwordErrMsg: i18nTxt('Invalid password. Contains special characters like backslash or space'),
      });
    } else {
      this.setState({ passwordErrMsg: '' });
    }

    this.onRepeatPasswordChangeDebounced(null, e);
  };

  onPasswordChange = async e => {
    this.setState({ password: e.target.value });
    const { onChange } = this.props;
    onChange(e);
  };

  onRepeatPasswordChangeDebounced = (e, passwordChangedEvent) => {
    if (e && e.target.value === '') return;
    const { password, repeatPassword } = this.state;
    if (repeatPassword === '') return;

    if ((e && e.target.value !== password) || (passwordChangedEvent && passwordChangedEvent.target.value !== repeatPassword)) {
      this.setState({
        repeatPasswordErrMsg: i18nTxt('Invalid password, not same with the first one'),
      });
    } else {
      this.setState({ repeatPasswordErrMsg: '' });
    }
  };

  onRepeatPasswordChange = async e => {
    this.setState({ repeatPassword: e.target.value });
  };

  hasError = () => {
    const { hasRepeat } = this.props;
    const { passwordErrMsg, repeatPasswordErrMsg } = this.state;
    return !!passwordErrMsg.length || (hasRepeat && !!repeatPasswordErrMsg.length) || this.isEmpty();
  };

  isEmpty = () => {
    const { password, repeatPassword } = this.state;
    const { hasRepeat } = this.props;
    if (!password.length) {
      this.setState({ passwordErrMsg: i18nTxt('Password is empty') });
    }
    if (!repeatPassword.length) {
      this.setState({ repeatPasswordErrMsg: i18nTxt('Password is empty') });
    }
    return !password.length || (hasRepeat && !repeatPassword.length);
  };

  render() {
    const { password, repeatPassword, passwordErrMsg, repeatPasswordErrMsg } = this.state;
    const { hasRepeat, labels = [] } = this.props;
    const inputs = [
      <Input
        label={labels[0] || i18nTxt('Password')}
        type="password"
        autocomplete="new-password"
        value={password}
        onChange={this.onPasswordChange}
        onChangeDebounced={this.onPasswordChangeDebounced}
        errMsg={passwordErrMsg}
      />,
    ];
    if (hasRepeat) {
      inputs.push(
        <Input
          label={labels[1] || i18nTxt('Repeat Password')}
          type="password"
          autocomplete="new-password"
          value={repeatPassword}
          onChange={this.onRepeatPasswordChange}
          onChangeDebounced={this.onRepeatPasswordChangeDebounced}
          errMsg={repeatPasswordErrMsg}
        />
      );
    }
    return <Wrapper>{inputs}</Wrapper>;
  }
}

Password.defaultProps = {
  hasRepeat: false,
  labels: [],
};

Password.propTypes = {
  hasRepeat: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  labels: PropTypes.arrayOf(PropTypes.string.isRequired),
};

const Wrapper = styled.div`
  > div {
    margin: 0 0 4px 0;
  }
`;
