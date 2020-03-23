/**
 * @fileOverview user settings page
 * @name settings.js
 */

/* eslint react/no-multi-comp:0 */
/* eslint no-return-assign:0 */
import React, { Component, useState, useRef, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import qs from 'querystring';
import { StyledWrapper } from '../../globalStyles/common';
import BackHeadDiv from '../../components/BackHeadDiv';
import Modal from '../../components/Modal';
import { notice } from '../../components/Message/notice';
import { reqUserUpdate, reqAcccountUnBind } from '../../utils/api';
import { auth, commonPropTypes, i18nTxt } from '../../utils';
import * as actions from '../../components/PageHead/action';
import Nickname from '../../components/Nickname';
import Password from '../../components/Password';
import EmailCode from '../../components/EmailCode';
import Email from '../../components/Email';
import Select from '../../components/Select';
import media from '../../globalStyles/media';
import unitParser, { useMobile, isMobile as isMob } from '../../utils/device';
import ConfirmComp from '../../components/Modal/confirm';

const { mobile } = media;
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
  const [newVerificationCode, setNewVerificationCode] = useState('');
  const [currentVerificationCode, setCurrentVerificationCode] = useState('');
  const [password, setPassword] = useState('');

  const newEmailRef = useRef();
  const currentEmailRef = useRef();
  const newVerificationCodeRef = useRef();
  const currentVerificationCodeRef = useRef();
  const passwordRef = useRef();
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
        <Email errorIfRegistered label={i18nTxt('New Email')} onChange={e => setNewEmail(e.target.value)} ref={newEmailRef} />
        <EmailCode
          email={newEmail}
          onChange={e => setNewVerificationCode(e.target.value)}
          ref={newVerificationCodeRef}
          beforeSend={{ validator: newEmailRef && (() => !newEmailRef.current.hasError()) }}
        />
        <Email errorIfIsNotOwner label={i18nTxt('Current Email')} onChange={e => setCurrentEmail(e.target.value)} ref={currentEmailRef} />
        <EmailCode
          email={currentEmail}
          onChange={e => setCurrentVerificationCode(e.target.value)}
          ref={currentVerificationCodeRef}
          beforeSend={{ validator: currentEmailRef && (() => !currentEmailRef.current.hasError()) }}
        />
        <Password onChange={e => setPassword(e.target.value)} ref={passwordRef} />
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
              newEmailRef.current.hasError() ||
              currentEmailRef.current.hasError() ||
              newVerificationCodeRef.current.hasError() ||
              currentVerificationCodeRef.current.hasError() ||
              passwordRef.current.hasError()
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

const UnbindTxt = styled.div`
  font-size: 20px;
  line-height: 24px;
  font-weight: 600;
  color: #171d1f;
  margin-top: -10px;
`;

function GoogleAccountModal({ onOk, onCancel }) {
  const isMobile = useMobile();

  return (
    <ConfirmComp
      confirmBtns={
        <Fragment>
          <button
            type="button"
            onClick={e => {
              onCancel(e);
            }}
          >
            {i18nTxt('CANCEL')}
          </button>
          <button
            className="agree"
            type="button"
            onClick={e => {
              reqAcccountUnBind({
                type: 'google',
              }).then(() => {
                onOk(e);
              });
            }}
          >
            {i18nTxt('CONFIRM')}
          </button>
        </Fragment>
      }
      show
      title=""
      content={
        <UnbindTxt>
          {i18nTxt("You'll not be able to use this Gmail address to log in to the current account after unbinding. Confirm to unbind?")}
        </UnbindTxt>
      }
      wrapStyle={{
        width: isMobile ? '100%' : '480px',
      }}
    />
  );
}

GoogleAccountModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
};

const WechatWrapper = styled.div`
  width: 400px;
  height: 400px;
  position: relative;
  ${media.mobile`
    width: 300px;
    height: 300px;
    margin: auto;
    margin-left: 20px;
    margin-right: 20px;
  `}
  background: #333333;
  box-shadow: 5px 10px 20px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  .close {
    position: absolute;
    color: #fff;
    top: 10px;
    right: 10px;
  }
  #wx-login {
    width: 100%;
    height: 100%;
    padding-top: 40px;
  }
`;

function BindWechatModal({ onCancel }) {
  return (
    <Modal show showOverlay onEsc={onCancel}>
      <WechatWrapper>
        <button onClick={onCancel} className="material-icons close" type="button">
          close
        </button>
        <div id="wx-login"></div>
      </WechatWrapper>
    </Modal>
  );
}

BindWechatModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
};

function UnBindWechat({ onOk, onCancel }) {
  const isMobile = useMobile();

  return (
    <ConfirmComp
      confirmBtns={
        <Fragment>
          <button
            type="button"
            onClick={e => {
              onCancel(e);
            }}
          >
            {i18nTxt('CANCEL')}
          </button>
          <button
            className="agree"
            type="button"
            onClick={e => {
              reqAcccountUnBind({
                type: 'wechat',
              }).then(() => {
                onOk(e);
              });
            }}
          >
            {i18nTxt('CONFIRM')}
          </button>
        </Fragment>
      }
      show
      title=""
      content={
        <UnbindTxt>
          {i18nTxt("You'll not be able to use this Wechat ID to log in to the current account after unbinding. Confirm to unbind?")}
        </UnbindTxt>
      }
      wrapStyle={{
        width: isMobile ? '100%' : '480px',
      }}
    />
  );
}
UnBindWechat.propTypes = {
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

            const {
              code,
              result: { errorCode },
            } = await reqUserUpdate(
              {
                currentPassword,
                newPassword,
                emailVerificationCode: verificationCode,
              },
              { manualNotice: true }
            );

            if (code !== 0) {
              if (errorCode === 7) {
                // eslint-disable-next-line no-undef
                notice.show({ content: i18nTxt('Incorrect current password'), type: 'message-error', timeout: 5000 });
                return;
              }
              if (errorCode === 5) {
                // eslint-disable-next-line no-undef
                notice.show({
                  content: i18nTxt('Validation failed. Please check your email verification code'),
                  type: 'message-error',
                  timeout: 5000,
                });
                return;
              }
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

const Table = styled.div`
  border-top: 1px solid #ebeded;
`;
const Row = styled.div`
  display: flex;
  border-bottom: 1px solid #ebeded;
  padding: 30px 0 28px 0;
  justify-content: space-between;
  font-size: 16px;
  line-height: 16px;
  .settings-title {
    font-style: normal;
    font-weight: normal;
    color: #171d1f;
    margin-right: 20px;
    text-align: left;
  }
  .settings-middle {
    text-align: right;
    color: #8e9394;
    white-space: nowrap;
    flex: 1;
  }
  .pseudo-password {
    font-size: 10px;
    letter-spacing: 4px;
  }
  .settings-btn {
    margin-left: 20px;
    min-width: 66px;
    text-align: right;
    padding: 0;
    color: #22b2d6;
    &:hover {
      text-decoration: underline;
      cursor: pointer;
    }
    &.unbind {
      color: #d43429;
    }
  }
  ${mobile`
font-size: ${unitParser(12)};
line-height: ${unitParser(12)};
  .settings-middle {
    color: #666666;
  }
  .pseudo-password {
    font-size: ${unitParser(8)});
  }
`}
`;

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

  openUnbindGoogle = () => {
    this.setState({
      editing: 'unbindGoogle',
    });
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
        user: { nickname, email, language, googleProfile, wechatProfile },
      },
    } = this.props;

    const { editing } = this.state;
    const { history } = this.props;

    const isMobile = isMob();

    const dom = [
      <React.Fragment>
        <BackHeadDiv onClick={() => history.push('/user-info')}>
          <Link to="/user-info">{i18nTxt('My Account')}</Link>
        </BackHeadDiv>
        <Wrapper>
          <h1>{i18nTxt('Settings')}</h1>
          <div className="table-wrap">
            <Table>
              <Row>
                <div className="settings-title">{i18nTxt('Nickname')}</div>
                <div className="settings-middle">{nickname}</div>
                <a href="/" className="primary settings-btn" onClick={this.editNickName}>
                  <span>{i18nTxt('EDIT')}</span>
                </a>
              </Row>
              <Row>
                <div className="settings-title">{i18nTxt('Email')}</div>
                <div className="settings-middle">{email}</div>
                <a href="/" className="primary settings-btn" onClick={this.editEmail}>
                  <span>{i18nTxt('EDIT')}</span>
                </a>
              </Row>
              <Row>
                <div className="settings-title">{i18nTxt('Google')}</div>
                <div className="settings-middle">{googleProfile ? googleProfile.email : i18nTxt('bindacc.None')}</div>
                <button
                  type="button"
                  className={`primary settings-btn ${googleProfile ? 'unbind' : ''}`}
                  onClick={() => {
                    if (googleProfile) {
                      this.openUnbindGoogle();
                    } else {
                      window.location.href = `/api/user/google/bindAuth?${qs.stringify({
                        accessToken: auth.getToken(),
                        returnUrl: window.location.href,
                      })}`;
                    }
                  }}
                >
                  <span>{googleProfile ? i18nTxt('bindacc.UNBIND') : i18nTxt('bindacc.BIND')}</span>
                </button>
              </Row>
              <Row style={{ display: isMobile ? 'none' : 'flex' }}>
                <div className="settings-title">{i18nTxt('WeChat')}</div>
                <div className="settings-middle">{wechatProfile ? wechatProfile.nickname : i18nTxt('bindacc.None')}</div>
                <button
                  type="button"
                  className={`primary settings-btn ${wechatProfile ? 'unbind' : ''}`}
                  onClick={() => {
                    if (wechatProfile) {
                      this.setState({
                        editing: 'unbindWechat',
                      });
                    } else {
                      window.location.href = `/api/user/wechat/bindAuth?${qs.stringify({
                        accessToken: auth.getToken(),
                        returnUrl: window.location.href,
                      })}`;
                    }
                  }}
                >
                  <span>{wechatProfile ? i18nTxt('bindacc.UNBIND') : i18nTxt('bindacc.BIND')}</span>
                </button>
              </Row>
              <Row>
                <div className="settings-title">{i18nTxt('Password')}</div>
                <div className="settings-middle">●●●●●●●</div>
                <a href="/" className="primary settings-btn" onClick={this.changePassword}>
                  <span>{i18nTxt('CHANGE')}</span>
                </a>
              </Row>
              <Row style={{ display: 'none' }}>
                <div className="settings-title">{i18nTxt('Language')}</div>
                <div className="settings-middle">{(LANGUAGES[language] && LANGUAGES[language].label) || ''}</div>
                <a href="/" className="primary settings-btn" onClick={this.changeLanguagePreference}>
                  <span>{i18nTxt('CHANGE')}</span>
                </a>
              </Row>
            </Table>
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
          unbindGoogle: <GoogleAccountModal onOk={this.updateAccount} onCancel={this.onCancel} />,
          unbindWechat: <UnBindWechat onOk={this.updateAccount} onCancel={this.onCancel} />,
          bindWechat: <BindWechatModal onCancel={this.onCancel} />,
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
    ${mobile`
font-size: ${unitParser(24)};
line-height: ${unitParser(24)};
`}
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
