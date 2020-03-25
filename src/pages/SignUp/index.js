/**
 * @fileOverview sign up page
 * @name index.js
 */

import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import qs from 'querystring';
import ReCAPTCHA from '../../components/ReCAPTCHA';
import { StyledWrapper } from '../../globalStyles/common';
import { reqUserSignup } from '../../utils/api';
import { auth, commonPropTypes, i18nTxt, getRecaptchaErr, getQuery } from '../../utils';
import EmailCode from '../../components/EmailCode';
import Email from '../../components/Email';
import Nickname from '../../components/Nickname';
import Password from '../../components/Password';
import InvitationCode from '../../components/InvitationCode';
import { notice } from '../../components/Message/notice';
import SignInVia from '../../components/SignInVia';
import media from '../../globalStyles/media';
import { RecaptchaWrapDiv } from '../SignIn';
import { recaptchaKey } from '../../constants';
import unitParser from '../../utils/device';

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

    const query = getQuery();

    let nickname = query.displayName || '';
    nickname = nickname.replace(/ /g, '_');

    this.state = {
      source: query.source || '',
      accessToken: query.accessToken || '',
      userId: query.userId || '',
      nickname,
      email: query.googleEmail || '',
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
    document.title = i18nTxt('Sign Up');
    // const { userId, source, accessToken } = this.state;
    // if (source === 'google') {
    //   const { result } = await reqUserQuery({ source, userId, accessToken });

    //   const email = result.user.email || '';
    //   const nickname = result.user.nickname || '';
    //   this.setState({ email, nickname });
    // }
  }

  termsCheckboxOnChange = e => {
    this.setState({ termsCheckboxChecked: e.target.checked });
  };

  onSignupClick = async () => {
    const {
      accessToken,
      source,
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
    const query = getQuery();

    const getErrMsg = body => {
      const {
        message,
        result: { recaptcha },
      } = body;
      if (recaptcha && recaptcha.success !== true) {
        return getRecaptchaErr(recaptcha['error-codes']);
      }
      return message;
    };

    if (source === 'google' || source === 'wechat') {
      // third party signup
      const {
        code,
        result: { accessToken: loginAccessToken },
      } = await reqUserSignup(
        {
          ...query,
          email,
          nickname,
          password,
          invitationCode,
          userId,
          accessToken,
          source,
          language: lang,
          recaptchaVal,
          emailVerificationCode: emailCode,
        },
        { getErrMsg }
      );
      if (code !== 0) {
        return;
      }

      if (loginAccessToken) {
        auth.setToken(loginAccessToken);
      }
    } else {
      const {
        code,
        result: { accessToken: loginAccessToken },
      } = await reqUserSignup(
        {
          email,
          emailVerificationCode: emailCode,
          nickname,
          password,
          invitationCode,
          language: lang,
          recaptchaVal,
        },
        { getErrMsg }
      );
      if (code !== 0) {
        return;
      }

      if (loginAccessToken) {
        auth.setToken(loginAccessToken);
      }
    }

    history.push('/signin', { signupSuccess: true });
  };

  anyInputsHasError() {
    const { userId, termsCheckboxChecked, recaptchaVal } = this.state;
    const recaptchaHasError = () => {
      if (!recaptchaVal) {
        this.setState({
          recaptchaErr: 'Captcha code is empty',
        });
        return true;
      }
      this.setState({
        recaptchaErr: '',
      });
      return false;
    };

    if (
      !this.nicknameRef ||
      this.nicknameRef.hasError() ||
      recaptchaHasError() ||
      !this.emailRef ||
      this.emailRef.hasError() ||
      (!userId && (!this.emailCodeRef || this.emailCodeRef.hasError())) ||
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
    const { accessToken, source, userId, email, nickname, invitationCode, showHalfExtend, recaptchaErr } = this.state;
    const query = getQuery();

    return (
      <Fragment>
        <Wrapper>
          <div className="signup">
            <form className="form-wrap">
              <span className="title">{source ? i18nTxt('Setup Email and Password') : i18nTxt('Create an account')}</span>
              <div className="inputs-wrap">
                <Nickname
                  className={`${source === 'google' ? ' hidden' : ''}`}
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
                      marginBottom: 10,
                    }}
                  >
                    {i18nTxt(recaptchaErr)}
                  </div>
                )}
                <Email
                  errorIfRegistered
                  email={email}
                  userId={userId}
                  ref={ref => {
                    this.emailRef = ref;
                  }}
                  disabled={!!userId}
                  onChange={e => {
                    this.setState({ email: e.target.value });
                  }}
                />
                {!userId && (
                  <EmailCode
                    className="singup-input"
                    email={email}
                    beforeSend={{ validator: this.emailRef && (() => !this.emailRef.hasError()) }}
                    onChange={e => {
                      this.setState({ emailCode: e.target.value });
                    }}
                    ref={ref => {
                      this.emailCodeRef = ref;
                    }}
                  />
                )}
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
              <div className={source ? 'btn-wrap-signup-hidden' : 'btn-wrap-signup'}>
                <button className="btn waves-effect waves-light primary" type="button" onClick={this.onSignupClick}>
                  {i18nTxt('CREATE ACCOUNT')}
                </button>
                <Link className="primary signin-link" to="/signin">
                  {i18nTxt('SIGN IN')}
                </Link>
                <SignInVia />
              </div>
              <div className={source ? 'btn-wrap-third-party-signup' : 'btn-wrap-third-party-signup-hidden'}>
                <button
                  className="btn waves-effect waves-light default signout-btn"
                  type="button"
                  onClick={() => {
                    window.location.href = '/';
                  }}
                >
                  {i18nTxt('SIGN OUT')}
                </button>
                <button className="btn waves-effect waves-light primary third-party-done-btn" type="button" onClick={this.onSignupClick}>
                  {i18nTxt('DONE')}
                </button>
              </div>
              {source && (
                <div className="to-bind">
                  {i18nTxt('Already have an account?')}&nbsp;
                  <Link
                    to={`/bind-account?${qs.stringify({
                      ...query,
                      source,
                      accessToken,
                      userId,
                    })}`}
                  >
                    {i18nTxt('Bind your account here.')}
                  </Link>
                </div>
              )}
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
    flex: 1;
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
    &:hover {
      text-decoration: none;
    }
    ${media.mobile`
      text-align: center;
    `}
  }
  .signout-btn {
    flex: 1;
    margin-right: 12px;
    ${media.mobile`
      margin-right: ${unitParser(8)};
    `}
  }
  .third-party-done-btn {
    flex: 1;
  }
  .to-bind {
    text-align: left;
    margin-top: 12px;
    font-size: 14px;
    line-height: 14px;
    color: #595f61;
  }
`;
