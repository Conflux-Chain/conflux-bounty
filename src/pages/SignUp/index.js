/**
 * @fileOverview sign up page
 * @name index.js
 */

import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ReCAPTCHA from '../../components/ReCAPTCHA';
import { StyledWrapper } from '../../globalStyles/common';
import { reqUserSignup, reqUserQuery } from '../../utils/api';
import { auth, commonPropTypes, i18nTxt, getRecaptchaErr } from '../../utils';
import EmailCode from '../../components/EmailCode';
import Email from '../../components/Email';
import Nickname from '../../components/Nickname';
import Password from '../../components/Password';
import InvitationCode from '../../components/InvitationCode';
import { notice } from '../../components/Message/notice';
import SignInVia from '../../components/SignInVia';
import { RecaptchaWrapDiv } from '../SignIn';
import { recaptchaKey } from '../../constants';

const RecaptchaWrapDiv1 = styled(RecaptchaWrapDiv)`
  margin-top: 5px;
  margin-bottom: 15px;
`;

class SignUp extends Component {
  constructor(...args) {
    super(...args);
    const { history, match } = this.props;

    if (auth.loggedIn()) {
      history.replace('/');
      notice.show({ content: i18nTxt('Already logged in'), type: 'message-success', timeout: 3000 });
    }

    const { search } = history.location;
    const googleAccessToken = search.includes('?googleAccessToken=') ? search.slice('?googleAccessToken='.length) : null;
    const wechatAccessToken = search.includes('?wechatAccessToken=') ? search.slice('?wechatAccessToken='.length) : null;

    this.state = {
      googleAccessToken,
      wechatAccessToken,
      userId: match.params.userId,
      nickname: '',
      email: '',
      password: '',
      emailCode: '',
      invitationCode: match.params.invitationCode || '',
      termsCheckboxChecked: false,
      showHalfExtend: false,
      recaptchaVal: '',
      recaptchaErr: '',
    };
  }

  async componentDidMount() {
    document.title = 'Sign Up';
    const { userId, googleAccessToken, wechatAccessToken } = this.state;
    if (userId) {
      const { result } = await reqUserQuery({ userId, googleAccessToken, wechatAccessToken });
      const email = result.user.email || '';
      const nickname = result.user.nickname || '';
      this.setState({ email, nickname });
    }
  }

  termsCheckboxOnChange = e => {
    this.setState({ termsCheckboxChecked: e.target.checked });
  };

  onSignupClick = async () => {
    const {
      googleAccessToken,
      wechatAccessToken,
      userId,
      email,
      emailCode,
      nickname,
      password,
      invitationCode,
      termsCheckboxChecked,
      recaptchaVal,
    } = this.state;
    if (this.anyInputsHasError() || !termsCheckboxChecked) return;
    const { lang, history } = this.props;
    if (userId) {
      const {
        code,
        result: { accessToken, recaptcha },
      } = await reqUserSignup({
        email,
        emailVerificationCode: emailCode,
        nickname,
        password,
        invitationCode,
        userId,
        googleAccessToken,
        wechatAccessToken,
        language: lang,
        recaptchaVal,
      });
      if (code !== 0) {
        if (recaptcha && recaptcha.success !== true) {
          notice.show({
            content: getRecaptchaErr(recaptcha['error-codes']),
            type: 'message-error',
            timeout: 3000,
          });
        }
        return;
      }
      if (accessToken) {
        auth.setToken(accessToken);
      }
    } else {
      const {
        code,
        result: { accessToken, recaptcha },
      } = await reqUserSignup({
        email,
        emailVerificationCode: emailCode,
        nickname,
        password,
        invitationCode,
        language: lang,
        recaptchaVal,
      });
      if (code !== 0) {
        if (recaptcha && recaptcha.success !== true) {
          notice.show({
            content: getRecaptchaErr(recaptcha['error-codes']),
            type: 'message-error',
            timeout: 3000,
          });
        }
        return;
      }

      if (accessToken) {
        auth.setToken(accessToken);
      }
    }

    history.push('/signin', { signupSuccess: true });
  };

  anyInputsHasError() {
    const { termsCheckboxChecked, recaptchaVal } = this.state;
    const validateRecaptcha = () => {
      if (!recaptchaVal) {
        this.setState({
          recaptchaErr: 'Captcha code is empty',
        });
        return false;
      }
      this.setState({
        recaptchaErr: '',
      });
      return true;
    };

    if (
      !this.nicknameRef ||
      this.nicknameRef.hasError() ||
      !validateRecaptcha() ||
      !this.emailRef ||
      this.emailRef.hasError() ||
      !this.emailCodeRef ||
      this.emailCodeRef.hasError() ||
      !this.passwordRef ||
      this.passwordRef.hasError() ||
      !this.invitationCodeRef ||
      this.invitationCodeRef.hasError() ||
      !termsCheckboxChecked
    ) {
      return true;
    }
    return false;
  }

  render() {
    const { userId, email, nickname, invitationCode, showHalfExtend, recaptchaErr } = this.state;

    return (
      <Fragment>
        <Wrapper>
          <div className="signup">
            <form className="form-wrap">
              <span className="title">{userId ? i18nTxt('Setup Email and Password') : i18nTxt('Create an account')}</span>
              <div className="inputs-wrap">
                <Nickname
                  className={`${userId ? ' hidden' : ''}`}
                  nickname={nickname}
                  onChange={e => {
                    this.setState({ nickname: e.target.value });
                  }}
                  ref={ref => {
                    this.nicknameRef = ref;
                  }}
                />
                <RecaptchaWrapDiv1>
                  <ReCAPTCHA
                    sitekey={recaptchaKey}
                    onChange={val => {
                      this.setState({ recaptchaVal: val, recaptchaErr: '' });
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
                </RecaptchaWrapDiv1>
                {recaptchaErr && (
                  <div
                    style={{
                      color: '#EC6057',
                      textAlign: 'left',
                      fontSize: '12px',
                      marginTop: 9,
                    }}
                  >
                    {i18nTxt(recaptchaErr)}
                  </div>
                )}
                <Email
                  email={email}
                  userId={userId}
                  ref={ref => {
                    this.emailRef = ref;
                  }}
                  onChange={e => {
                    this.setState({ email: e.target.value });
                  }}
                />
                <EmailCode
                  className="singup-input"
                  email={email}
                  onChange={e => {
                    this.setState({ emailCode: e.target.value });
                  }}
                  ref={ref => {
                    this.emailCodeRef = ref;
                  }}
                />
                <Password
                  hasRepeat
                  ref={ref => {
                    this.passwordRef = ref;
                  }}
                  onChange={e => {
                    this.setState({ password: e.target.value });
                  }}
                />
                <InvitationCode
                  code={invitationCode}
                  ref={ref => {
                    this.invitationCodeRef = ref;
                  }}
                  onChange={e => {
                    this.setState({ invitationCode: e.target.value });
                  }}
                />
              </div>
              <div className="terms-wrap">
                <label>
                  <input type="checkbox" className="filled-in" onChange={this.termsCheckboxOnChange} />
                  <span>
                    {i18nTxt('I accept bounty')} <Link to="/terms">{i18nTxt('Terms')} </Link>
                    {i18nTxt('and')} <Link to="/policy">{i18nTxt('Policy')}</Link> {i18nTxt('of Conflux Bounty')}
                  </span>
                </label>
              </div>
              <div className={userId ? 'btn-wrap-signup-hidden' : 'btn-wrap-signup'}>
                <button className="btn waves-effect waves-light primary" type="button" onClick={this.onSignupClick}>
                  {i18nTxt('CREATE ACCOUNT')}
                </button>
                <Link className="primary signin-link" to="/signin">
                  {i18nTxt('SIGN IN')}
                </Link>
                <SignInVia />
              </div>
              <div className={userId ? 'btn-wrap-third-party-signup' : 'btn-wrap-third-party-signup-hidden'}>
                <Link className="primary signout-link" to="/">
                  {i18nTxt('SIGN OUT')}
                </Link>
                <button className="btn waves-effect waves-light primary third-party-done-btn" type="button" onClick={this.onSignupClick}>
                  {i18nTxt('DONE')}
                </button>
              </div>
            </form>
          </div>
        </Wrapper>
      </Fragment>
    );
  }
}

SignUp.propTypes = {
  /* eslint react/forbid-prop-types: 0 */
  match: PropTypes.object.isRequired,
  history: commonPropTypes.history.isRequired,
  lang: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return { lang: state.head.user.language };
}

export default connect(mapStateToProps)(SignUp);

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
  .inputs-wrap {
    margin-top: 40px;
  }
  .terms-wrap {
    text-align: left;
    margin: 20px 0 21px;
  }
  .btn-wrap-signup {
    display: flex;
    flex-direction: column;
  }
  .btn-wrap-signup-hidden {
    display: none;
  }
  .btn-wrap-third-party-signup {
    display: flex;
  }
  .btn-wrap-third-party-signup-hidden {
    display: none;
  }
  .signin-link {
    text-decoration: none;
    cursor: pointer;
    margin-top: 20px;
    font-size: 16px;
    line-height: 16px;
    text-transform: uppercase;
  }
  .signout-link {
    text-decoration: none;
    cursor: pointer;
    font-size: 16px;
    line-height: 44px;
    width: 174px;
    text-transform: uppercase;
    margin-right: 12px;
  }
  .third-party-done-btn {
    width: 174px;
  }
  .signin-link:hover {
    text-decoration: none;
  }
`;
