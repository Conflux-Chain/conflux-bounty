/**
 * @fileOverview sign in page
 * @name index.js
 */

import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// import ReCAPTCHA from '../../components/ReCAPTCHA';
import { StyledWrapper } from '../../globalStyles/common';
import Input from '../../components/Input';
import { sendRequest, auth, i18nTxt } from '../../utils';
import { notice } from '../../components/Message/notice';
import { getAccount } from '../../components/PageHead/action';
import SignInVia from '../../components/SignInVia';
// import { recaptchaKey } from '../../constants';

export const getRecaptchaErr = (errCodes = []) => {
  const reContains = a => {
    return errCodes.indexOf(a) !== -1;
  };
  let noticeMsg = '';
  if (reContains('missing-input-secret') || reContains('invalid-input-secret')) {
    noticeMsg = i18nTxt('invalid recaptcha secret');
  } else if (reContains('missing-input-response') || reContains('invalid-input-response')) {
    noticeMsg = i18nTxt('invalid recaptcha secret');
  } else if (reContains('timeout-or-duplicate')) {
    noticeMsg = i18nTxt('recaptcha check timeout, please reload page');
  } else if (reContains('bad-request')) {
    noticeMsg = i18nTxt('invalid recaptcha request');
  }
  return noticeMsg;
};

class SignIn extends Component {
  constructor(...args) {
    super(...args);
    const { email = localStorage.getItem('BOUNTY_USER_EMAIL'), history } = this.props;

    if (auth.loggedIn()) {
      history.replace('/');
    }
    this.state = {
      rememberUsernameChecked: !!localStorage.getItem('BOUNTY_USER_EMAIL'),
      inputsValue: {
        email,
        password: '',
        recaptchaVal: '',
      },
      // showHalfExtend: false,
    };
  }

  async componentDidMount() {
    document.title = 'Sign In';
    const { history } = this.props;
    if (history.action === 'PUSH' && history.location.state) {
      if (history.location.state.signupSuccess) {
        notice.show({ content: i18nTxt('Account Created'), type: 'message-success', timeout: 3000 });
      } else if (history.location.state.passwordReset) {
        notice.show({ content: i18nTxt('Password Reset'), type: 'message-success', timeout: 3000 });
      } else if (history.location.state.signinFailed) {
        notice.show({ content: i18nTxt('Failed to signin'), type: 'message-error', timeout: 3000 });
      }
    }
  }

  onEmailChange = async e => {
    const { inputsValue } = this.state;
    this.setState({ inputsValue: { ...inputsValue, email: e.target.value } });
  };

  onPasswordChange = async e => {
    const { inputsValue } = this.state;
    this.setState({ inputsValue: { ...inputsValue, password: e.target.value } });
  };

  onSigninClick = async () => {
    const {
      inputsValue: { email, password, recaptchaVal },
      rememberUsernameChecked,
    } = this.state;

    const {
      body: { code, result },
    } = await sendRequest({
      url: '/user/login',
      body: { email, password, recaptchaVal },
      manualNotice: true,
    });

    if (code !== 0) {
      if (result.recaptcha && result.recaptcha.success !== true) {
        notice.show({
          content: getRecaptchaErr(result.recaptcha['error-codes']),
          type: 'message-error',
          timeout: 3000,
        });
      } else {
        notice.show({
          content: i18nTxt('Login failed. Check your username or password.'),
          type: 'message-error',
          timeout: 3000,
        });
      }
      return;
    }

    auth.setToken(result.accessToken);

    if (rememberUsernameChecked) localStorage.setItem('BOUNTY_USER_EMAIL', email);
    else localStorage.removeItem('BOUNTY_USER_EMAIL');

    const { history, dispatch } = this.props;
    dispatch(getAccount());
    history.push('/user-info');
  };

  render() {
    const {
      rememberUsernameChecked,
      inputsValue: { email, password },
      // showHalfExtend,
    } = this.state;
    return (
      <Fragment>
        <Wrapper>
          <div className="signup">
            <form className="form-wrap">
              <span className="title">{i18nTxt('Sign in')}</span>
              <div className="inputs-wrap">
                <Input
                  id="signup-email"
                  label={i18nTxt('Email')}
                  type="email"
                  autocomplete="email username"
                  className="signup-input"
                  value={email}
                  onChange={this.onEmailChange}
                />
                <Input
                  className="signup-input"
                  id="signup-password"
                  label={i18nTxt('Password')}
                  type="password"
                  autocomplete="new-password"
                  value={password}
                  onChange={this.onPasswordChange}
                  onKeyPress={e => {
                    if (e.which === 13) {
                      e.preventDefault();
                      this.onSigninClick();
                    }
                  }}
                />
                {/* <RecaptchaWrapDiv>
                  <ReCAPTCHA
                    sitekey={recaptchaKey}
                    onChange={val => {
                      const { inputsValue } = this.state;
                      this.setState({ inputsValue: { ...inputsValue, recaptchaVal: val } });
                    }}
                    asyncScriptOnLoad={() => {
                      setTimeout(() => {
                        this.setState({
                          showHalfExtend: true,
                        });
                      }, 400);
                    }}
                  />
                  <i className={showHalfExtend ? 'extend-icon-full' : 'extend-icon-default'}></i>
                </RecaptchaWrapDiv> */}
              </div>
              <div className="btn-wrap-signup">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    className="filled-in"
                    checked={rememberUsernameChecked}
                    onChange={e => {
                      this.setState({ rememberUsernameChecked: e.target.checked });
                    }}
                  />
                  <span> {i18nTxt('Remember me')}</span>
                </label>
                <button className="btn waves-effect waves-light primary" type="button" onClick={this.onSigninClick}>
                  {i18nTxt('SIGN IN')}
                </button>
                <div className="link-wrap">
                  <Link className="primary reset-password-link" to="/reset-password">
                    {i18nTxt('RESET PASSWORD')}
                  </Link>
                  <Link className="primary signup-link" to="/signup">
                    {i18nTxt('CREATE ACCOUNT')}
                  </Link>
                </div>
                <SignInVia />
              </div>
            </form>
          </div>
        </Wrapper>
      </Fragment>
    );
  }
}

SignIn.defaultProps = {
  history: {},
};

SignIn.propTypes = {
  /* eslint react/forbid-prop-types: 0 */
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object,
  email: PropTypes.string.isRequired,
};

export default connect()(SignIn);

const Wrapper = styled(StyledWrapper)`
  padding: 40px;
  .title {
    font-size: 32px;
    line-height: 32px;
  }
  .form-wrap {
    text-align: center;
    margin: 0 80px;
  }
  .signup-input {
    height: 56px;
    margin: 12px 0 0;
    color: #8e9394;
  }
  .inputs-wrap {
    margin-top: 40px;
  }
  .btn-wrap-signup {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
  }
  .reset-password-link {
    text-decoration: none;
    cursor: pointer;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 16px;
    text-transform: uppercase;
  }
  .signup-link {
    text-decoration: none;
    cursor: pointer;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 16px;
    text-transform: uppercase;
  }
  .link-wrap {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    width: 100%;
  }
  .remember-me {
    margin-bottom: 9px;
    align-self: self-start;
    .span {
      font-size: 14px;
      line-height: 14px;
      color: #595f61;
    }
  }
`;

export const RecaptchaWrapDiv = styled.div`
  position: relative;
  margin-top: 15px;
  .extend-icon-full {
    position: absolute;
    right: 0;
    top: 0;
    height: calc(100% - 2px);
    width: 50%;
    border: 1px solid #d3d3d3;
    border-left: none;
    background: #f9f9f9;
    pointer-events: none;
    border-radius: 3px;
  }
  .extend-icon-default {
    position: absolute;
    right: 0;
    top: 0;
    height: calc(100% - 2px);
    width: 100%;
    border: 1px solid #d3d3d3;
    background: #f9f9f9;
    pointer-events: none;
    border-radius: 3px;
  }
`;
