/**
 * @fileOverview user settings page
 * @name settings.js
 */

/* eslint react/no-multi-comp:0 */
import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { StyledWrapper } from '../../globalStyles/common';
import BackHeadDiv from '../../components/BackHeadDiv';
import Modal from '../../components/Modal';
// import { notice } from '../../components/Message/notice';
import { reqUserUpdate } from '../../utils/api';
import { auth, commonPropTypes, i18nTxt } from '../../utils';
import * as actions from '../../components/PageHead/action';
import Nickname from '../../components/Nickname';
import Password from '../../components/Password';
import EmailCode from '../../components/EmailCode';
import Email from '../../components/Email';
import Select from '../../components/Select';

const LANGUAGES = { 'zh-CN': { label: '简体中文', value: 'zh-CN' }, en: { label: 'English', value: 'en' } };

function LanguageModal({ onCancel, onOk, defaultLanguageCode }) {
  const [selectedLangCode, setSelectedLangCode] = useState(defaultLanguageCode);
  return (
    <Modal show showOverlay={false}>
      <Confirm>
        <div>
          <Select
            options={Object.values(LANGUAGES)}
            selected={LANGUAGES[selectedLangCode]}
            label={i18nTxt('Language Preference')}
            onSelect={lang => {
              setSelectedLangCode(lang.value);
            }}
          />
          <div className="confirm-actions">
            <button type="button" onClick={onCancel}>
              {i18nTxt('LEAVE')}
            </button>
            <button
              className="agree"
              type="button"
              onClick={async e => {
                const { code } = await reqUserUpdate({ language: selectedLangCode });
                if (code !== 0) return;
                onOk(e);
              }}
            >
              {i18nTxt('SAVE')}
            </button>
          </div>
        </div>
      </Confirm>
    </Modal>
  );
}

LanguageModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  defaultLanguageCode: PropTypes.string.isRequired,
};

class NicknameModal extends Component {
  onChange = async e => {
    this.nickname = e.target.value;
  };

  onOk = async e => {
    if (this.nicknameRef.hasError()) return;
    const { onOk } = this.props;
    const { code } = await reqUserUpdate({ nickname: this.nickname });
    if (code === 0) {
      onOk(e);
    }
  };

  render() {
    const { onCancel } = this.props;
    return (
      <Modal show showOverlay={false}>
        <Confirm>
          <div>
            <p style={{ marginBottom: '20px' }}>{i18nTxt('Edit Nickname')}</p>
            <Nickname
              onChange={this.onChange}
              ref={ref => {
                this.nicknameRef = ref;
              }}
            />
            <div className="confirm-actions">
              <button type="button" onClick={onCancel}>
                {i18nTxt('LEAVE')}
              </button>
              <button className="agree" type="button" onClick={this.onOk}>
                {i18nTxt('SAVE')}
              </button>
            </div>
          </div>
        </Confirm>
      </Modal>
    );
  }
}

NicknameModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
};

class EmailModal extends Component {
  state = { newEmail: '', currentEmail: '' };

  onNewEmailChange = async e => {
    this.setState({ newEmail: e.target.value });
  };

  onNewVerificationCodeChange = async e => {
    this.newVerificationCode = e.target.value;
  };

  onCurrentEmailChange = async e => {
    this.setState({ currentEmail: e.target.value });
  };

  onCurrentVerificationCodeChange = async e => {
    this.currentVerificationCode = e.target.value;
  };

  onPasswordChange = async e => {
    this.password = e.target.value;
  };

  onOk = async () => {
    if (
      this.newEmailRef.hasError() ||
      this.currentEmailRef.hasError() ||
      this.newVerificationCodeRef.hasError() ||
      this.currentVerificationCodeRef.hasError() ||
      this.passwordRef.hasError()
    ) {
      return;
    }
    const { onOk } = this.props;
    const { newEmail, currentEmail } = this.state;
    const { code } = await reqUserUpdate({
      password: this.password,
      newEmail,
      currentEmail,
      newEmailVerificationCode: this.newVerificationCode,
      currentEmailVerificationCode: this.currentVerificationCode,
    });

    if (code !== 0) {
      // handle error at utils/api
      // notice.show({ content: body.message, type: 'message-error', timeout: 3000 });
      return;
    }
    onOk();
  };

  render() {
    const { onCancel } = this.props;
    const { newEmail, currentEmail } = this.state;
    return (
      <Modal show showOverlay={false}>
        <Confirm>
          <div>
            <p style={{ marginBottom: '20px' }}>{i18nTxt('Edit Email')}</p>
            <div className="inputs-wrap">
              <Email
                label={i18nTxt('New Email')}
                onChange={this.onNewEmailChange}
                ref={ref => {
                  this.newEmailRef = ref;
                }}
              />
              <EmailCode
                email={newEmail}
                onChange={this.onNewVerificationCodeChange}
                ref={ref => {
                  this.newVerificationCodeRef = ref;
                }}
              />
              <Email
                label={i18nTxt('Current Email')}
                checkIsOwner
                onChange={this.onCurrentEmailChange}
                ref={ref => {
                  this.currentEmailRef = ref;
                }}
              />
              <EmailCode
                email={currentEmail}
                onChange={this.onCurrentVerificationCodeChange}
                ref={ref => {
                  this.currentVerificationCodeRef = ref;
                }}
              />
              <Password
                onChange={this.onPasswordChange}
                ref={ref => {
                  this.passwordRef = ref;
                }}
              />
            </div>
            <div className="confirm-actions">
              <button type="button" onClick={onCancel}>
                {i18nTxt('LEAVE')}
              </button>
              <button className="agree" type="button" onClick={this.onOk}>
                {i18nTxt('SAVE')}
              </button>
            </div>
          </div>
        </Confirm>
      </Modal>
    );
  }
}

EmailModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
};

class PasswordModal extends Component {
  onCurrentPasswordChange = async e => {
    this.currentPassword = e.target.value;
  };

  onNewPasswordChange = async e => {
    this.newPassword = e.target.value;
  };

  onVerificationCodeChange = async e => {
    this.verificationCode = e.target.value;
  };

  onOk = async () => {
    if (this.currentPasswordRef.hasError() || this.newPasswordRef.hasError() || this.verificationCodeRef.hasError()) {
      return;
    }

    const { onOk } = this.props;
    const { code } = await reqUserUpdate({
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      emailVerificationCode: this.verificationCode,
    });

    if (code !== 0) {
      // notice.show({ content: body.message, type: 'message-error', timeout: 5000 });
      return;
    }
    onOk();
  };

  render() {
    const { onCancel, email } = this.props;
    return (
      <Modal show showOverlay={false}>
        <Confirm>
          <div>
            <p style={{ marginBottom: '20px' }}>{i18nTxt('CHANGE PASSWORD')}</p>
            <div className="inputs-wrap">
              <Password
                labels={[i18nTxt('Current Password')]}
                onChange={this.onCurrentPasswordChange}
                ref={ref => {
                  this.currentPasswordRef = ref;
                }}
              />
              <Password
                hasRepeat
                labels={[i18nTxt('New Password')]}
                onChange={this.onNewPasswordChange}
                ref={ref => {
                  this.newPasswordRef = ref;
                }}
              />
              <EmailCode
                onChange={this.onVerificationCodeChange}
                email={email}
                ref={ref => {
                  this.verificationCodeRef = ref;
                }}
              />
            </div>
            <div className="confirm-actions">
              <button type="button" onClick={onCancel}>
                {i18nTxt('LEAVE')}
              </button>
              <button className="agree" type="button" onClick={this.onOk}>
                {i18nTxt('SAVE')}
              </button>
            </div>
          </div>
        </Confirm>
      </Modal>
    );
  }
}

PasswordModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
};

// eslint-disable-next-line react/prefer-stateless-function
class Settings extends Component {
  state = { editing: '' };

  editNickName = async e => {
    e.preventDefault();
    this.setState({ editing: 'nickname' });
  };

  editEmail = async e => {
    e.preventDefault();
    this.setState({ editing: 'email' });
  };

  changePassword = async e => {
    e.preventDefault();
    this.setState({ editing: 'password' });
  };

  changeLanguagePreference = async e => {
    e.preventDefault();
    this.setState({ editing: 'language' });
  };

  updateAccount = async () => {
    const { getAccount } = this.props;
    getAccount();
    this.onCancel();
  };

  reLogin = async () => {
    const { history } = this.props;
    auth.removeToken();
    this.onCancel();
    history.push('/signin');
  };

  onCancel = async () => {
    this.setState({ editing: '' });
  };

  render() {
    const {
      headAccount: {
        user: { nickname, email, language },
      },
    } = this.props;

    const { editing } = this.state;
    const { history } = this.props;

    const dom = [
      <React.Fragment>
        <BackHeadDiv onClick={() => history.push('/user-info')}>
          <Link to="/user-info">{i18nTxt('My Account')}</Link>
        </BackHeadDiv>
        <Wrapper>
          <h1>{i18nTxt('Settings')}</h1>
          <div className="table-wrap">
            <table>
              <tbody>
                <tr>
                  <td>
                    <div className="settings-title">{i18nTxt('Nickname')}</div>
                  </td>
                  <td className="align-right settings-middle">{nickname}</td>
                  <td className="align-right settings-btn">
                    <a href="/" className="primary" onClick={this.editNickName}>
                      <span>{i18nTxt('EDIT')}</span>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="settings-title">{i18nTxt('Email')}</div>
                  </td>
                  <td className="align-right settings-middle">{email}</td>
                  <td className="align-right settings-btn">
                    <a href="/" className="primary" onClick={this.editEmail}>
                      <span>{i18nTxt('EDIT')}</span>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="settings-title">{i18nTxt('Password')}</div>
                  </td>
                  <td className="align-right settings-middle pseudo-password">●●●●●●</td>
                  <td className="align-right settings-btn">
                    <a href="/" className="primary" onClick={this.changePassword}>
                      <span>{i18nTxt('CHANGE')}</span>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="settings-title">{i18nTxt('Language')}</div>
                  </td>
                  <td className="align-right settings-middle">{(LANGUAGES[language] && LANGUAGES[language].label) || ''}</td>
                  <td className="align-right settings-btn">
                    <a href="/" className="primary" onClick={this.changeLanguagePreference}>
                      <span>{i18nTxt('CHANGE')}</span>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Wrapper>
      </React.Fragment>,
    ];
    if (editing !== '') {
      dom.push(
        {
          nickname: <NicknameModal onOk={this.updateAccount} onCancel={this.onCancel} />,
          email: <EmailModal onOk={this.reLogin} onCancel={this.onCancel} />,
          password: <PasswordModal onOk={this.reLogin} onCancel={this.onCancel} email={email} />,
          language: <LanguageModal onOk={this.updateAccount} onCancel={this.onCancel} defaultLanguageCode={language} />,
        }[editing]
      );
    }
    return <React.Fragment> {dom} </React.Fragment>;
  }
}

Settings.propTypes = {
  history: commonPropTypes.history.isRequired,
  getAccount: PropTypes.func.isRequired,
  headAccount: PropTypes.objectOf({
    user: PropTypes.objectOf({
      nickName: PropTypes.string.isRequired,
      language: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

function mapStateToProps(state) {
  const { head: headAccount } = state;
  return { headAccount };
}

export default connect(
  mapStateToProps,
  actions
)(Settings);

const Wrapper = styled(StyledWrapper)`
  padding: 40px;
  color: #171d1f;
  h1 {
    font-size: 32px;
    line-height: 32px;
    margin: 0;
    margin-bottom: 40px;
    font-weight: 500;
  }
  .table-wrap {
    margin-top: 40px;
    .align-right {
      text-align: right;
    }
    td {
      padding: 30px 0 28px 0;
    }
    tr:first-child {
      border-top: 1px solid #ebeded;
    }
    .settings-title {
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 16px;
      color: #171d1f;
    }
    .settings-middle {
      font-size: 16px;
      line-height: 16px;
      text-align: right;
      color: #8e9394;
    }
    .pseudo-password {
      font-size: 10px;
      letter-spacing: 4px;
    }
    .settings-btn {
      width: 104.5px;
    }
  }
`;

const Confirm = styled.div`
  padding: 20px;
  > div {
    min-width: 400px;
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: rgba(0, 0, 0, 0.12) 2px 4px 20px;
  }
  p {
    font-size: 20px;
    line-height: 20px;
    color: #171d1f;
    margin: 0;
    font-weight: 500;
  }
  .inputs-wrap {
    margin-top: 20px;
  }
  .confirm-actions {
    text-align: right;
    margin-top: 21px;
  }
  .confirm-actions > button {
    outline: none;
    border: none;
    cursor: pointer;
    color: #595f61;
    padding-left: 5px;
    padding-right: 5px;
    font-size: 16px;
    &:focus {
      background: none;
    }
  }
  .confirm-actions .agree {
    margin-left: 20px;
    color: #22b2d6;
  }
  .confirm-actions .disabled {
    margin-left: 20px;
  }
`;
