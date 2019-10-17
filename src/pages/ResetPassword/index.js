/**
 * @fileOverview reset password page
 * @name index.js
 */

import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { StyledWrapper } from '../../globalStyles/common';
import { reqUserUpdate } from '../../utils/api';
// import { notice } from '../../components/Message/notice';
import Email from '../../components/Email';
import EmailCode from '../../components/EmailCode';
import Password from '../../components/Password';
import SignInVia from '../../components/SignInVia';
import { i18nTxt } from '../../utils';
import media from '../../globalStyles/media';
import unitParser from '../../utils/device';

class ResetPassword extends Component {
  state = { email: '', password: '', emailCode: '' };

  componentDidMount() {
    document.title = i18nTxt('Reset Password');
  }

  onEmailChange = async e => {
    this.setState({ email: e.target.value });
  };

  onPasswordChange = async e => {
    this.setState({ password: e.target.value });
  };

  onEmailCodeChange = async e => {
    this.setState({ emailCode: e.target.value });
  };

  onSetUpClick = async () => {
    const { email, password, emailCode } = this.state;

    const { code } = await reqUserUpdate({
      email,
      password,
      emailVerificationCode: emailCode.toUpperCase(),
    });

    if (code !== 0) {
      // notice.show({
      //   content: 'Validation failed. Please check your email code',
      //   type: 'message-error',
      //   timeout: 3000,
      // });
      return;
    }

    const { history } = this.props;
    history.push('/signin', { passwordReset: true });
  };

  render() {
    const { email } = this.state;
    return (
      <Fragment>
        <Wrapper>
          <div className="signup">
            <form className="form-wrap">
              <span className="title"> {i18nTxt('RESET PASSWORD')}</span>
              <div className="inputs-wrap">
                <Email
                  checkIsRegistered
                  onChange={this.onEmailChange}
                  ref={ref => {
                    this.emailRef = ref;
                  }}
                />
                <Password
                  hasRepeat
                  labels={[i18nTxt('New Password'), i18nTxt('Confirm New Password')]}
                  onChange={this.onPasswordChange}
                  ref={ref => {
                    this.passwordRef = ref;
                  }}
                />
                <EmailCode
                  email={email}
                  onChange={this.onEmailCodeChange}
                  ref={ref => {
                    this.emailCodeRef = ref;
                  }}
                />
              </div>
              <div className="btn-wrap-signup">
                <button className="btn waves-effect waves-light primary" type="button" onClick={this.onSetUpClick}>
                  {i18nTxt('SETUP')}
                </button>
                <Link className="primary signin-link" to="/signin">
                  {i18nTxt('SIGN IN')}
                </Link>
                <SignInVia />
              </div>
            </form>
          </div>
        </Wrapper>
      </Fragment>
    );
  }
}

ResetPassword.defaultProps = {
  history: {},
};

ResetPassword.propTypes = {
  /* eslint react/forbid-prop-types: 0 */
  history: PropTypes.object,
};

export default ResetPassword;

const Wrapper = styled(StyledWrapper)`
  padding: 40px;
  ${media.mobile`
    padding: ${unitParser(20)} ${unitParser(12)};
  `}
  .title {
    font-size: 32px;
    line-height: 32px;
    font-weight: 600;
    ${media.mobile`
      font-size: ${unitParser(24)};
      line-height: ${unitParser(24)};
    `}
  }
  .form-wrap {
    text-align: center;
    margin: 0 80px;
    ${media.mobile`
      margin: 0;
      text-align: left;
    `}
  }
  .signup-input {
    color: #8e9394;
  }
  .inputs-wrap {
    margin-top: 40px;
  }
  .terms-wrap {
    text-align: left;
    margin: 20px 0 21px;
  }
  .btn-wrap-signup {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
  }
  .signin-link {
    text-decoration: none;
    cursor: pointer;
    font-weight: 600;
    font-size: 16px;
    line-height: 16px;
    text-transform: uppercase;
    margin-top: 20px;
    ${media.mobile`
      text-align: center;
    `}
  }
`;
