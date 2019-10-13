import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import * as actions from './action';
import { StyledWrapper, flexCenterMiddle } from '../../globalStyles/common';
import { isMobile } from '../../utils/device';
import media from '../../globalStyles/media';
import Message from '../../components/Message';
import { notice } from '../../components/Message/notice';
import Tooltip from '../../components/Tooltip';
import imgMybountys from '../../assets/iconfont/my-bountys.svg';
import imgMySolutions from '../../assets/iconfont/my-solutions.svg';
import imgMyLikes from '../../assets/iconfont/my-likes.svg';
import imgInviteFriends from '../../assets/iconfont/invite-friends.svg';
import imgSettings from '../../assets/iconfont/settings.svg';
import imgDefaultAvatar from '../../assets/iconfont/default-avatar.svg';

import { i18nTxt, auth, commonPropTypes, encodeImgKey, genImgUrlFromName, getMd5, uploadFileOss } from '../../utils';
import { reqUserUpdate, reqLogout } from '../../utils/api';
import Withdraw from './withdraw';

const Wrapper = styled(StyledWrapper)`
  padding: 40px;
  .currency-wrap {
    display: flex;
    margin-top: 40px;
  }
  ${media.mobile`
width: 100%;
border-radius: unset;
padding: 16px;
box-shadow: unset;
padding-bottom: 40px;
margin-bottom:-90px;

  .currency-wrap {
    position: relative;
    top: -90px;
    background-color: white;
    margin-top: 0;
    box-shadow: 1px 2px 12px rgba(0, 0, 0, 0.12);
    border-radius: 12px;
    padding: 50px 20px 20px 20px;
    flex-direction: column;
  }
`}
`;

const ColorBackground = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  height: 220px;
  width: 100%;
  background: radial-gradient(66.13% 120.18% at 0% 0%, #37a2c4 0%, #1587ab 100%);
  margin-top: 56px;
`;

const IconMail = styled.div`
  margin-left: 189px;
  .iconmail {
    text-decoration: none;
    font-size: 24px;
    line-height: 24px;
    top: 0px;
    right: 0px;
    cursor: pointer;
    color: #595f61;
    ${media.mobile` color: white;`}
  }
  .iconmail-dot {
    position: relative;
    cursor: pointer;
    top: -45px;
    right: -20px;
    width: 24px;
    height: 24px;
    color: #fff;
    background: #f0453a;
    border-radius: 50%;
    text-align: center;
    font-size: 16px;
    ${flexCenterMiddle}
  }
  ${media.mobile`
margin-left: 0;
z-index:1;
  .iconmail {
    ${media.mobile` color: white;`}
  }
`}
`;

function MessagesCountButton(props) {
  const { messageCount = 0 } = props;
  return (
    <IconMail>
      <Link to="/messages">
        <span className="iconmail"></span>
        {messageCount ? (
          <div
            className="iconmail-dot"
            style={{
              fontSize: messageCount > 99 ? 13 : 16,
            }}
          >
            {messageCount > 99 ? (
              <span>
                99<span style={{ marginLeft: -1, fontSize: 10, verticalAlign: 'top' }}>+</span>
              </span>
            ) : (
              messageCount
            )}
          </div>
        ) : (
          <div></div>
        )}
      </Link>
    </IconMail>
  );
}

MessagesCountButton.propTypes = {
  messageCount: PropTypes.number.isRequired,
};

const UserTextInfoStyle = styled.div`
  align-self: center;
  .user-name {
    font-size: 24px;
    line-height: 24px;
  }
  .user-email {
    font-size: 14px;
    line-height: 14px;
    margin-top: 8px;
  }
  ${media.mobile`
align-self: unset;
margin-top: 16px;
z-index: 10;
  .user-name  {
    color: #FFFFFF;
  }
  .user-email {
    opacity: 0.8;
    color: #FFFFFF;
  }
`}
`;

function UserTextInfo({ user: { nickname, email } }) {
  return (
    <UserTextInfoStyle>
      <div className="user-name">{nickname}</div>
      <div className="user-email">{email}</div>
    </UserTextInfoStyle>
  );
}

UserTextInfo.propTypes = {
  user: PropTypes.objectOf({
    nickname: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
};

const UserAvatarStyle = styled.div`
  vertical-align: middle;
  width: 120px;
  height: 120px;
  margin-right: 20px;
  border-radius: 50%;
  background: #999;
  position: relative;
  overflow: hidden;
  display: inline-block;
  .avatar-uploader {
    position: absolute;
    opacity: 0;
    left: 15px;
  }
  &.withimg {
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);
    background: #fff;
    .img-edit {
      background: rgba(0, 0, 0, 0.6);
    }
  }
  .avatar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-size: cover;
    background-position: center;
  }
  .img-edit {
    position: absolute;
    bottom: 0px;
    background: rgba(0, 0, 0, 0.3);
    width: 100%;
    text-align: center;
    color: #fff;
    cursor: pointer;
  }

  ${media.mobile`
  margin: 2.33px 16.67px 53.16px 11.83px;
z-index: 10;
`}
`;

function UserAvatar({ photoUrl, onAvatarLoad }) {
  return (
    <UserAvatarStyle className={cx({ withimg: photoUrl })}>
      <div
        className="avatar"
        style={{
          backgroundImage: `url("${photoUrl || imgDefaultAvatar}")`,
        }}
      />
      <div className="img-edit">
        <input type="file" className="avatar-uploader" accept="image/jpeg,image/png,image/gif" onChange={onAvatarLoad} />
        {i18nTxt('EDIT')}
      </div>
    </UserAvatarStyle>
  );
}
UserAvatar.defaultProps = { photoUrl: undefined };
UserAvatar.propTypes = {
  photoUrl: PropTypes.string,
  onAvatarLoad: PropTypes.func.isRequired,
};

const UserSection = styled.div`
  display: flex;
  ${media.mobile`
justify-content: space-between;
`}
`;

const Flex = styled.div`
  display: flex;
`;

const RewardInfoStyle = styled.div`
  flex: 1;
  .reward-title {
    font-size: 16px;
    color: #171d1f;
    margin-bottom: 16px;
    font-weight: 500;
    ${media.mobile`
line-height: 16px;
`}
  }
  .reward-content {
    display: flex;
    align-items: center;
  }
  .withdraw-currency {
    flex: 1;
    > span {
      color: #8e9394;
      font-size: 12px;
      display: block;
      ${media.mobile`
margin-bottom: 4px;
line-height:14px;
font-size: 14px;
`}
    }
    > strong {
      font-size: 20px;
      color: #171d1f;
      display: block;
      font-weight: 500;
      ${media.mobile`
line-height: 20px;
`}
    }
    ${media.mobile`
text-align: center;
:nth-child(1) {border-right: 1px solid #EBEDED;}
`}
  }
  .question {
    vertical-align: middle;
    margin-left: 5px;
  }
  ${media.mobile`
flex-direction: column;
margin-bottom: 20px;
`}
`;

function RewardInfo({ fansCoin, fansCoinLocked }) {
  return (
    <RewardInfoStyle>
      <div className="reward-title">
        <span style={{ verticalAlign: 'middle' }}> {i18nTxt('Bounty Rewards')}</span>

        <Tooltip tipSpan={<i className="question"></i>}>
          <div>
            {i18nTxt('userinfo.rewardsExplain')}
            <div>
              <a rel="noopener noreferrer" target="_blank" href="https://wallet.confluxscan.io/about">
                {i18nTxt('userInfo.viewMore')} &gt;
              </a>
            </div>
          </div>
        </Tooltip>
      </div>
      <div className="reward-content">
        <div className="withdraw-currency">
          <span>{i18nTxt('Available (FC)')}</span>
          <strong>{fansCoin}</strong>
        </div>
        <div className="withdraw-currency">
          <span>{i18nTxt('Locked (FC)')}</span>
          <strong>{fansCoinLocked}</strong>
        </div>
      </div>
    </RewardInfoStyle>
  );
}

RewardInfo.propTypes = { fansCoin: PropTypes.number.isRequired, fansCoinLocked: PropTypes.number.isRequired };

const WithdrawalActionsStyle = styled.div`
  text-align: center;
  button {
    margin-top: 5px;
  }
  a {
    display: block;
    margin-top: 12px;
  }
  ${media.mobile`
button.btn.default {
  width: 100%;
  color: #22B2D6;
}
`}
`;

function WithdrawActions({ onWithdrawClick }) {
  return (
    <WithdrawalActionsStyle>
      <button onClick={onWithdrawClick} className="btn default waves-effect waves-light" type="button">
        {i18nTxt('WITHDRAW')}
      </button>
      <Link to="/account-history" className="default">
        {i18nTxt('HISTORY')}
      </Link>
    </WithdrawalActionsStyle>
  );
}

WithdrawActions.propTypes = { onWithdrawClick: PropTypes.func.isRequired };

const MessageNoticeStyle = styled.div`
  margin: 0 auto;
  margin-top: 20px;
  ${media.mobile`
      .message {
        display: flex;
        align-items: center;
      }
      .message > span {
        font-size: 14px;
        line-height: 18px;
      }
`}
`;

const LineSep = styled.div`
  height: 1px;
  background: #ebeded;
  margin-top: 40px;
  margin-left: -40px;
  margin-right: -40px;
  margin-bottom: 15px;
`;

const SettingsStyle = styled.div`
  overflow: auto;
  .settings-item {
    width: 33%;
    display: inline-block;
    > span {
      display: block;
      padding-top: 17px;
      padding-bottom: 20px;
      color: #595f61;
      text-align: center;
      cursor: pointer;
    }
    > img {
      margin: 0 auto;
      margin-top: 32px;
      display: block;
      cursor: pointer;
    }
    :hover {
      text-decoration: none;
    }
  }
  ${media.mobile`
position: relative;
top: -90px;
`}
`;

function Settings() {
  return (
    <SettingsStyle>
      <Link className="settings-item" to="/my-bounty">
        <img src={imgMybountys} alt="My Bounties<" />
        <span>{i18nTxt('My Bounties')}</span>
      </Link>
      <Link className="settings-item" to="/my-submission">
        <img src={imgMySolutions} alt="My Submissions" />
        <span>{i18nTxt('My Submissions')}</span>
      </Link>
      <Link className="settings-item" to="/my-likes">
        <img src={imgMyLikes} alt="My Likes" />
        <span>{i18nTxt('My Likes')}</span>
      </Link>
      <Link className="settings-item" to="/invite-friends">
        <img src={imgInviteFriends} alt="Invite Friends" />
        <span>{i18nTxt('Invite Friends')}</span>
      </Link>
      <Link className="settings-item" to="/settings">
        <img src={imgSettings} alt="Settings" />
        <span>{i18nTxt('Settings')}</span>
      </Link>
    </SettingsStyle>
  );
}

const SignOutStyle = styled.div`
  margin-top: 20px;
  text-align: center;
  button.btn {
    color: #f0453a;
  }
  ${media.mobile`
button.btn{
  width: 100%;
}
position: relative;
top: -90px;
`}
`;

function SignOut({ onClick }) {
  return (
    <SignOutStyle>
      <button className="btn default waves-effect waves-light" type="button" onClick={onClick}>
        {i18nTxt('SIGN OUT')}
      </button>
    </SignOutStyle>
  );
}
SignOut.propTypes = { onClick: PropTypes.func.isRequired };

// eslint-disable-next-line react/prefer-stateless-function
class UserInfo extends Component {
  constructor(...args) {
    super(...args);
    const { history, resetUserAccount } = this.props;
    if (!auth.loggedIn()) {
      history.push('/signin');
      return;
    }

    resetUserAccount();
    document.title = i18nTxt('My Account');
  }

  componentDidMount() {
    window.addEventListener(
      'orientationchange',
      () => {
        this.forceUpdate();
      },
      false
    );
  }

  onAvatarLoad = async e => {
    if (!e.target.value) return;
    const { target } = e;
    const curFile = e.target.files[0];
    const fileKey = encodeImgKey(curFile.name);
    const md5Promise = getMd5(curFile);

    uploadFileOss(fileKey, curFile).then(async () => {
      target.value = '';

      const md5 = await md5Promise;
      const url = genImgUrlFromName(curFile.name, md5);
      const { code } = await reqUserUpdate({ photoUrl: url });

      if (code !== 0) {
        return notice.show({
          content: i18nTxt('Upload failed, please try again.'),
          type: 'message-error',
          timeout: 3000,
        });
      }

      const { getAccount } = this.props;
      const getPhoto = () => {
        return new Promise((resolve, reject) => {
          const imgTmp = new Image();
          imgTmp.onload = () => {
            resolve();
          };
          imgTmp.onerror = () => {
            reject();
          };
          imgTmp.src = url;
        });
      };

      setTimeout(() => {
        getPhoto()
          .catch(getPhoto)
          .catch(getPhoto)
          .then(() => {
            getAccount();
          });
      }, 1000);
      return null;
    });
  };

  render() {
    const { history, head, updateUserAccount } = this.props;

    return (
      <React.Fragment>
        <Wrapper>
          {isMobile() && <ColorBackground />}
          <UserSection>
            <Flex>
              <UserAvatar photoUrl={head.user.photoUrl} onAvatarLoad={this.onAvatarLoad} />
              <UserTextInfo user={head.user} />
            </Flex>
            <MessagesCountButton messageCount={head.messageCount} />
          </UserSection>

          <div className="currency-wrap">
            <RewardInfo fansCoin={head.fansCoin} fansCoinLocked={head.fansCoinLocked} />
            <WithdrawActions
              onWithdrawClick={() => {
                updateUserAccount({ showWithdrawDialog: true });
              }}
            />
            {isMobile() && (
              <MessageNoticeStyle>
                <Message type="message-notice-light">{i18nTxt('Withdrawal are processed 12PM CST every Tuesday')}</Message>
              </MessageNoticeStyle>
            )}
          </div>

          {!isMobile() && (
            <MessageNoticeStyle>
              <Message type="message-notice-light">{i18nTxt('Withdrawal are processed 12PM CST every Tuesday')}</Message>
            </MessageNoticeStyle>
          )}

          {!isMobile() && <LineSep />}
          <Settings />

          <SignOut
            onClick={() => {
              reqLogout().then(() => {
                history.push('/');
              });
            }}
          />
        </Wrapper>
        <Withdraw />
      </React.Fragment>
    );
  }
}

UserInfo.propTypes = {
  history: commonPropTypes.history.isRequired,
  resetUserAccount: PropTypes.func.isRequired,
  updateUserAccount: PropTypes.func.isRequired,
  getAccount: PropTypes.func.isRequired,
  head: PropTypes.objectOf({
    id: PropTypes.string,
  }).isRequired,
};

function mapStateToProps(state) {
  return {
    head: {
      ...state.head,
      user: state.head.user || {},
    },
  };
}

export default connect(
  mapStateToProps,
  actions
)(UserInfo);
