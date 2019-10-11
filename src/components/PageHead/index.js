import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from './action';

import headImg from '../../assets/iconfont/conflux-head-logo.svg';
import homeImg from '../../assets/iconfont/conflux-home-logo.svg';
import UserBack from '../../assets/iconfont/user-back.svg';
import { compose, commonPropTypes, auth, isPath, i18nTxt, getDefaultLang } from '../../utils';
import PhotoImg from '../PhotoImg';
import Select from '../Select';
import iconChinaUrl from '../../assets/iconfont/china.svg';
import Tooltip from '../Tooltip';
import { reqUserUpdate } from '../../utils/api';
import media from '../../globalStyles/media';
import mAdd from '../../assets/iconfont/m-icon-add.svg';
import iconGlobal from '../../assets/iconfont/m-global.svg';
import iconGlobalHome from '../../assets/iconfont/m-global-home.svg';
import Modal from '../Modal/index';

/* eslint react/destructuring-assignment: 0 */
const Wrap = styled.div`
  ${media.tablet`display: none!important;`}

  &.normal {
    width: 100%;
    background: #ffffff;
    box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.12);
    display: flex;
    padding: 20px;
    margin-bottom: 40px;
    height: 80px;
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 100;
  }

  &.home {
    width: 100%;
    display: flex;
    padding: 20px;
    z-index: 100;
    background: transparent;
    box-shadow: none;
    height: 80px;

    &.sticky {
      position: sticky;
    }
    .head-select {
      .input-field input {
        color: #fff;
      }
      .caret path:first-child {
        stroke: #fff;
        fill: #fff;
      }
    }
  }

  .bountylogo {
    height: 40px;
  }
  .right-info {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: relative;
  }
  .right-info > button {
    display: flex;
    align-items: center;
    white-space: nowrap;
  }

  .red-dot {
    position: absolute;
    width: 8px;
    height: 8px;
    right: -4px;
    top: -4px;
    border-radius: 50%;
    z-index: 220;
    background: #f0453a;
  }
  .red-dot-hidden {
    display: none;
  }
  .bounty-user-nologin {
    width: 40px;
    height: 40px;
    font-size: 40px;
    line-height: 40px;
    margin-left: 18px;
    cursor: pointer;
  }
  .bounty-user-loigin {
    margin-left: 18px;
    position: relative;
  }
  a:hover {
    text-decoration: none;
  }
  .head-select {
    margin-left: 10px;
    width: 130px;
    .select .caret {
      top: 10px;
      right: 10px;
    }
  }

  .head-select .input-field {
    margin-top: 0;
    margin-bottom: 0;
    > input {
      cursor: pointer;
      height: 44px;
      margin: 0;
      text-indent: 10px;
    }
  }

  &.home .head-select .labelInput {
    border: 1px solid rgba(255, 255, 255, 0.6);
    color: #fff;
  }

  .select-lang-row {
    > i {
      margin-right: 7px;
      vertical-align: sub;
      width: 20px;
      display: inline-block;
      height: 16px;
      text-align: center;
    }
    > span {
      vertical-align: middle;
      font-size: 14px;
    }
    .icon-china {
      background-image: url(${iconChinaUrl});
    }
    .icon-global {
      color: #8e9394;
    }
  }
`;

const WrapMobile = styled.div`
  display: none;
  ${media.tablet`display: block!important;`}
  padding: 12px;
  z-index: 100;
  &.normal {
    background-color: #fff;
    margin-bottom: 8px;
    box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.12);
    top: 0;
    position: sticky;
  }

  &.home {
    width: 100%;
    background: transparent;
    box-shadow: none;
    &.sticky {
      position: sticky;
    }
  }

  > a {
    float: left;
  }
  .bountylogo {
    height: 32px;
    display: block;
  }

  .add-bounty {
    background: linear-gradient(98.35deg, #69C4DB 13.22%, #5499DD 81.67%);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    > i {
      background: url("${mAdd}");
      width: 12px;
      height: 12px;
    }
  }
  .change-lang {
    background-image: url("${iconGlobal}");
    background-size: 32px 32px;
  }

  &.home .change-lang {
    background-image: url("${iconGlobalHome}");
  }

  .right-info {
    float: right;
    line-height: 1;
    display: flex;
    align-items: center;
    position: relative;

    > button {
      width: 32px;
      height: 32px;
      margin-left: 6px;
      margin-right: 6px;
    }
    .withimg {
      width: 32px;
      height: 32px;
    }
  }
  .bounty-user-login {
    margin-left: 6px;
  }
  .red-dot {
    position: absolute;
    width: 8px;
    height: 8px;
    right: -4px;
    top: -4px;
    border-radius: 50%;
    z-index: 220;
    background: #f0453a;
  }
  .red-dot-hidden {
    display: none;
  }
  .bounty-user-nologin {
    margin-left: 6px;
    width: 32px;
    height: 32px;
    font-size: 32px;
    line-height: 32px;
    cursor: pointer;
  }
`;
const ChangeLangModel = styled.div`
  background-color: #fff;
  padding: 20px;
  padding-top: 26px;
  position: relative;
  z-index: 1000;
  label {
    display: block;
  }
  > .primary {
    width: 100%;
    margin-top: 28px;
  }
  label {
    margin-top: 6px;
  }

  h3 {
    font-size: 20px;
    line-height: 20px;
    color: #171d1f;
    margin: 0;
  }
  h5 {
    margin: 0;
    margin-top: 28px;
    margin-bottom: 20px;
    font-size: 16px;
    line-height: 18px;
    color: #8e9394;
  }
  .material-icons.close {
    position: absolute;
    top: 0;
    right: 0;
    top: 23px;
    font-size: 26px;
    right: 17px;
  }
`;

// eslint-disable-next-line react/prefer-stateless-function
class PageHead extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      homeSticky: false,
      modalLanguage: null,
      modelSiteLang: null,
      showChangelangModal: false,
    };

    // navigator.language to google translationg compatible language code
    // eg. zh -> zh-CN, en-US -> en
    let lang = localStorage.getItem('SITE_LANG') || getDefaultLang();
    if (lang.startsWith('zh')) {
      lang = 'zh-CN';
    }

    if (lang.startsWith('en')) {
      lang = 'en';
    }

    // TODO: support more language
    if (lang !== 'zh-CN') {
      lang = 'en';
    }

    const { updateCommon } = this.props;
    updateCommon({
      lang,
    });
  }

  componentDidMount() {
    const { getAccount, getUnreadMessageCount, history } = this.props;
    if (auth.loggedIn()) {
      getAccount();
      getUnreadMessageCount();
    }

    const pageWrapper = document.getElementById('page-wrapper');
    this.onScroll = () => {
      const { homeSticky } = this.state;
      if (pageWrapper.scrollTop > 200) {
        if (homeSticky === false) {
          this.setState({
            homeSticky: true,
          });
        }
      } else if (homeSticky === true) {
        this.setState({
          homeSticky: false,
        });
      }
    };

    history.listen((location, action) => {
      if (action === 'PUSH') {
        pageWrapper.scrollTop = 0;
      }
    });

    history.listen(location => {
      if (isPath(location, '/')) {
        pageWrapper.addEventListener('scroll', this.onScroll);
      } else {
        pageWrapper.removeEventListener('scroll', this.onScroll);
      }
    });
    // eslint-disable-next-line react/destructuring-assignment
    if (isPath(this.props.location, '/')) {
      pageWrapper.addEventListener('scroll', this.onScroll);
    }
  }

  createBounty = () => {
    const { history } = this.props;

    if (!auth.loggedIn()) {
      history.push(`/signin`);
    } else {
      history.push('/create-bounty');
    }
  };

  render() {
    const { head, location, updateCommon, lang, updateHead, history } = this.props;
    const { homeSticky, showChangelangModal } = this.state;
    let wrapClass;
    if (isPath(location, '/')) {
      if (homeSticky === true) {
        wrapClass = 'normal';
      } else {
        wrapClass = 'home';
      }
    } else {
      wrapClass = 'normal';
    }

    const selectLang = val => {
      if (auth.loggedIn()) {
        reqUserUpdate({
          language: val,
        }).then(() => {
          updateHead({
            user: {
              ...head.user,
              language: val,
            },
          });
        });
      } else {
        updateHead({
          user: {
            ...head.user,
            language: val,
          },
        });
      }
    };

    return (
      <Fragment>
        <Wrap className={wrapClass}>
          <Link to="/">
            <img src={wrapClass === 'home' ? homeImg : headImg} className="bountylogo" alt="bountylogo" />
          </Link>

          <div className="right-info">
            <button className="btn primary" type="button" onClick={this.createBounty}>
              <i className="material-icons dp48">add</i>
              <span>{i18nTxt('CREATE BOUNTY')}</span>
            </button>

            {auth.loggedIn() ? (
              <Link to="/user-info" className="bounty-user-loigin">
                <PhotoImg imgSrc={head.user.photoUrl || UserBack} alt="userimg" />
                <i className={head.messageCount > 0 ? 'red-dot' : 'red-dot-hidden'} />
              </Link>
            ) : (
              <Link
                to="/signin"
                className="bounty-user-nologin"
                style={{
                  color: wrapClass === 'home' ? '#fff' : '#171D1F',
                }}
              />
            )}

            <div className="head-select">
              <Select
                {...{
                  theme: 'langSelect',
                  labelType: 'text',
                  ulLabel: <div>{i18nTxt('Choose Language')}</div>,
                  label: '',
                  showSelectedIcon: false,
                  onSelect: v => {
                    selectLang(v.value);
                  },
                  options: [
                    {
                      label: 'English',
                      value: 'en',
                    },
                    {
                      label: '中文',
                      value: 'zh-CN',
                    },
                  ],
                  selected: {
                    value: head.user.language,
                  },
                  btnSize: 'small',
                }}
              />
            </div>

            <div className="head-select">
              <Select
                {...{
                  theme: 'langSelect',
                  labelType: 'text',
                  ulLabel: (
                    <div>
                      <span style={{ whiteSpace: 'nowrap' }}>
                        {i18nTxt('Choose your preferred')}
                        <br />
                        {i18nTxt('Country/Region')}
                      </span>
                      <Tooltip direction="topLeft" tipSpan={<i className="question" style={{ marginLeft: 5 }}></i>}>
                        <div>{i18nTxt('head.switchTips')}</div>
                      </Tooltip>
                    </div>
                  ),
                  label: '',
                  showSelectedIcon: false,
                  onSelect: v => {
                    updateCommon({
                      lang: v.value,
                    });
                    history.push('/');
                  },
                  options: [
                    {
                      label: (
                        <div className="select-lang-row">
                          <i className="icon-global"></i>
                          <span>Global</span>
                        </div>
                      ),
                      value: 'en',
                    },
                    {
                      label: (
                        <div className="select-lang-row">
                          <i className="icon-china"></i>
                          <span>中国</span>
                        </div>
                      ),
                      value: 'zh-CN',
                    },
                  ],
                  selected: {
                    value: lang,
                  },
                  btnSize: 'small',
                }}
              />
            </div>
          </div>
        </Wrap>

        <WrapMobile className={wrapClass}>
          <Link to="/">
            <img src={wrapClass === 'home' ? homeImg : headImg} className="bountylogo" alt="bountylogo" />
          </Link>

          <div className="right-info">
            <button type="button" className="add-bounty" onClick={this.createBounty}>
              <i></i>
            </button>
            <button
              type="button"
              className="change-lang"
              onClick={() => {
                this.setState({
                  showChangelangModal: true,
                  modalLanguage: head.user.language,
                  modelSiteLang: lang,
                });
              }}
            ></button>
            {auth.loggedIn() ? (
              <Link to="/user-info" className="bounty-user-login">
                <PhotoImg imgSrc={head.user.photoUrl || UserBack} alt="userimg" />
                <i className={head.messageCount > 0 ? 'red-dot' : 'red-dot-hidden'} />
              </Link>
            ) : (
              <Link
                to="/signin"
                className="bounty-user-nologin"
                style={{
                  color: wrapClass === 'home' ? '#fff' : '#171D1F',
                }}
              />
            )}
          </div>
        </WrapMobile>

        <Modal
          show={showChangelangModal}
          showOverlay
          onEsc={() => {
            this.setState({
              showChangelangModal: false,
            });
          }}
        >
          <ChangeLangModel>
            <h3>{i18nTxt('Language & Country')}</h3>
            <button
              className="material-icons close"
              onClick={() => {
                this.setState({
                  showChangelangModal: false,
                });
              }}
              type="button"
            >
              close
            </button>

            <div>
              <h5>{i18nTxt('Choose Language')}</h5>
              <label
                onClick={() => {
                  this.setState({
                    modalLanguage: 'en',
                  });
                }}
              >
                <input type="radio" className="with-gap" checked={this.state.modalLanguage === 'en'} />
                <span>Global</span>
              </label>
              <label
                onClick={() => {
                  this.setState({
                    modalLanguage: 'zh-CN',
                  });
                }}
              >
                <input type="radio" className="with-gap" checked={this.state.modalLanguage === 'zh-CN'} />
                <span>中国</span>
              </label>
            </div>

            <div>
              <h5>{i18nTxt('Choose Country/Region')}</h5>
              <label
                onClick={() => {
                  this.setState({
                    modelSiteLang: 'en',
                  });
                }}
              >
                <input type="radio" className="with-gap" checked={this.state.modelSiteLang === 'en'} />
                <span>English</span>
              </label>
              <label
                onClick={() => {
                  this.setState({
                    modelSiteLang: 'zh-CN',
                  });
                }}
              >
                <input type="radio" className="with-gap" checked={this.state.modelSiteLang === 'zh-CN'} />
                <span>中文</span>
              </label>
            </div>

            <button
              onClick={() => {
                if (this.state.modelSiteLang !== lang) {
                  updateCommon({
                    lang: this.state.modelSiteLang,
                  });
                }
                if (this.state.modalLanguage !== head.user.language) {
                  selectLang(this.state.modalLanguage);
                  history.push('/');
                }
                this.setState({
                  showChangelangModal: false,
                });
              }}
              className="btn waves-effect waves-light primary"
              type="button"
            >
              {i18nTxt('CONFIRM')}
            </button>
          </ChangeLangModel>
        </Modal>
      </Fragment>
    );
  }
}

PageHead.propTypes = {
  history: commonPropTypes.history.isRequired,
  location: commonPropTypes.location.isRequired,
  /* eslint react/forbid-prop-types: 0 */
  getAccount: PropTypes.object.isRequired,
  getUnreadMessageCount: PropTypes.object.isRequired,
  head: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  updateCommon: PropTypes.func.isRequired,
  updateHead: PropTypes.func.isRequired,
};
PageHead.defaultProps = {};

function mapStateToProps(state) {
  return {
    head: {
      ...state.head,
      user: state.head.user || {},
    },
    lang: state.common.lang,
  };
}
const enhance = compose(
  withRouter,
  connect(
    mapStateToProps,
    actions
  )
);
export default enhance(PageHead);
