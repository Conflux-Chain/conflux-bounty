/**
 * @fileOverview sign in page
 * @name index.js
 */

import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { StyledWrapper } from '../../globalStyles/common';
import Input from '../../components/Input';
import { sendRequest, auth, i18nTxt } from '../../utils';
import { notice } from '../../components/Message/notice';
import { getAccount } from '../../components/PageHead/action';
import SignInVia from '../../components/SignInVia';

class SignIn extends Component {
  constructor(...args) {
    super(...args);
    const { email = '', history } = this.props;

    if (auth.loggedIn()) {
      history.replace('/');
    }
    this.state = {
      inputsValue: {
        email,
        password: '',
      },
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
      inputsValue: { email, password },
    } = this.state;

    const {
      body: { code, result },
    } = await sendRequest({
      url: '/user/login',
      body: { email, password },
      manualNotice: true,
    });

    if (code !== 0) {
      notice.show({
        content: i18nTxt('Login failed. Check your username or password.'),
        type: 'message-error',
        timeout: 3000,
      });
      return;
    }

    auth.setToken(result.accessToken);
    const { history, dispatch } = this.props;
    dispatch(getAccount());
    history.push('/user-info');
  };

  render() {
    const {
      inputsValue: { email, password },
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
              </div>
              <div className="btn-wrap-signup">
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
`;
