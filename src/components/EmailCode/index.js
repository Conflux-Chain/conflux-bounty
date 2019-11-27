/**
 * @fileOverview email code input with send btn
 * @name index.js
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { notice } from '../Message/notice';
import Input from '../Input';
import { REGEX } from '../../constants';
import { reqSendVerificationEmail } from '../../utils/api';
import { i18nTxt } from '../../utils';
import media from '../../globalStyles/media';
import unitParser from '../../utils/device';

class EmailCode extends Component {
  state = {
    emailCode: '',
    emailCodeErrMsg: '',
    sendButtonWaitSeconds: 0,
    disabled: false,
  };

  componentWillUnmount() {
    if (this.sendButtonCountDownInterval) {
      clearInterval(this.sendButtonCountDownInterval);
    }
  }

  onSendClick = async () => {
    const { email, verificationCodeType, beforeSend, lang } = this.props;
    if (!email || email === '' || !REGEX.EMAIL.test(email)) {
      notice.show({ content: i18nTxt('Invalid email address'), type: 'message-error', timeout: 3000 });
      return;
    }

    if (beforeSend && typeof beforeSend.validator === 'function' && !beforeSend.validator()) {
      notice.show({ content: beforeSend.errorMessage || i18nTxt('Invalid email address'), type: 'message-error', timeout: 3000 });
      return;
    }

    const {
      code,
      result: { waitSecondsTillNextSend },
    } = await reqSendVerificationEmail({ email, language: lang, type: verificationCodeType });

    if (code !== 0) {
      return;
    }
    notice.show({ content: i18nTxt('Email Sent'), type: 'message-success', timeout: 5000 });

    this.setState({ sendButtonWaitSeconds: waitSecondsTillNextSend });
    if (this.sendButtonCountDownInterval) {
      clearInterval(this.sendButtonCountDownInterval);
    }

    this.sendButtonCountDownInterval = setInterval(() => {
      this.setState(oldState => {
        if (oldState.sendButtonWaitSeconds === 1) clearInterval(this.sendButtonCountDownInterval);
        return { sendButtonWaitSeconds: oldState.sendButtonWaitSeconds - 1 };
      });
    }, 1000);
  };

  onEmailCodeChangeDebounced = async e => {
    if (e.target.value === '') return;
    if (!REGEX.EMAIL_CODE.test(e.target.value)) {
      this.setState({
        emailCodeErrMsg: i18nTxt('Invalid verification code'),
      });
      return;
    }

    this.setState({ emailCodeErrMsg: '' });
  };

  onEmailCodeChange = async e => {
    this.setState({ emailCode: e.target.value.toUpperCase() });
    const { onChange } = this.props;
    onChange({ target: { value: e.target.value.trim().toUpperCase() } });
  };

  hasError = () => {
    const { emailCodeErrMsg } = this.state;
    const hasError = !!emailCodeErrMsg.length || this.isEmpty();
    return hasError;
  };

  isEmpty = () => {
    const { emailCode } = this.state;
    if (!emailCode.length) {
      this.setState({ emailCodeErrMsg: i18nTxt('Email code is empty') });
    }
    return !emailCode.length;
  };

  render() {
    const { disabled, emailCode, emailCodeErrMsg, sendButtonWaitSeconds } = this.state;
    return (
      <Wrapper>
        <div className="email-code-wrap">
          <Input
            className="email-code-input"
            label={i18nTxt('Email Code')}
            type="text"
            autocomplete="one-time-code"
            value={emailCode}
            onChange={this.onEmailCodeChange}
            onChangeDebounced={this.onEmailCodeChangeDebounced}
            errMsg={emailCodeErrMsg}
          />
          <button
            className="btn default email-code-btn"
            type="button"
            disabled={disabled || sendButtonWaitSeconds}
            onClick={this.onSendClick}
          >
            {sendButtonWaitSeconds ? `${sendButtonWaitSeconds} ${i18nTxt('S')}` : i18nTxt('SEND')}
          </button>
        </div>
      </Wrapper>
    );
  }
}

EmailCode.defaultProps = {
  verificationCodeType: undefined,
  email: undefined,
  beforeSend: undefined,
};

EmailCode.propTypes = {
  beforeSend: PropTypes.objectOf({ validator: PropTypes.func.isRequired, errorMessage: PropTypes.string }),
  onChange: PropTypes.func.isRequired,
  email: PropTypes.string,
  lang: PropTypes.string.isRequired,
  verificationCodeType: PropTypes.string,
};

function mapStateToProps(state) {
  const {
    common: { lang },
  } = state;
  return { lang };
}

const Wrapper = styled.div`
  > div {
    margin: 0 0 12px 0;
  }
  .email-code-wrap {
    display: flex;
    justify-content: center;
    .email-code-input {
      margin: 0 10px 0 0;
      flex-grow: 1;
    }
    input {
      text-transform: uppercase;
    }
    .email-code-btn {
      ${media.mobile`
height: ${unitParser(44)};
font-size: ${unitParser(14)};
`}
      flex-grow: 0;
      height: 56px;
      min-width: 74px;
    }
  }
`;

export default connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true }
)(EmailCode);
