import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import * as actions from './action';
import { StyledWrapper, flexCenterMiddle } from '../../globalStyles/common';
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
  .user {
    position: relative;
  }
  .iconmail {
    text-decoration: none;
    position: absolute;
    font-size: 24px;
    line-height: 24px;
    top: 0px;
    right: 0px;
    cursor: pointer;
    color: #595f61;
  }
  .iconmail-dot {
    cursor: pointer;
    position: absolute;
    top: -16px;
    right: -12px;
    width: 24px;
    height: 24px;
    color: #fff;
    background: #f0453a;
    border-radius: 50%;
    text-align: center;
    font-size: 16px;
    ${flexCenterMiddle}
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
  .img-wrap {
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
  }
  .img-wrap .avatar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-size: cover;
    background-position: center;
  }
  .user-info {
    display: inline-block;
    vertical-align: middle;
  }
  .user-name {
    font-size: 24px;
    line-height: 24px;
  }
  .user-email {
    font-size: 14px;
    line-height: 14px;
    margin-top: 8px;
  }
  .withdraw-wrap {
    display: flex;
    margin-top: 40px;
  }
  .withdraw-left {
    flex: 1;
  }
  .withdraw-left-1 {
    font-size: 16px;
    color: #171d1f;
    margin-bottom: 16px;
    font-weight: 500;
  }
  .withdraw-left-2 {
    display: flex;
  }
  .withdraw-money {
    flex: 1;
    > span {
      color: #8e9394;
      font-size: 12px;
      display: block;
    }
    > strong {
      font-size: 20px;
      color: #171d1f;
      display: block;
      font-weight: 500;
    }
  }
  .withdraw-right {
    text-align: center;
    button {
      margin-top: 5px;
    }
    a {
      display: block;
      margin-top: 12px;
    }
  }
  .msg-notice {
    margin: 0 auto;
    margin-top: 20px;
  }
  .line-sep {
    height: 1px;
    background: #ebeded;
    margin-top: 40px;
    margin-left: -40px;
    margin-right: -40px;
    margin-bottom: 15px;
  }
  .settings {
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
  }
  .signout {
    margin-top: 20px;
    text-align: center;
    button {
      color: #f0453a;
    }
  }
  .question {
    vertical-align: middle;
    margin-left: 5px;
  }
`;

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
          <div className="user">
            <div className={cx('img-wrap', { withimg: head.user.photoUrl })}>
              <div
                className="avatar"
                style={{
                  backgroundImage: `url("${head.user.photoUrl || imgDefaultAvatar}")`,
                }}
              />
              <div className="img-edit">
                <input type="file" className="avatar-uploader" accept="image/jpeg,image/png,image/gif" onChange={this.onAvatarLoad} />
                {i18nTxt('EDIT')}
              </div>
            </div>

            <div className="user-info">
              <div className="user-name">{head.user.nickname}</div>
              <div className="user-email">{head.user.email}</div>
            </div>

            <Link to="/messages">
              <span className="iconmail"></span>
              {head.messageCount ? (
                <div
                  className="iconmail-dot"
                  style={{
                    fontSize: head.messageCount > 99 ? 14 : 16,
                  }}
                >
                  {head.messageCount > 99 ? '99+' : head.messageCount}
                </div>
              ) : (
                <div></div>
              )}
            </Link>
          </div>

          <div className="withdraw-wrap">
            <div className="withdraw-left">
              <div className="withdraw-left-1">
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
              <div className="withdraw-left-2">
                <div className="withdraw-money">
                  <span>{i18nTxt('Available (FC)')}</span>
                  <strong>{head.fansCoin}</strong>
                </div>
                <div className="withdraw-money">
                  <span>{i18nTxt('Locked (FC)')}</span>
                  <strong>{head.fansCoinLocked}</strong>
                </div>
              </div>
            </div>

            <div className="withdraw-right">
              <button
                onClick={() => {
                  updateUserAccount({
                    showWithdrawDialog: true,
                  });
                }}
                className="btn default waves-effect waves-light"
                type="button"
              >
                {i18nTxt('WITHDRAW')}
              </button>
              <Link to="/account-history" className="default">
                {i18nTxt('HISTORY')}
              </Link>
            </div>
          </div>

          <div className="msg-notice">
            <Message type="message-notice-light">{i18nTxt('Withdrawal are processed 12PM CST every Tuesday')}</Message>
          </div>

          <div className="line-sep" />

          <div className="settings">
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
          </div>

          <div className="signout">
            <button
              className="btn default waves-effect waves-light"
              type="button"
              onClick={() => {
                reqLogout().then(() => {
                  history.push('/');
                });
              }}
            >
              {i18nTxt('SIGN OUT')}
            </button>
          </div>
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
