/**
 * @fileOverview sign up page
 * @name index.js
 */

import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { StyledWrapper } from '../../globalStyles/common';
import { reqUserSignup, reqUserQuery } from '../../utils/api';
import { auth, commonPropTypes, i18nTxt } from '../../utils';
import EmailCode from '../../components/EmailCode';
import Email from '../../components/Email';
import Nickname from '../../components/Nickname';
import Password from '../../components/Password';
import InvitationCode from '../../components/InvitationCode';
import { notice } from '../../components/Message/notice';
import SignInVia from '../../components/SignInVia';
import media from '../../globalStyles/media';

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
    } = this.state;
    if (this.anyInputsHasError() || !termsCheckboxChecked) return;
    const { lang, history } = this.props;
    if (userId) {
      const {
        code,
        result: { accessToken },
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
      });
      if (code !== 0) {
        return;
      }
      if (accessToken) {
        auth.setToken(accessToken);
      }
    } else {
      const {
        code,
        result: { accessToken },
      } = await reqUserSignup({
        email,
        emailVerificationCode: emailCode,
        nickname,
        password,
        invitationCode,
        language: lang,
      });
      if (code !== 0) {
        return;
      }

      if (accessToken) {
        auth.setToken(accessToken);
      }
    }

    history.push('/signin', { signupSuccess: true });
  };

  anyInputsHasError() {
    const { termsCheckboxChecked } = this.state;
    if (
      !this.nicknameRef ||
      this.nicknameRef.hasError() ||
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
    const { userId, email, nickname, invitationCode } = this.state;

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
  const {
    common: { lang },
  } = state;
  return { lang };
}

export default connect(mapStateToProps)(SignUp);

const Wrapper = styled(StyledWrapper)`
  padding: 40px;
  ${media.mobile`
    padding: 20px 12px;
  `}
  .title {
    font-size: 32px;
    line-height: 32px;
    font-weight: 600;
    ${media.mobile`
      font-size: 24px;
      line-height: 24px;
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
      margin-right: 8px;
    `}
  }
  .third-party-done-btn {
    flex: 1;
  }
`;
