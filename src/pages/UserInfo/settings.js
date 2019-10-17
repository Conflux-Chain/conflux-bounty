/**
 * @fileOverview user settings page
 * @name settings.js
 */

/* eslint react/no-multi-comp:0 */
/* eslint no-return-assign:0 */
import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import cx from 'classnames';
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
import media from '../../globalStyles/media';
import unitParser, { useMobile } from '../../utils/device';

const ModalHeadStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  > p {
    margin: 0;
    font-size: 20px;
    line-height: 20px;
    color: #171d1f;
    font-weight: 500;
  }
  ${media.mobile`
font-size: ${unitParser(24)};
line-height: ${unitParser(24)};
`}
`;

const LANGUAGES = { 'zh-CN': { label: '简体中文', value: 'zh-CN' }, en: { label: 'English', value: 'en' } };

function LanguageModal({ onCancel, onOk, defaultLanguageCode }) {
  const [selectedLangCode, setSelectedLangCode] = useState(defaultLanguageCode);
  const isMobile = useMobile();
  return (
    <Modal show showOverlay>
      <Confirm>
        <Select
          options={Object.values(LANGUAGES)}
          selected={LANGUAGES[selectedLangCode]}
          label={i18nTxt('Language Preference')}
          onSelect={lang => {
            setSelectedLangCode(lang.value);
          }}
        />
        <div className="confirm-actions">
          {!isMobile && (
            <button type="button" onClick={onCancel}>
              {i18nTxt('LEAVE')}
            </button>
          )}
          <button
            className={cx({ 'btn waves-effect waves-light primary': isMobile }, 'agree')}
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
      </Confirm>
    </Modal>
  );
}

LanguageModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  defaultLanguageCode: PropTypes.string.isRequired,
};

function NicknameModal({ onOk, onCancel }) {
  let nicknameRef;
  let nickname;
  const isMobile = useMobile();
  const modalContent = (
    <Confirm>
      <ModalHeadStyle>
        <p>{i18nTxt('Edit Nickname')}</p>
        {isMobile && (
          <button className="material-icons close" onClick={onCancel} type="button">
            close
          </button>
        )}
      </ModalHeadStyle>

      <Nickname
        onChange={e => (nickname = e.target.value)}
        ref={ref => {
          nicknameRef = ref;
        }}
      />
      <div className="confirm-actions">
        {!isMobile && (
          <button type="button" onClick={onCancel}>
            {i18nTxt('LEAVE')}
          </button>
        )}
        <button
          className={cx({ 'btn waves-effect waves-light primary': isMobile }, 'agree')}
          type="button"
          onClick={async e => {
            if (nicknameRef.hasError()) return;
            const { code } = await reqUserUpdate({ nickname });
            if (code === 0) {
              onOk(e);
            }
          }}
        >
          {i18nTxt('SAVE')}
        </button>
      </div>
    </Confirm>
  );

  return (
    <Modal show mobilePosBottom={isMobile} showOverlay>
      {modalContent}
    </Modal>
  );
}

NicknameModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
};

function EmailModal({ onCancel, onOk }) {
  let newVerificationCode;
  let currentVerificationCode;
  let password;
  let newEmailRef;
  let currentEmailRef;
  let newVerificationCodeRef;
  let currentVerificationCodeRef;
  let passwordRef;
  const [newEmail, setNewEmail] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const isMobile = useMobile();
  const modalContent = (
    <Confirm>
      <ModalHeadStyle>
        <p>{i18nTxt('Edit Email')}</p>
        {isMobile && (
          <button className="material-icons close" onClick={onCancel} type="button">
            close
          </button>
        )}
      </ModalHeadStyle>
      <div className="inputs-wrap">
        <Email label={i18nTxt('New Email')} onChange={e => setNewEmail(e.target.value)} ref={ref => (newEmailRef = ref)} />
        <EmailCode email={newEmail} onChange={e => (newVerificationCode = e.target.value)} ref={ref => (newVerificationCodeRef = ref)} />
        <Email
          label={i18nTxt('Current Email')}
          checkIsOwner
          onChange={e => setCurrentEmail(e.target.value)}
          ref={ref => (currentEmailRef = ref)}
        />
        <EmailCode
          email={currentEmail}
          onChange={e => (currentVerificationCode = e.target.value)}
          ref={ref => (currentVerificationCodeRef = ref)}
        />
        <Password onChange={e => (password = e.target.value)} ref={ref => (passwordRef = ref)} />
      </div>
      <div className="confirm-actions">
        {!isMobile && (
          <button type="button" onClick={onCancel}>
            {i18nTxt('LEAVE')}
          </button>
        )}
        <button
          className={cx({ 'btn waves-effect waves-light primary': isMobile }, 'agree')}
          type="button"
          onClick={async () => {
            if (
              newEmailRef.hasError() ||
              currentEmailRef.hasError() ||
              newVerificationCodeRef.hasError() ||
              currentVerificationCodeRef.hasError() ||
              passwordRef.hasError()
            ) {
              return;
            }
            const { code } = await reqUserUpdate({
              password,
              newEmail,
              currentEmail,
              newEmailVerificationCode: newVerificationCode,
              currentEmailVerificationCode: currentVerificationCode,
            });

            if (code !== 0) {
              // handle error at utils/api
              // notice.show({ content: body.message, type: 'message-error', timeout: 3000 });
              return;
            }
            onOk();
          }}
        >
          {i18nTxt('SAVE')}
        </button>
      </div>
    </Confirm>
  );

  return (
    <Modal show mobilePosBottom={isMobile} showOverlay>
      {' '}
      {modalContent}
    </Modal>
  );
}

EmailModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
};

function PasswordModal({ onOk, onCancel, email }) {
  let currentPassword;
  let newPassword;
  let verificationCode;
  let currentPasswordRef;
  let newPasswordRef;
  let verificationCodeRef;

  const isMobile = useMobile();
  const modalContent = (
    <Confirm>
      <ModalHeadStyle>
        <p>{i18nTxt('CHANGE PASSWORD')}</p>
        {isMobile && (
          <button className="material-icons close" onClick={onCancel} type="button">
            close
          </button>
        )}
      </ModalHeadStyle>
      <div className="inputs-wrap">
        <Password
          labels={[i18nTxt('Current Password')]}
          onChange={e => (currentPassword = e.target.value)}
          ref={ref => (currentPasswordRef = ref)}
        />
        <Password
          hasRepeat
          labels={[i18nTxt('New Password')]}
          onChange={e => (newPassword = e.target.value)}
          ref={ref => (newPasswordRef = ref)}
        />
        <EmailCode onChange={e => (verificationCode = e.target.value)} email={email} ref={ref => (verificationCodeRef = ref)} />
      </div>
      <div className="confirm-actions">
        {!isMobile && (
          <button type="button" onClick={onCancel}>
            {i18nTxt('LEAVE')}
          </button>
        )}
        <button
          className={cx({ 'btn waves-effect waves-light primary': isMobile }, 'agree')}
          type="button"
          onClick={async () => {
            if (currentPasswordRef.hasError() || newPasswordRef.hasError() || verificationCodeRef.hasError()) {
              return;
            }

            const { code } = await reqUserUpdate({
              currentPassword,
              newPassword,
              emailVerificationCode: verificationCode,
            });

            if (code !== 0) {
              // notice.show({ content: body.message, type: 'message-error', timeout: 5000 });
              return;
            }
            onOk();
          }}
        >
          {i18nTxt('SAVE')}
        </button>
      </div>
    </Confirm>
  );

  return (
    <Modal show mobilePosBottom={isMobile} showOverlay>
      {modalContent}
    </Modal>
  );
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
                {/* <tr> */}
                {/*   <td> */}
                {/*     <div className="settings-title">{i18nTxt('Language')}</div> */}
                {/*   </td> */}
                {/*   <td className="align-right settings-middle">{(LANGUAGES[language] && LANGUAGES[language].label) || ''}</td> */}
                {/*   <td className="align-right settings-btn"> */}
                {/*     <a href="/" className="primary" onClick={this.changeLanguagePreference}> */}
                {/*       <span>{i18nTxt('CHANGE')}</span> */}
                {/*     </a> */}
                {/*   </td> */}
                {/* </tr> */}
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
  min-width: 400px;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 2px 4px 20px rgba(0, 0, 0, 0.12);
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

  ${media.mobile`
  width: 100%;
  min-width: unset;
  border-radius: ${unitParser(12)} ${unitParser(12)} 0 0;
  .confirm-actions .agree {
    margin-left: 0;
    width: 100%;
    color: white;
  }
`}
`;
